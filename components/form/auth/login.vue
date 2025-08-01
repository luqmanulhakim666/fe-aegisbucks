<template>
  <div>
    <general-form-text-field
      outlined
      v-model="form.email"
      prepend-inner-icon="mdi-email-outline"
      placeholder="Email"
      :rules="[required, email]"
      @keypress.enter="onEmitSubmit()"
    />
    <general-form-text-field
      outlined
      v-model="form.password"
      prepend-inner-icon="mdi-lock"
      placeholder="Sandi"
      :rules="[required]"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      @keypress.enter="onEmitSubmit()"
    />
  </div>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    form: Object,
  },

  data: () => ({
    showPassword: false,
  }),
  mixins: [rules],
  methods: {
    onEmitSubmit() {
      if (this.form.password) {
        this.$emit("on:submit");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-input--has-state {
  .v-input__control {
    .v-input__slot:before {
      border-color: var(--v-primary-lighten1) !important;
    }
  }
}
</style>
