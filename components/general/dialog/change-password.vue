<template>
  <v-dialog v-model="dialog" persistent width="400">
    <div class="white">
      <general-card-dialog-header
        name="Change Password"
        :loading="state.isLoading"
        @close="onEmitClose()"
      />

      <div class="pa-6">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model.trim="form.newPassword"
            bold
            outlined
            label="New Password"
            hide-details="auto"
            class="mb-4"
            :rules="[required, passwordRule]"
            :append-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="state.showPassword ? 'text' : 'password'"
            @click:append="state.showPassword = !state.showPassword"
          />
          <general-form-text-field
            v-model.trim="form.confirm_password"
            bold
            outlined
            label="Confirm Password"
            hide-details="auto"
            :rules="[required, confirmPasswordRule]"
            :append-icon="state.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="state.showConfirmPassword ? 'text' : 'password'"
            @keypress.enter.prevent="onEmitSubmit()"
            @click:append="
              state.showConfirmPassword = !state.showConfirmPassword
            "
          />
        </v-form>
        <div class="d-flex justify-end mt-4">
          <v-btn
            depressed
            class="text-capitalize h6--xsmall secondary lighten-5"
            :loading="state.isLoading"
            @click="onEmitSubmit()"
            >Change</v-btn
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],

  props: {
    dialog: Boolean,
  },

  data: () => ({
    state: {
      isValid: true,
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
    },
    form: {
      newPassword: "",
      confirm_password: "",
    },
  }),

  methods: {
    onEmitClose() {
      this.$refs.form.reset();
      this.$emit("on:close");
    },

    async onEmitSubmit() {
      let valid = await this.validate(this.state.isValid);

      if (valid) {
        this.state.isLoading = true;

        const res = await this.$api.auth.updateProfile({
          password: this.form.newPassword,
        });

        if (res.success) {
          this.$refs.form.reset();
          this.$emit("on:close");

          this.setSuccessAlert("Pasword has been change. Please Relogin");
          this.$store.dispatch("auth/logout");
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
      let isValid =
        this.form.newPassword === this.form.confirm_password ||
        "Password not match";

      return isValid;
    },
  },
};
</script>
