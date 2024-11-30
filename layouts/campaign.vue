<template>
  <v-app :style="setBackground">
    <v-main>
      <campaign-navbar :logo="logo" />
      <div v-if="campaign.id === '0192140a-6efa-7ee4-83ad-28a05032595d'">
        {{ ua }}
      </div>

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
  head() {
    const data = this.$store.getters["campaign/data"];
    const metaPixelCode = data?.googleAnalyticScript;

    if (metaPixelCode) {
      const scriptMatch = metaPixelCode.match(
        /<script[^>]*>([\s\S]*?)<\/script>/
      );
      const noscriptMatch = metaPixelCode.match(
        /<noscript[^>]*>([\s\S]*?)<\/noscript>/
      );

      const scriptContent = scriptMatch ? scriptMatch[1].trim() : null;
      const noscriptContent = noscriptMatch ? noscriptMatch[1].trim() : null;

      return {
        script: [
          {
            scriptContent,
          },
        ],
        noscript: [
          {
            noscriptContent,
          },
        ],
        __dangerouslyDisableSanitizers: ["script", "noscript"], // Prevent escaping of the script content
      };
    }
  },

  computed: {
    ua() {
      // user agent
      let browser = this.$nuxt.$ua.browser();

      return String(browser).toLowerCase();
    },

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
        ? `background: url(${this.$config.API_URL}/file/${this.campaign?.backgroundImageId}/file?auto=format,compress&w=720);
         background-attachment: fixed;
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
