<template>
  <div class="login fill-height d-flex flex-column justify-center align-center">
    <div
      class="login-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <general-logo class="d-flex mx-auto mb-4" :max_width="180" />
      <h4 class="h4--default mb-6 text-center">Login To Your Account</h4>

      <v-form v-model="state.isValid" ref="form">
        <form-auth-login :form="form" @on:submit="onSubmit()" />
      </v-form>
      <div class="d-flex justify-end mb-4">
        <nuxt-link to="/auth/forgot-password" class="text--default"
          >Forgot Password?</nuxt-link
        >
      </div>
      <v-btn
        :loading="state.isLoading"
        class="text-capitalize mt-6 secondary lighten-5"
        depressed
        block
        @click="onSubmit()"
      >
        <p class="h7--xxsmall">Login</p>
      </v-btn>
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import meta from "@/mixins/meta";
export default {
  mixins: [rules, meta],
  middleware: "unauthenticated",
  layout: "empty",
  data: () => ({
    meta: {
      title: "Login",
    },
    form: {
      email: "",
      password: "",
    },
    state: {
      isValid: true,
      isLoading: false,
    },
  }),

  methods: {
    async onSubmit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.state.isLoading = true;
        await this.$store.dispatch("auth/login", this.form);
      }
      this.state.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  &-form {
    max-width: 300px;
  }
}
</style>
