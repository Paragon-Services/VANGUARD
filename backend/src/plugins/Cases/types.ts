import { BasePluginType } from "knub";
import { U } from "ts-toolbelt";
import z from "zod/v4";
import { CaseNameToType, CaseTypes } from "../../data/CaseTypes.js";
import { GuildArchives } from "../../data/GuildArchives.js";
import { GuildCases } from "../../data/GuildCases.js";
import { GuildLogs } from "../../data/GuildLogs.js";
import { GuildSavedMessages } from "../../data/GuildSavedMessages.js";
import { keys, zBoundedCharacters, zDelayString, zSnowflake } from "../../utils.js";
import { zColor } from "../../utils/zColor.js";

const caseKeys = keys(CaseNameToType) as U.ListOf<keyof typeof CaseNameToType>;

const caseColorsTypeMap = caseKeys.reduce((map, key) => {
  map[key] = zColor;
  return map;
}, {} as Record<typeof caseKeys[number], typeof zColor>);

const caseIconsTypeMap = caseKeys.reduce((map, key) => {
  map[key] = zBoundedCharacters(0, 100);
  return map;
}, {} as Record<typeof caseKeys[number], z.ZodString>);

export const zCasesConfig = z.strictObject({
  log_automatic_actions: z.boolean().default(true),
  case_log_channel: zSnowflake.nullable().default(null),
  show_relative_times: z.boolean().default(true),
  relative_time_cutoff: zDelayString.default("1w"),
  guild_aliases: z.nullable(z.record(z.string(), z.string())).default(null),
  case_colors: z.strictObject(caseColorsTypeMap).partial().nullable().default(null),
  case_icons: z.strictObject(caseIconsTypeMap).partial().nullable().default(null),
  log_each_massban_case: z.boolean().default(false),
  log_each_massunban_case: z.boolean().default(false),
  embed_colour: z.number().default(0x2b2d31),
  embed_color: z.number().default(0x2b2d31),
});

export interface CasesPluginType extends BasePluginType {
  configSchema: typeof zCasesConfig;
  state: {
    logs: GuildLogs;
    cases: GuildCases;
    archives: GuildArchives;
    savedMessages: GuildSavedMessages;
  };
}

/**
 * Can also be used as a config object for functions that create cases
 */
export type CaseArgs = {
  userId: string;
  modId: string;
  ppId?: string;
  type: CaseTypes;
  auditLogId?: string;
  reason?: string;
  automatic?: boolean;
  postInCaseLogOverride?: boolean;
  noteDetails?: string[];
  extraNotes?: string[];
  hide?: boolean;
};

export type CaseNoteArgs = {
  caseId: number;
  modId: string;
  body: string;
  automatic?: boolean;
  postInCaseLogOverride?: boolean;
  noteDetails?: string[];
};
