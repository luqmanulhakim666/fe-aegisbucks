<template>
  <v-app-bar fixed flat color="white" height="70" dense>
    <div class="d-flex align-center ml-6">
      <div class="pointer d-flex" @click="goHome()">
        <general-logo-lpdb class="mx-4" />
        <general-logo-ridi />
      </div>
    </div>
    <v-spacer />
    <div class="menu_item d-lg-flex align-center hidden-lg-and-down">
      <div
        v-for="(item, index) in menu"
        :key="index"
        class="menu_item mx-10 d-flex align-center justify-space-between"
        v-bind:class="{
          'menu_item--active': activeRoute(item.path),
        }"
      >
        <span
          class="h7--xxsmall dark--text pointer"
          @click="onRedirect(item.path)"
        >
          {{ item.text }}
        </span>
      </div>

      <general-dialog-confirm
        :dialog="isDialog"
        @on:close="handleDialog"
        @on:submit="onLogin()"
        color="primary lighten-5"
        actionText="Login"
        icon="mdi-alert-decagram"
        title="Silahkan login terlebih dahulu untuk mengakses E-Learning"
      />
      <general-navbar-auth :list="menu_auth" />
    </div>
    <!----- mobile menu ---->
    <general-navbar-mobile-sidebar />
    <!----- mobile menu ---->
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    menu: [],
    menu_auth: [],
    isDialog: false,
  }),

  methods: {
    activeRoute(val) {
      let path = this.$route?.path;
      return val === path;
    },

    onRedirect(path) {
      if (path === "/e-learning") {
        this.isDialog = true;
        return;
      }
      this.$router.push(path);
    },

    handleDialog() {
      this.isDialog = !this.isDialog;
    },

    onLogin() {
      this.isDialog = false;
      this.$router.push("/login");
    },

    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-toolbar__content,
.v-toolbar__extension {
  padding: 0;
}

.menu_item {
  height: 70px;
  // border-bottom: 2px solid transparent;
  &--active {
    border-bottom: 2px solid var(--v-primary-base);
  }
}
</style>
