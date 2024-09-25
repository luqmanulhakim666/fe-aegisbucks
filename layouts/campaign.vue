<template>
  <v-app :style="setBackground">
    <v-main>
      <campaign-navbar :logo="logo" />
      <Nuxt class="campaign" />
      <v-footer height="auto" class="dark lighten-3">
        <campaign-footer />
      </v-footer>
      <snackbar />
    </v-main>
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

    setBackground() {
      return this.campaign?.backgroundImageId
        ? `background: url(${this.$config.API_URL}/file/${this.campaign?.backgroundImageId}/file)
            no-repeat;
          background-size: cover;`
        : "";
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
