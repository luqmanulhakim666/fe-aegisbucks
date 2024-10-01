<template>
  <div class="d-flex full-width">
    <button class="google-login-btn full-width" @click="loginWithGoogle">
      <img class="google-icon" src="/google.png" alt="Google icon" />
      <span>Login with Google</span>
    </button>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  props: {
    callback: String,
  },
  methods: {
    loginWithGoogle() {
      Cookie.set("googleCallback", window.location.href);
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/google/callback`
      );
      const scope = "profile email";
      const responseType = "token";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

      console.log("auth uri", authUrl);
      console.log("redirect uri", redirectUri);
      window.location.href = authUrl;

      // Cookie.set("googleCallback", window.location.href);
      // const clientId = process.env.GOOGLE_CLIENT_ID;
      // const redirectUri = encodeURIComponent(
      //   `${window.location.origin}/google/callback"`
      // );
      // const scope = "profile email";
      // const responseType = "token";
      // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
      // window.location.href = authUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  color: #757575;
  font-family: Arial, sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;
  // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
}

.google-login-btn:hover {
  background-color: #f5f5f5;
}

.google-icon {
  height: 18px;
  width: 18px;
  margin-right: 10px;
}

.google-login-btn span {
  font-weight: bold;
}
</style>
