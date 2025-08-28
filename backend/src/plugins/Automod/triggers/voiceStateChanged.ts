import { Snowflake } from "discord.js";
import z from "zod/v4";
import { renderUsername, zSnowflake } from "../../../utils.js";
import { automodTrigger } from "../helpers.js";

interface VoiceStateChangedMatchResult {
  left?: string;
  joined?: string;
}

const configSchema = z.strictObject({
  left: z.union([z.boolean(), zSnowflake, z.array(zSnowflake).max(255)]).default([]),
  joined: z.union([z.boolean(), zSnowflake, z.array(zSnowflake).max(255)]).default([]),
});

export const VoiceStateChangedTrigger = automodTrigger<VoiceStateChangedMatchResult>()({
  configSchema,

  async match({ triggerConfig, context }) {
    if (!context.member || !context.voiceStateChanged) {
      return;
    }

    const left = context.voiceStateChanged.oldVoiceChannelId;
    const joined = context.voiceStateChanged.newVoiceChannelId;
    let leftMatches = Array.isArray(triggerConfig.left) ? triggerConfig.left : null;
    let joinedMatches = Array.isArray(triggerConfig.joined) ? triggerConfig.joined : null;

    if (typeof triggerConfig.left === 'string') {
      leftMatches = [triggerConfig.left];
    }

    if (typeof triggerConfig.joined === 'string') {
      joinedMatches = [triggerConfig.joined];
    }

    const leftTriggered = Boolean(triggerConfig.left === true && left || left && leftMatches?.includes(left));
    const joinedTriggered = Boolean(triggerConfig.joined === true && joined || joined && joinedMatches?.includes(joined));

    if (leftTriggered || joinedTriggered) {
      return { extra: { left, joined } };
    }
  },

  renderMatchInformation({ matchResult, pluginData, contexts }) {
    const leftChannel = pluginData.guild.channels.cache.get(matchResult.extra.left as Snowflake);
    const leftChannelName = `${leftChannel?.name} (\`${matchResult.extra.left}\`)` || `id \`${matchResult.extra.left}\``;
    const joinedChannel = pluginData.guild.channels.cache.get(matchResult.extra.joined as Snowflake);
    const joinedChannelName = `${joinedChannel?.name} (\`${matchResult.extra.joined}\`)` || `id \`${matchResult.extra.joined}\``;
    const member = contexts[0].member!;
    const memberName = `**${renderUsername(member)}** (\`${member.id}\`)`;

    const leftPart = matchResult.extra.left ? `left voice channel ${leftChannelName}` : null;
    const joinedPart = matchResult.extra.joined ? `joined voice channel ${joinedChannelName}` : null;
    const glue = leftPart && joinedPart ? ' and ' : '';

    return `Member ${memberName} ${leftPart ?? ''}${glue}${joinedPart ?? ''}`;
  },
});
