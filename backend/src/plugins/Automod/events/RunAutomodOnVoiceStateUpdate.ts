import { guildPluginEventListener } from "knub";
import { isEqual } from "lodash-es";
import { runAutomod } from "../functions/runAutomod.js";
import { AutomodContext, AutomodPluginType } from "../types.js";

export const RunAutomodOnVoiceStateUpdate = guildPluginEventListener<AutomodPluginType>()({
  event: "voiceStateUpdate",
  listener({ pluginData, args: { oldState, newState } }) {
    if (!newState?.member) return;

    const oldVoiceChannelId = oldState?.channelId ?? undefined;
    const newVoiceChannelId = newState?.channelId ?? undefined;

    if (isEqual(oldVoiceChannelId, newVoiceChannelId)) return;

    const context: AutomodContext = {
      timestamp: Date.now(),
      user: newState.member.user,
      member: newState.member,
      voiceStateChanged: {
        oldVoiceChannelId,
        newVoiceChannelId,
      },
    };

    pluginData.state.queue.add(() => {
      runAutomod(pluginData, context);
    });
  },
});
