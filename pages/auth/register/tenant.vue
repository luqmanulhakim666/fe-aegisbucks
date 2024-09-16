<template>
  <div class="register">
    <div class="container">
      <h1 class="register__title text-center mb-12">Selamat Datang di RIDI</h1>

      <v-form v-model="state.isValid" ref="form">
        <form-auth-register
          roleName="Nama Tenant"
          :form="form"
          :loading="state.isLoading"
          :isValid="state.isValid"
          :isDisabled="state.isDialog"
          @on:submit="onSubmit()"
        />
      </v-form>
    </div>

    <dialog-email-verification
      :dialog="state.isDialog"
      :email="form.email"
      @on:close="onClose()"
    />
  </div>
</template>

<script>
import alert from "@/mixins/alert";
export default {
  layout: "intro",
  mixins: [alert],
  data: () => ({
    state: {
      isValid: true,
      isLoading: false,
      isDialog: false,
    },

    form: {
      name: "",
      email: "",
      password: "",
      phone: "",
      personInCharge: "",
    },
  }),

  methods: {
    async onSubmit() {
      await this.$refs.form.validate();
      if (!this.state.isValid) {
        this.$vuetify.goTo(`.v-messages__message`, { offset: 100 });
        return;
      }
      if (this.state.isValid) {
        this.onSave();
      }
    },

    async onSave() {
      this.state.isLoading = true;

      let payload = {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        password: this.form.password,
        personInCharge: this.form.personInCharge || null,
      };

      let res = await this.$api.auth.register.tenant(payload);
      this.state.isLoading = false;

      if (!res.success) {
        this.setFailedAlert(res);
        return;
      }

      this.state.isDialog = true;
    },

    onClose() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
.register {
  padding: 48px 0;
  // background: url('/api/media/static/bg_1_(1).png');?
  // background: url('https://dev-inkubator.lpdb.id/api/media/static/bg_1_(1).png');
  background-size: cover;
  &__title {
    font-style: normal;
    font-weight: 400;
    font-size: 48px;
    line-height: 67px;
  }
}
</style>
