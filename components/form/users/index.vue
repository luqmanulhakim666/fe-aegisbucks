<template>
  <div class="white pa-6 rounded-xl">
    <general-form-text-field
      required
      v-model.trim="form.name"
      label="Nama Lengkap"
      placeholder="Ketik Nama Lengkap"
      outlined
      bold
      :rules="[required]"
    />

    <general-form-text-field
      v-model.trim="form.email"
      required
      label="Email"
      placeholder="Ketik Email"
      outlined
      bold
      :rules="[required, email]"
    />

    <template v-if="isCreated">
      <div class="d-flex align-center">
        <general-form-text-field
          class="full-width"
          outlined
          v-model.trim="form.password"
          bold
          label="Password"
          required
          placeholder="Password"
          :rules="[required, passwordRule]"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        />

        <v-btn
          @click="onGeneratePassword()"
          class="primary h7--xxsmall text-capitalize ml-4"
          depressed
        >
          Generate
        </v-btn>
      </div>

      <!-- <general-form-text-field
        v-model="confirm_password"
        label="Konfirmasi Kata Sandi"
        placeholder="Ulangi Kata Sandi"
        outlined
        bold
        :rules="[required, confirmPasswordRule]"
      /> -->
    </template>

    <general-form-select
      required
      v-model="form.role"
      :items="roles"
      item-text="name"
      item-value="key"
      label="Role"
      outlined
      bold
      :rules="[required]"
    />
  </div>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    form: Object,
    roles: Array,
    isCreated: Boolean,
  },

  data: () => ({
    showPassword: false,
    confirm_password: "",
    password_generate: "",
  }),

  computed: {
    confirmPasswordRule() {
      return (
        this.confirm_password === this.form.password || "Password not match"
      );
    },
  },

  methods: {
    onGeneratePassword() {
      const length = 8;
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let password = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      this.form.password = password;
      return;
    },
  },
};
</script>
