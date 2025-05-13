import { Snowflake, User } from "discord.js";
import { GuildPluginData } from "knub";
import { CaseTypes } from "../../../data/CaseTypes";
import { resolveUser, UnknownUser } from "../../../utils";
import { CasesPlugin } from "../../Cases/CasesPlugin";
import { LogsPlugin } from "../../Logs/LogsPlugin";
import { ModActionsPluginType, NoteOptions, NoteResult } from "../types";

export async function noteMember(
  pluginData: GuildPluginData<ModActionsPluginType>,
  reason: string,
  user: User | UnknownUser,
  noteOptions: NoteOptions = {},
): Promise<NoteResult> {
  const modId = noteOptions.caseArgs?.modId ?? pluginData.client.user!.id;
  const casesPlugin = pluginData.getPlugin(CasesPlugin);

  const createdCase = await casesPlugin.createCase({
    ...(noteOptions.caseArgs || {}),
    userId: user!.id,
    modId,
    type: CaseTypes.Note,
    reason,
  });

  const mod = (await resolveUser(pluginData.client, modId as Snowflake)) as User;

  await pluginData.getPlugin(LogsPlugin).logMemberNote({
    mod,
    user,
    caseNumber: createdCase.case_number,
    reason: reason ?? "",
  });

  pluginData.state.events.emit("note", user.id, reason, noteOptions.isAutomodAction);

  return {
    status: "success",
    case: createdCase,
  };
}
