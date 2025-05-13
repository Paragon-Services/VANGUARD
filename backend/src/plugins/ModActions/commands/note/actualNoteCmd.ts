import { Attachment, ChatInputCommandInteraction, Message, User } from "discord.js";
import { GuildPluginData } from "knub";
import { UnknownUser, renderUsername } from "../../../../utils";
import { handleAttachmentLinkDetectionAndGetRestriction } from "../../functions/attachmentLinkReaction";
import { formatReasonWithMessageLinkForAttachments } from "../../functions/formatReasonForAttachments";
import { parseReason } from "../../functions/parseReason";
import { ModActionsPluginType } from "../../types";
import { noteMember } from "../../functions/noteMember";

export async function actualNoteCmd(
  pluginData: GuildPluginData<ModActionsPluginType>,
  context: Message | ChatInputCommandInteraction,
  author: User,
  attachments: Array<Attachment>,
  user: User | UnknownUser,
  note: string,
) {
  if (await handleAttachmentLinkDetectionAndGetRestriction(pluginData, context, note)) {
    return;
  }

  const userName = renderUsername(user);
  const parsedReason = parseReason(pluginData.config.get(), note);
  const reason = await formatReasonWithMessageLinkForAttachments(pluginData, parsedReason, context, attachments);

  const noteResult = await noteMember(pluginData, reason, user, { caseArgs: { modId: author.id } });

  if (noteResult.status === "failed") {
    const failReason = noteResult.error ? `: ${noteResult.error}` : "";

    await pluginData.state.common.sendErrorMessage(context, `Failed to add a note to user${failReason}`);

    return;
  }

  void pluginData.state.common.sendSuccessMessage(
    context,
    `Note added on **${userName}** (Case #${noteResult.case.case_number})`,
    undefined,
    undefined,
    true,
  );
}
