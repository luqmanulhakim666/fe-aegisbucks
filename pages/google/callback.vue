<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  layout: "empty",
  async mounted() {
    const hash = window.location.hash.substr(1);
    const result = hash.split("&").reduce((res, item) => {
      const parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {});

    const axiosRes = await this.$axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${result.access_token}`
    );

    await this.$store.dispatch("auth/setGoogleToken", result.access_token);

    window.location.href = Cookie.get("googleCallback");

    //     {
    //   "azp": "122849428774-ovopn2m3pv578iv8majn46lcofbg8lc7.apps.googleusercontent.com",
    //   "aud": "122849428774-ovopn2m3pv578iv8majn46lcofbg8lc7.apps.googleusercontent.com",
    //   "sub": "117976938146700603770",
    //   "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
    //   "exp": "1727771619",
    //   "expires_in": "3255",
    //   "email": "luqmanulh25@gmail.com",
    //   "email_verified": "true",
    //   "access_type": "online"
    // }

    // if (result.access_token) {
    //   // Kirim token ke backend untuk verifikasi
    //   await this.$axios.$post("/api/google-login", {
    //     token: result.access_token,
    //   });
    //   // Lakukan tindakan setelah login berhasil
    //   this.$router.push("/");
    // } else {
    //   // Tangani kesalahan
    //   console.error("Login failed");
    // }
  },
};
</script>
