<template>
  <div>
    <v-btn
      depressed
      fab
      size="24"
      class="hidden-lg-and-up transparent"
      @click="state.drawer = true"
    >
      <v-icon size="36" color="#757575">mdi-menu</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="state.drawer"
      absolute
      temporary
      left
      width="350"
      height="100vh"
      class="px-6 pt-4"
    >
      <div class="d-flex">
        <v-btn
          depressed
          fab
          size="24"
          class="hidden-lg-and-up transparent ml-auto"
          @click="state.drawer = false"
        >
          <v-icon size="36" color="#757575"> mdi-close </v-icon>
        </v-btn>
      </div>

      <v-list nav class="h7--xxsmall dark--text text--lighten-4 py-6">
        <v-list-item-group v-model="state.group" active-class="text--accent-4">
          <general-navbar-mobile-auth-dropdown :menus="items.menu_auth" />

          <v-divider class="mb-4"></v-divider>

          <v-list-item
            v-for="(item, i) of items.menu"
            :key="i"
            active-class="sidebar__item-active"
          >
            <v-list-item-title @click="onGo(item.path)"
              >{{ item.text }}
            </v-list-item-title>
          </v-list-item>

          <v-divider class="my-4"></v-divider>
        </v-list-item-group>

        <div class="d-flex justify-center pt-6">
          <general-logo-lpdb max_width="100" class="mr-3" />
          <general-logo-ridi max_width="50" />
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: {
      menu: [],
      menu_auth: [],
    },

    state: {
      drawer: false,
      group: null,
      lang: "",
    },
  }),

  methods: {
    onGo(path) {
      this.$router.push(path);
    },

    onGoAccessAccount(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .v-navigation-drawer {
    padding-right: 0 !important;
  }

  .v-list-item--active {
    border-radius: 8px;
    background: var(--v-secondary-lighten2);
  }
}
</style>
