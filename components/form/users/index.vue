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
      <general-form-text-field
        required
        v-model.trim="form.password"
        label="Kata Sandi"
        placeholder="Generate Kata Sandi"
        appendButton
        appendName="Generate"
        outlined
        bold
        :rules="[required, passwordRule]"
        @on:append-click="onGeneratePassword"
      />

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
    state: {
      showUpload: false,
    },
    confirm_password: "",
    password_generate: "",
  }),

  computed: {
    passwordRule() {
      return this.form?.password?.length >= 8 || "Password min 8 characters";
    },
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

      this.form.password = "@" + password;
      return;
    },
  },
};
</script>
