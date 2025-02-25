<template>
  <div>
    <general-loading v-if="state.isLoading" />
  </div>
</template>

<script>
export default {
  layout: "empty",

  data: () => ({
    state: {
      isLoading: false,
    },
  }),

  async mounted() {
    console.log("callback");
    this.state.isLoading = true;

    const token = this.$route.query?.token;

    if (token) {
      await this.$store.dispatch("auth/setToken", token);
      await this.$store.dispatch("auth/fetchProfile");
      await this.$store.dispatch(
        "auth/setRole",
        this.$store.getters["auth/profile"]["role"]
      );

      const profile = this.$store.getters["auth/profile"];
      const emailVerified = profile.emailVerified;

      if (!emailVerified) {
        await this.$api.auth.sendVerifyEmail();
      }

      this.state.isLoading = false;
      return this.$router.push("/");
    }

    if (!token) {
      this.$router.push("/login");
    }
  },
};
</script>
