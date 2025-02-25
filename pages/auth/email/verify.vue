<template>
  <div class="verify background-gradient-1">
    <div class="verify__loading">
      <div class="d-flex mx-auto">
        <general-logo :max_width="200" class="mr-2" />
      </div>
      <v-progress-circular
        class="mt-10"
        width="5"
        color="primary"
        size="60"
        indeterminate
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty",
  data: () => ({
    form: {},
  }),

  async created() {
    const isLogin = this.$store.getters["auth/isLogin"];

    if (!isLogin) {
      return this.$router.push("/auth/logout");
    }

    let code = this.$route?.query?.code;

    if (code) {
      const payload = {
        code: code,
      };

      const res = await this.$api.auth.verifyEmail(payload);

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.$router.push("/");
    }
  },
};
</script>

<style lang="scss" scoped>
.verify {
  height: 100vh;
  overflow: hidden;
  &__loading {
    position: fixed;
    text-align: center;
    top: 40%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
