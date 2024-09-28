<!-- GoogleSignin.vue -->
<template>
  <div class="d-flex mx-auto justify-center">
    <!-- Google Sign-In Button -->
    <div
      id="g_id_onload"
      :data-client_id="client_id"
      data-context="signin"
      data-callback="handleCredentialResponse"
    ></div>
    <div
      class="g_id_signin"
      data-type="standard"
      data-size="large"
      data-theme="filled_blue"
      data-text="signin_with"
      data-shape="rectangular"
      data-width="364"
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
    this.client_id = process.env.GOOGLE_CLIENT_ID; // Set the client ID from environment variables
  },

  mounted() {
    // Register the handleCredentialResponse function globally
    window.handleCredentialResponse = (response) => {
      const jwt = response.credential;
      // Emit the JWT token to the parent or handle the response as needed
      this.$emit("loginSuccess", jwt);
    };
  },

  beforeDestroy() {
    // Clean up the global function when the component is destroyed
    delete window.handleCredentialResponse;
  },
};
</script>
