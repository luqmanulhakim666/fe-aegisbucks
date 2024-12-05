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

  mounted() {
    if (this.ua === "webview") {
      const url = this.currentUrl;

      if (this.$nuxt.$ua.isFromIos() || this.$nuxt.$ua.isFromIphone()) {
        // const ipPublic = "103.196.154.7";
        // const bridge = window.open(url, "_self");
        // const safari = `ftp://${ipPublic}/${bridge}`;
        // window.open(safari, "_self");
        // return;
        // const ipAddress = `ftp://${ipPublic}/${url}`; // Assuming `url` is a valid path
        // window.location.href = ipAddress; // Redirect directly to the FTP URL
        // return;
      }

      const intentUrl = `intent://${url.replace(
        "https://",
        ""
      )}#Intent;scheme=https;end;`;

      window.location.href = intentUrl;
    }
  },
  computed: {
    currentUrl() {
      const host = this.$config.API_URL.replace("/api", "");
      const url = this.$route.fullPath;

      return `${host}${url}`;
    },
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
