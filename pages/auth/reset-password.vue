<template>
  <div class="reset fill-height d-flex flex-column justify-center align-center">
    <div
      class="reset-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <general-logo class="d-flex mx-auto mb-4" :max_width="80" />
      <h4 class="h4--default mb-6 text-center">Reset Password</h4>

      <v-form v-model="state.isValid" ref="form">
        <general-form-text-field
          class="full-width"
          outlined
          v-model.trim="auth.password"
          bold
          label="New Password"
          required
          placeholder="New Password"
          :rules="[required, passwordRule]"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        />

        <general-form-text-field
          class="full-width"
          outlined
          v-model.trim="auth.confirm_password"
          bold
          label="Confirm Password"
          required
          placeholder="Confirm Password"
          :rules="[required, passwordRule, confirmPasswordRule]"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append="showConfirmPassword = !showConfirmPassword"
        />
      </v-form>

      <v-btn
        :loading="state.isLoading"
        class="text-capitalize mt-6 primary"
        depressed
        block
        @click="onResetPassword()"
      >
        <p class="h7--xxsmall">Reset</p>
      </v-btn>
    </div>

    <v-dialog width="300" v-model="state.isDialog" persistent>
      <div class="white pa-6 rounded-xl">
        <v-card flat max-width="200" class="mx-auto">
          <lotties-email-sent />
        </v-card>

        <h4 class="text-center h4--default">Check Your Email</h4>

        <v-btn
          :loading="state.isLoading"
          class="text-capitalize mt-6 primary"
          depressed
          block
          link
          to="/login"
        >
          <p class="h7--xxsmall">Close</p>
        </v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import rules from "@/mixins/rules";

export default {
  mixins: [meta, rules],
  layout: "empty",

  data: () => ({
    meta: {
      title: "Reset Password",
    },
    showPassword: false,
    showConfirmPassword: false,

    auth: {
      password: "",
      confirm_password: "",
      token: "",
    },

    state: {
      isValid: true,
      isLoading: false,
    },
  }),

  created() {
    this.auth.token = this.$route.query?.token;
  },

  methods: {
    async onResetPassword() {
      const valid = await this.validate(this.state.isValid);
      if (valid) {
        this.state.isLoading = true;

        let payload = {
          token: this.auth.token || null,
          password: this.auth.password,
        };

        let res = await this.$api.auth.resetPassword(payload);

        if (res.success) {
          this.setSuccessAlert("Password has been changed");
          this.$router.push("/login");
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }

        this.state.isLoading = false;
      }
    },
  },

  computed: {
    confirmPasswordRule() {
      const isValid =
        this.auth.password === this.auth.confirm_password ||
        "Password not match";

      return isValid;
    },
  },
};
</script>

<style lang="scss" scoped>
.reset {
  height: 100%;
  &-form {
    width: 100%;
    max-width: 300px;
  }
}
</style>
