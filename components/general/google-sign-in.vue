<!-- GoogleSignin.vue -->
<template>
  <div class="d-flex mx-auto justify-center">
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
      data-theme="outline"
      data-text="signin_with"
      data-shape="rectangular"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    client_id: "",
  }),

  created() {
    this.client_id = process.env.GOOGLE_CLIENT_ID;
  },

  mounted() {
    window.handleCredentialResponse = (response) => {
      const jwt = response.credential;
      // Emit the JWT token to the parent
      this.$emit("loginSuccess", jwt);
    };
  },
};
</script>
