<template>
  <div>
    <v-navigation-drawer floating v-model="drawer" fixed app class="drawer">
      <general-logo class="mx-auto mt-2" :max_width="160" />
      <div class="mt-4">
        <div v-for="(item, i) in menu" :key="i">
          <p class="h7--xxsmall ml-5">{{ item.name }}</p>

          <div v-for="(list, index) in item.menus" :key="index">
            <v-list v-if="!list.sub_items">
              <v-list-item-group light>
                <v-list-item class="pointer" link :to="list.path">
                  <v-icon class="dark--text mr-6">{{ list.icon }}</v-icon>
                  <v-list-item-content>
                    <v-list-item-title class="dark--text text--default">
                      {{ list.text }}
                      <p>{{ list.sub_items }}</p>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-list-group
              class="mb-2"
              no-action
              v-if="list.sub_items"
              active-class="v-list-item--active"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon width="24">
                    {{ list.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title class="dark--text text--default">{{
                  list.text
                }}</v-list-item-title>
              </template>

              <v-list-item
                v-for="(child, index) in list.sub_items"
                :key="index"
                class="mb-4 mt-1 ml-n2"
                link
                active-class="v-list-item--active_child"
                :to="child.path"
              >
                <v-avatar
                  color="primary"
                  size="8"
                  class="drawer__groups__dots"
                  v-if="path === child.text.toLowerCase()"
                />
                <v-list-item-title class="text--default dark--text">{{
                  child.text
                }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <general-app-bar @on:show-sidebar="onShowSidebar" />
  </div>
</template>

<script>
import screen from "@/mixins/screen";
export default {
  mixins: [screen],
  props: {
    menu: Array,
  },

  data: () => ({
    drawer: null,
    path: "",
  }),

  created() {
    this.activeRoute = this.$route?.path;
    this.drawer = !this.isMobile;
  },

  computed: {
    profile() {
      return this.$store.getters["auth/profile"];
    },

    getAvatar() {
      return this.profile?.image;
    },
  },

  methods: {
    onRedirect(path) {
      // let role = this.$store.getters["auth/role"];
      let role = this.$store.getters["auth/role"];
      let prefix = `/${role}`;
      let except = ["/logout", "/profile", "/e-learning"];

      // path = except.includes(path) ? path : prefix + path;

      return `/admin/${path}`;
    },

    onShowSidebar() {
      this.drawer = true;
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.path = val.name;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
}

.v-list-item {
  border-left: 2px solid transparent;
  z-index: 1;
  &--active {
    // background: var(--v-primary-base);
    border-left: 3px solid var(--v-primary-base);
    color: var(--v-primary-base) !important;

    .v-list-item__title {
      color: var(--v-primary-base) !important;
    }

    .v-icon {
      color: var(--v-primary-base) !important;
    }

    &_child {
      background: transparent !important;

      &::after {
        content: "";
        width: 8px;
        min-height: 8px;
        position: absolute;
        border-radius: 100%;
        background-color: var(--v-error-base);
        left: 46px;
      }
    }
  }
}
</style>
