<template>
  <v-card max-width="590" class="white shadow-base pa-11 rounded-lg mx-auto">
    <h2 class="h2--xlarge">Registrasi Akun Baru</h2>
    <p class="text--default dark--text text--lighten-5 mt-2 mb-6">
      Hi, Ayo bergabung menjadi bagian RIDI
    </p>
    <general-form-text-field
      v-model="form.name"
      bold
      :label="roleName"
      outlined
      hide-details="auto"
      :rules="[required]"
    />
    <general-form-text-field
      v-model="form.email"
      class="mt-6"
      bold
      label="Email"
      outlined
      hide-details="auto"
      :rules="[required, email]"
    />
    <general-form-text-field
      v-model="form.phone"
      class="mt-6"
      bold
      label="Nomor Handphone"
      outlined
      hide-details="auto"
      :rules="[required, number]"
      :maxLength="13"
      @keypress="onDigits"
    />
    <general-form-text-field
      v-model="form.personInCharge"
      class="mt-6"
      bold
      label="Nama Penanggung Jawab"
      outlined
      hide-details="auto"
    />

    <div class="mt-6" v-if="registerIncubator">
      <div class="d-flex text-capitalize dark--text h6--xsmall">
        <span>Registrasi SIPENSI Inkubator</span>
        <span class="info--text text--lighten-2 ml-1"> (Opsional)</span>
      </div>

      <general-form-text-field
        v-model="form.sipensiRegistration"
        class="mt-3"
        bold
        outlined
        hide-details="auto"
      />
    </div>

    <general-form-text-field
      v-model="form.password"
      class="my-6"
      bold
      label="Kata Sandi"
      outlined
      hide-details="auto"
      :rules="[required]"
      :append-icon="state.isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="state.isShowPassword ? 'text' : 'password'"
      @click:append="handleShowPassword('password')"
    />
    <general-form-text-field
      v-model="confirm_password"
      class="my-6"
      bold
      label="Konfirmasi Kata Sandi"
      outlined
      hide-details="auto"
      :rules="[required, confirmPasswordRule]"
      :append-icon="state.isShowConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="state.isShowConfirmPassword ? 'text' : 'password'"
      @click:append="handleShowPassword('confirmPassword')"
    />
    <div class="my-6 d-flex align-start">
      <v-checkbox
        v-if="state.isChecked"
        readonly
        :ripple="false"
        class="mb-md-0 mt-n1 mt-md-n2"
        v-model="state.isChecked"
        hide-details
      >
      </v-checkbox>
      <span class="text--default dark--text">
        Saya setuju dengan
        <span
          @click="onReadPolicy()"
          class="text-decoration-underline info--text text--lighten-2 pointer"
        >
          Syarat dan Ketentuan</span
        >
        yang berlaku
      </span>
    </div>
    <v-btn
      depressed
      large
      class="text-capitalize white--text secondary lighten-5 h6--xsmall"
      block
      :loading="loading"
      :disabled="!state.isChecked"
      @click="onEmitSubmit()"
    >
      Daftar
    </v-btn>

    <template v-if="registerIncubator">
      <general-dialog-privacy-policy
        :dialog="state.isDialog"
        @on:agree="onAgree()"
      />
    </template>

    <template v-if="!registerIncubator">
      <general-dialog-privacy-policy-tenant
        :dialog="state.isDialog"
        @on:agree="onAgree()"
      />
    </template>
  </v-card>
</template>

<script>
export default {
  props: {
    form: Object,
    loading: Boolean,
    isValid: Boolean,
    roleName: String,
  },
  data: () => ({
    meta: {
      title: "Pendaftaraan",
    },
    confirm_password: "",
    state: {
      isChecked: false,
      isShowPassword: false,
      isShowConfirmPassword: false,
      isDialog: false,
    },
  }),
  computed: {
    confirmPasswordRule() {
      return (
        this.confirm_password === this.form.password || "Password not match"
      );
    },

    registerIncubator() {
      return this.$route.name !== "register-tenant" ?? false;
    },
  },
  methods: {
    onReadPolicy() {
      this.state.isDialog = true;
    },

    onAgree() {
      this.state.isChecked = true;
      this.state.isDialog = false;
    },

    onEmitSubmit() {
      this.$emit("on:submit");
    },

    handleShowPassword(val) {
      if (val === "password") {
        this.state.isShowPassword = !this.state.isShowPassword;
      }

      if (val === "confirmPassword") {
        this.state.isShowConfirmPassword = !this.state.isShowConfirmPassword;
      }
    },
  },
};
</script>
