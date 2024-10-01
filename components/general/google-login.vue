<template>
  <div>
    <button @click="loginWithGoogle">Login with Google</button>
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
      const clientId =
        "122849428774-ovopn2m3pv578iv8majn46lcofbg8lc7.apps.googleusercontent.com";
      const redirectUri = encodeURIComponent(
        "https://go2go.id/google/callback"
      );
      const scope = "profile email";
      const responseType = "token";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

      console.log("auth uri", authUrl);
      console.log("redirect uri", redirectUri);
      window.location.href = authUrl;
    },
  },
};
</script>
