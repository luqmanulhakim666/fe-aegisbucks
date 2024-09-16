<template>
  <div class="login fill-height d-flex flex-column justify-center align-center">
    <div
      class="login-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <general-logo class="d-flex mx-auto mb-4" :max_width="80" />
      <h4 class="h4--default mb-6 text-center">Login To Your Account</h4>

      <v-form v-model="state.isValid" ref="form">
        <form-auth-login :form="form" @on:submit="onSubmit()" />
      </v-form>
      <!-- <div class="d-flex justify-end mt-4">
              <nuxt-link to="/auth/forgot-password" class="text--default"
                >Lupa Kata Sandi?</nuxt-link
              >
            </div> -->
      <!-- :disabled="!state.isValid" -->
      <v-btn
        :loading="state.isLoading"
        class="text-capitalize mt-6 primary"
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
export default {
  middleware: "unauthenticated",
  layout: "empty",
  data: () => ({
    meta: {
      title: "Masuk",
      description: "Page description goes here",
      image: "path/to/image.jpg",
    },
    form: {
      email: "admin@letsbuyasia.id",
      password: "@Admin12345",
    },
    state: {
      isValid: true,
      isLoading: false,
    },
    register_menu: [
      {
        text: "Daftar Sebagai Inkubator",
        icon: "mdi-account-circle",
        path: "/register/inkubator",
      },
      {
        text: "Daftar Sebagai Tenant",
        icon: "mdi-account-circle",
        path: "/register/tenant",
      },
    ],
  }),

  methods: {
    async onSubmit() {
      await this.$refs.form.validate();
      this.state.isLoading = true;
      await this.$store.dispatch("auth/login", this.form);
      this.state.isLoading = false;
    },

    onRedirect(val) {
      this.$router.push(val);
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
