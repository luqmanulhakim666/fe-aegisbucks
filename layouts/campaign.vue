<template>
  <v-app :style="setBackground">
    <v-main>
      <campaign-navbar :logo="logo" />
      <Nuxt class="campaign" />

      <dialog-campaign-webview-ios-alert
        :dialog="iosAlertDialog"
        :url="currentUrl"
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
    const scriptArray = [
      // ✅ My Personal Google Analytics (Always Loaded)
      {
        hid: "my-google-analytics-src",
        src: "https://www.googletagmanager.com/gtag/js?id=G-KJ8W3YMZ32",
        async: true,
      },
      {
        hid: "my-google-analytics-inline",
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KJ8W3YMZ32');
        `,
        type: "text/javascript",
        charset: "utf-8",
      },
    ];

    // ✅ Inject Campaign-Specific Google Analytics If It Exists
    if (this.campaign?.googleAnalyticScript) {
      scriptArray.push({
        hid: "campaign-google-analytics",
        innerHTML: this.campaign.googleAnalyticScript,
        type: "text/javascript",
        charset: "utf-8",
      });
    }

    // ✅ Inject Facebook Meta Ads Pixel If It Exists
    if (this.campaign?.facebookPixelScript) {
      scriptArray.push({
        hid: "facebook-meta-pixel",
        innerHTML: this.campaign.facebookPixelScript,
        type: "text/javascript",
        charset: "utf-8",
      });
    }

    return {
      script: scriptArray,
      __dangerouslyDisableSanitizersByTagID: {
        "my-google-analytics-inline": ["innerHTML"],
        "campaign-google-analytics": ["innerHTML"],
        "facebook-meta-pixel": ["innerHTML"],
      },
    };
  },

  data: () => ({
    iosAlertDialog: false,
  }),

  beforeDestroy() {
    this.iosAlertDialog = false;
  },

  mounted() {
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
