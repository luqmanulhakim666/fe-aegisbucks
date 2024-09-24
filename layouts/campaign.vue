<template>
  <v-app>
    <v-main class="campaign">
      <campaign-navbar :logo="logo" />
      <Nuxt />
      <campaign-footer />
    </v-main>
    <snackbar />
  </v-app>
</template>

<script>
export default {
  computed: {
    campaign() {
      const data = this.$store.getters["campaign/data"];

      if (data?.id) {
        return data;
      }
    },

    logo() {
      return `${this.$config.API_URL}/file/${this.campaign?.brand?.logoId}/file`;
    },
  },
};
</script>

<style lang="scss" scoped>
.campaign {
  max-width: 500px;
  width: 100%;
  z-index: 0;
  margin: auto;
}
</style>
