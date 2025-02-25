<template>
  <v-app>
    <app-navbar :profile="profile" />
    <v-main class="o-app">
      <Nuxt class="o-app_content" />
      <v-footer absolute class="dark lighten-3">
        <general-footer />
      </v-footer>
      <snackbar />
    </v-main>

    <!-- <app-profile-dialog-email-verify :dialog="state.dialogEmailVerify" /> -->
  </v-app>
</template>

<script>
export default {
  name: "AppLayout",
  data: () => ({
    state: {
      dialogEmailVerify: false,
    },
  }),

  async created() {
    const profile = await this.$store.getters["auth/profile"];
    const emailVerified = profile.emailVerified;

    if (!emailVerified) {
      this.state.dialogEmailVerify = true;
    }
  },
  computed: {
    profile() {
      return this.$store.getters["auth/profile"];
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.o-app {
  // background: #eef5f9;
  &_content {
    // background: #eef5f9;

    max-width: 961px;
  }
}
</style>
