import { GuildPluginData } from "knub";
import { LogsPluginType } from "../types.js";
import { LogType } from "../../../data/LogType.js";
import { log } from "../util/log.js";
import { createTypedTemplateSafeValueContainer } from "../../../templateFormatter.js";
import { User } from "discord.js";
import { userToTemplateSafeUser } from "../../../utils/templateSafeObjects.js";

export interface LogMassWarnData {
  mod: User;
  count: number;
  reason: string;
}

export function logMassWarn(pluginData: GuildPluginData<LogsPluginType>, data: LogMassWarnData) {
  return log(
    pluginData,
    LogType.MASSWARN,
    createTypedTemplateSafeValueContainer({
      mod: userToTemplateSafeUser(data.mod),
      count: data.count,
      reason: data.reason,
    }),
    {},
  );
}
