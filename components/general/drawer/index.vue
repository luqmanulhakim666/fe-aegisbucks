<template>
  <div>
    <v-navigation-drawer floating v-model="drawer" fixed app class="drawer">
      <general-logo class="mx-auto" :max_width="80" />
      <div class="mt-4">
        <div v-for="(item, i) in menu" :key="i">
          <p class="h7--xxsmall ml-5">{{ item.name }}</p>
          <v-list>
            <v-list-item-group light>
              <v-list-item
                v-for="(list, index) in item.menus"
                :key="index"
                class="pointer"
                link
                :to="list.path"
              >
                <v-icon class="dark--text mr-6">{{ list.icon }}</v-icon>
                <v-list-item-content>
                  <v-list-item-title class="dark--text text--default">
                    {{ list.text }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <general-app-bar @on:show-sidebar="onShowSidebar" />
  </div>
</template>

<script>
export default {
  props: {
    menu: Array,
  },

  data: () => ({
    drawer: true,
    path: "",
  }),

  created() {
    this.activeRoute = this.$route?.path;
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
        background-color: var(--v-secondary-lighten5);
        left: 46px;
      }
    }
  }
}
</style>
