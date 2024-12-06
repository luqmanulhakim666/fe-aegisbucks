<template>
  <v-app>
    <app-navbar />
    <v-main class="o-app">
      <!-- <v-divider class="white" /> -->
      <Nuxt class="o-app_content" />
      <v-footer absolute class="dark lighten-3">
        <general-footer />
      </v-footer>
      <snackbar />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "AppLayout",
  data: () => ({}),

  created() {},

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
