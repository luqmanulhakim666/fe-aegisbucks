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
  async created() {
    this.state.isLoading = true;

    const token = this.$route.query?.token;

    if (token) {
      await this.$store.dispatch("auth/setToken", token);
      await this.$store.dispatch("auth/fetchProfile");
      await this.$store.dispatch(
        "auth/setRole",
        this.$store.getters["auth/profile"]["role"]
      );
      this.state.isLoading = false;
      this.$router.push("/");
    }

    if (!token) {
      this.$router.push("/login");
    }
  },
};
</script>
