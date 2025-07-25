import { modActionsEvt } from "../types.js";
import { BanSlashCmdAutocomplete } from "../commands/ban/BanSlashCmd.js";
import { AddCaseSlashCmdAutocomplete } from "../commands/addcase/AddCaseSlashCmd.js";
import { ForceBanSlashCmdAutocomplete } from "../commands/forceban/ForceBanSlashCmd.js";
import { ForceMuteSlashCmdAutocomplete } from "../commands/forcemute/ForceMuteSlashCmd.js";
import { ForceUnmuteSlashCmdAutocomplete } from "../commands/forceunmute/ForceUnmuteSlashCmd.js";
import { KickSlashCmdAutocomplete } from "../commands/kick/KickSlashCmd.js";
import { MuteSlashCmdAutocomplete } from "../commands/mute/MuteSlashCmd.js";
import { NoteSlashCmdAutocomplete } from "../commands/note/NoteSlashCmd.js";
import { UnbanSlashCmdAutocomplete } from "../commands/unban/UnbanSlashCmd.js";
import { UnmuteSlashCmdAutocomplete } from "../commands/unmute/UnmuteSlashCmd.js";
import { UpdateSlashCmdAutocomplete } from "../commands/update/UpdateSlashCmd.js";
import { WarnSlashCmdAutocomplete } from "../commands/warn/WarnSlashCmd.js";
import { MassBanSlashCmdAutocomplete } from "../commands/massban/MassBanSlashCmd.js";
import { MassKickSlashCmdAutocomplete } from "../commands/masskick/MassKickSlashCmd.js";
import { MassMuteSlashCmdAutocomplete } from "../commands/massmute/MassMuteSlashCmd.js";
import { MassUnbanSlashCmdAutocomplete } from "../commands/massunban/MassUnbanSlashCmd.js";
import { MassWarnSlashCmdAutocomplete } from "../commands/masswarn/MassWarnSlashCmd.js";

export const AutocompleteEvt = modActionsEvt({
  event: "interactionCreate",
  async listener({ pluginData, args: { interaction } }) {
    if (!interaction.isAutocomplete()) {
      return;
    }

    const options = interaction.options;

    if (interaction.commandName !== "mod") {
      return;
    }

    switch (options.getSubcommand(true)) {
      case "addcase":
        AddCaseSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "ban":
        BanSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "forceban":
        ForceBanSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "forcemute":
        ForceMuteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "forceunmute":
        ForceUnmuteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "kick":
        KickSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "massban":
        MassBanSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "masskick":
        MassKickSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "massmute":
        MassMuteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "massunban":
        MassUnbanSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "masswarn":
        MassWarnSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "mute":
        MuteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "note":
        NoteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "unban":
        UnbanSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "unmute":
        UnmuteSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "update":
        UpdateSlashCmdAutocomplete({ pluginData, interaction });
        break;

      case "warn":
        WarnSlashCmdAutocomplete({ pluginData, interaction });
        break;
    }
  },
});
