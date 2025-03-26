<template>
  <v-app :style="setBackground">
    <v-main>
      <campaign-navbar :logo="logo" />
      <Nuxt class="campaign" />

      <dialog-campaign-webview-ios-alert
        :dialog="iosAlertDialog"
        :url="currentUrl"
        :shortUrl="shortUrl"
      />
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
    const googleAnalyticsScript = this.campaign?.googleAnalyticScript;
    const facebookMetaPixel = this.campaign?.facebookMetaPixel;

    const scriptArray = [];
    const noscriptArray = [];
    const sanitizers = [];

    if (facebookMetaPixel) {
      const scriptMatch = facebookMetaPixel.match(
        /<script[^>]*>([\s\S]*?)<\/script>/
      );
      const noscriptMatch = facebookMetaPixel.match(
        /<noscript[^>]*>([\s\S]*?)<\/noscript>/
      );

      const scriptContent = scriptMatch ? scriptMatch[1].trim() : null;
      const noscriptContent = noscriptMatch ? noscriptMatch[1].trim() : null;

      if (scriptContent) {
        scriptArray.push({
          hid: "facebook-meta-pixel-script",
          innerHTML: scriptContent,
          type: "text/javascript",
          charset: "utf-8",
        });
      }

      if (noscriptContent) {
        noscriptArray.push({
          hid: "facebook-meta-pixel-noscript",
          innerHTML: noscriptContent,
          type: "text/html",
        });
      }

      sanitizers.push("script", "noscript");
    }

    if (googleAnalyticsScript) {
      const scriptRegex = /<script[^>]*src="([^"]*id=([^"]+))"[^>]*><\/script>/;
      const inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/;

      const srcMatch = googleAnalyticsScript.match(scriptRegex);
      const inlineMatch = googleAnalyticsScript.match(inlineScriptRegex);

      const source = srcMatch ? srcMatch[1] : null; // Full `src` with ID
      const id = srcMatch ? srcMatch[2] : null; // Only the ID (e.g., 'G-3SYRL7Q7F1')
      const inlineContent = inlineMatch ? inlineMatch[1].trim() : null;

      if (source) {
        scriptArray.push({
          hid: "google-analytics-src",
          src: source, // Dynamically include the external script
          async: true,
        });
      }

      if (inlineContent) {
        scriptArray.push({
          hid: "google-analytics-inline",
          innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `,
          type: "text/javascript",
          charset: "utf-8",
        });
      }

      sanitizers.push("script");
    }

    if (scriptArray.length > 0 || noscriptArray.length > 0) {
      return {
        script: scriptArray,
        noscript: noscriptArray,
        __dangerouslyDisableSanitizers: sanitizers,
      };
    }

    // Return an empty object if no valid script is found
    return {};
  },

  data: () => ({
    iosAlertDialog: false,
  }),

  beforeDestroy() {
    this.iosAlertDialog = false;
  },

  mounted() {
    console.log("fbtrack");
    if (this.ua === "webview") {
      const url = this.currentUrl;

      if (this.$nuxt.$ua.isFromIos() || this.$nuxt.$ua.isFromIphone()) {
        this.iosAlertDialog = true;
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
    shortUrl() {
      const host = this.$config.API_URL.replace("/api", "");
      const url = this.$route.path;

      return `${host}${url}`;
    },
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
      const img = `${this.$config.API_URL}/file/${this.campaign?.brand?.logoId}/file`;
      return img?.includes("undefined") ? "/images/logo.png" : img;
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
