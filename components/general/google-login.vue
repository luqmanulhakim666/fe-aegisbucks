<template>
  <div>
    <div v-if="campaignId === '0192140a-6efa-7ee4-83ad-28a05032595d'">
      {{ uaCategory }}
      <v-btn @click="openWebBrowser()">open link</v-btn>
    </div>
    <button
      class="google-login-btn d-flex justify-center full-width pa-3"
      @click="loginWithGoogle"
    >
      <div
        class="google-icon-wrapper d-flex justify-center align-center white pa-2"
      >
        <img class="google-icon" src="/google-color.svg" alt="Google icon" />
      </div>
      <span class="ml-6">Login with Google </span>
    </button>
  </div>
</template>

<script>
import tracking from "@/mixins/tracking";
let Cookie; // Declare this globally

export default {
  mixins: [tracking],
  props: {
    form: Object,
    campaignId: String,
  },
  data: () => ({
    state: {
      isDialog: false,
    },
  }),
  mounted() {
    // Ensure the code only runs on the client-side
    if (process.client) {
      Cookie = require("js-cookie"); // Initialize `js-cookie` only in client
    }
  },
  computed: {
    uaCategory() {
      console.log(this.$nuxt.$ua);
      return this.$nuxt.$ua?._parsed?.category;
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
  },
  methods: {
    openWebBrowser() {
      const url = this.currentUrl;

      if (this.$nuxt.$ua.isFromIos() || this.$nuxt.$ua.isFromIphone()) {
        window.open(url, "_blank");
        return;
      }

      const intentUrl = `intent://${url.replace(
        "https://",
        ""
      )}#Intent;scheme=https;end;`;
      window.location.href = intentUrl;
    },

    loginWithGoogle() {
      if (this.ua === "webview") {
        this.openWebBrowser();
        return;
      }

      if (process.client) {
        // Set the callback URL to cookies (only on client)
        Cookie.set("googleCallback", window.location.href);

        localStorage.setItem("form", JSON.stringify(this.form));

        // Get the client ID from environment variables
        const clientId = process.env.GOOGLE_CLIENT_ID;

        // Build the redirect URL for the OAuth2 flow
        const redirectUri = encodeURIComponent(
          `${window.location.origin}/google/callback`
        );

        // Define the Google OAuth2 scopes and response type
        const scope = "profile email";
        const responseType = "token";

        // Construct the Google authorization URL
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

        // Output the authorization URL for debugging purposes

        // Redirect the user to the Google OAuth2 login page
        window.location.href = authUrl;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.google-login-btn {
  position: relative;
  background-color: #4285f4;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  color: white;
  font-family: Arial, sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.google-login-btn:hover {
  background-color: rgba(27, 111, 245, 0.747);
}

.google-icon-wrapper {
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.google-icon {
  height: 20px;
  width: 20px;
}

.google-login-btn span {
  font-weight: bold;
}
</style>
