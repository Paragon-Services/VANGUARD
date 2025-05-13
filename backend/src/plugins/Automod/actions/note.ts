import z from "zod";
import { asyncMap, nonNullish, resolveMember, unique, zBoundedCharacters } from "../../../utils";
import { automodAction } from "../helpers";
import { ModActionsPlugin } from "../../ModActions/ModActionsPlugin";

export const NoteAction = automodAction({
  configSchema: z.strictObject({
    reason: zBoundedCharacters(0, 4000).nullable().default(null),
    postInCaseLog: z.boolean().nullable().default(null),
    hide_case: z.boolean().nullable().default(false),
  }),

  async apply({ pluginData, contexts, actionConfig }) {
    const message = contexts.find((context) => context.message)?.message;
    const messageURL = message
      ? `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`
      : "";
    const reason = `${actionConfig.reason || "Automatic note"}${message ? `: ${messageURL}` : ""}`;

    const userIdsToNote = unique(contexts.map((c) => c.user?.id).filter(nonNullish));
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
