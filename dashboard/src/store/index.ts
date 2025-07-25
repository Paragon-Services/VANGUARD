import { createStore, Store } from "vuex";

import { RootState } from "./types";
import { ArchiveStore } from "./archives";
import { AuthStore } from "./auth";
import { GuildStore } from "./guilds";
import { DocsStore } from "./docs";

export const RootStore = createStore({
  modules: {
    archives: ArchiveStore,
    auth: AuthStore,
    guilds: GuildStore,
    docs: DocsStore,
  },
});

// Set up typings so Vue/our components know about the state's types
declare module "vue" {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}
