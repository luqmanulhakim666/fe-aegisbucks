<template>
  <div
    class="forgot fill-height d-flex flex-column justify-center align-center"
  >
    <div
      class="forgot-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <v-btn link to="/login" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
      <general-logo class="d-flex mx-auto mb-4" :max_width="80" />
      <h4 class="h4--default mb-6 text-center">Forgot Password</h4>

      <v-form v-model="state.isValid" ref="form">
        <general-form-text-field
          hide-details="auto"
          outlined
          v-model="form.email"
          prepend-inner-icon="mdi-email-outline"
          placeholder="Email"
          :rules="[required, email]"
          @keypress.enter="onEmitSubmit()"
        />
      </v-form>

      <v-btn
        :loading="state.isLoading"
        class="text-capitalize mt-6 primary"
        depressed
        block
        @click="onSubmit()"
      >
        <p class="h7--xxsmall">Submit</p>
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
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  middleware: "unauthenticated",
  layout: "empty",
  data: () => ({
    form: {
      email: "",
    },
    state: {
      isValid: true,
      isLoading: false,
      isDialog: false,
    },
  }),

  methods: {
    async onSubmit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.state.isLoading = true;
        const res = await this.$api.auth.forgotPassword({
          email: this.form.email,
        });

        if (res.success) {
          this.state.isDialog = true;
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }
      this.state.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.forgot {
  position: relative;
  height: 100%;
  &-form {
    max-width: 300px;
  }
}
</style>
