import z from "zod/v4";
import { asyncMap, nonNullish, resolveMember, unique, zBoundedCharacters } from "../../../utils.js";
import { automodAction } from "../helpers.js";
import { ModActionsPlugin } from "../../ModActions/ModActionsPlugin.js";

export const NoteAction = automodAction({
  configSchema: z.strictObject({
    reason: zBoundedCharacters(0, 4000).nullable().default(null),
    add_link_to_reason: z.boolean().nullable().default(null),
    postInCaseLog: z.boolean().nullable().default(null),
    hide_case: z.boolean().nullable().default(false),
    // User can either be a user snowflake or a string
    user: z
      .union([z.string(), z.strictObject({ nth_mention: z.number().int().positive() })])
      .nullable()
      .default(null),
  }),

  async apply({ pluginData, contexts, actionConfig }) {
    const message = contexts.find((context) => context.message)?.message;
    const messageURL = message
      ? `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`
      : "";
    const reasonSuffix = message && actionConfig.add_link_to_reason ? `: ${messageURL}` : "";
    const userMentions = message ? message.data.content.match(/<@!?(\d{16,19})>/gu) ?? [] : [];
    const reason = `${actionConfig.reason || "Automatic note"}${reasonSuffix}`;

    let userIdsToNote = unique(contexts.map((c) => c.user?.id).filter(nonNullish));

    switch (typeof actionConfig.user) {
      case "string":
        userIdsToNote = [actionConfig.user];
        break;

      case "object":
        if (!actionConfig.user!.nth_mention) {
          return;
        }

        const nth = actionConfig.user!.nth_mention; // eslint-disable-line no-case-declarations
        userIdsToNote = userMentions.length >= nth ? [userMentions[nth - 1]] : [];

        break;
    }

    if (userIdsToNote.length < 1) {
      return;
    }

    const membersToNote = await asyncMap(userIdsToNote, (id) => resolveMember(pluginData.client, pluginData.guild, id));
    const modActions = pluginData.getPlugin(ModActionsPlugin);

    for (const member of membersToNote) {
      if (!member) continue;

      await modActions.noteMember(reason, member.user, {
        caseArgs: {
          postInCaseLogOverride: actionConfig.postInCaseLog ?? undefined,
        },
      });
    }
  },
});
