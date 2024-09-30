<template>
  <div class="google-signin-wrapper">
    <!-- Google Sign-In Button -->
    <div
      id="g_id_onload"
      :data-client_id="client_id"
      data-context="signin"
      data-callback="handleCredentialResponse"
    ></div>
    <div
      class="g_id_signin google-signin-button d-flex justify-center"
      data-type="standard"
      data-size="large"
      data-theme="filled_blue"
      data-text="signin_with"
      data-shape="rectangular"
      data-width="278"
      data-auto_prompt="false"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      client_id: "", // Your Google Client ID
    };
  },

  created() {
    this.client_id = process.env.GOOGLE_CLIENT_ID;
  },

  mounted() {
    window.handleCredentialResponse = (response) => {
      if (response && response.credential) {
        const jwt = response.credential;
        this.$emit("loginSuccess", jwt);
      } else {
        console.error("No credential response or token.");
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  },

  beforeDestroy() {
    if (window.handleCredentialResponse) {
      delete window.handleCredentialResponse;
    }
  },
};
</script>

<style scoped>
.google-signin-wrapper {
  width: 100%;
}

.google-signin-button {
  width: 100% !important;
}
</style>
