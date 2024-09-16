<template>
  <v-app>
    <general-drawer :menu="items" />
    <v-main class="o-app">
      <v-divider class="white" />
      <v-container class="mb-16">
        <Nuxt />
      </v-container>
      <v-footer absolute class="dark lighten-3">
        <general-footer />
      </v-footer>
      <snackbar />
    </v-main>
  </v-app>
</template>

<script>
import { SUPER_ADMIN } from "@/data/menu";
export default {
  name: "DefaultLayout",
  data: () => ({
    items: [],
  }),

  created() {
    this.setMenu();
  },

  methods: {
    async setMenu() {
      this.items = SUPER_ADMIN;
    },
  },
};
</script>

<style lang="scss" scoped>
.o-app {
  background: #eef5f9;
}
</style>
