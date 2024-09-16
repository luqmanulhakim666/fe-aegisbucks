<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white">
      <general-card-dialog-header
        name="Edit Kata Sandi"
        @close="onEmitClose()"
      />

      <div class="pa-6">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model.trim="form.oldPassword"
            bold
            outlined
            label="Kata Sandi Sekarang"
            class="mb-4"
            hide-details="auto"
            :rules="[required]"
          />
          <general-form-text-field
            v-model.trim="form.newPassword"
            bold
            outlined
            label="Kata Sandi Baru"
            hide-details="auto"
            class="mb-4"
            :rules="[required]"
          />
          <general-form-text-field
            v-model.trim="form.confirm_password"
            bold
            outlined
            label="Konfirmasi Kata Sandi"
            hide-details="auto"
            :rules="[required, confirmPasswordRule]"
            @keypress.enter.prevent="onEmitSubmit()"
          />
        </v-form>
        <div class="d-flex justify-end mt-4">
          <v-btn
            depressed
            class="text-capitalize h6--xsmall secondary lighten-5"
            :loading="loading"
            @click="onEmitSubmit()"
            >Simpan</v-btn
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from '@/mixins/rules'
export default {
  mixins: [rules],

  props: {
    form: Object,
    loading: Boolean,
    dialog: Boolean
  },

  data: () => ({
    state: {
      isValid: true
    }
  }),

  methods: {
    onEmitClose() {
      this.$emit('on:close')
    },

    async onEmitSubmit() {
      let valid = await this.validate(this.state.isValid)

      if (valid) {
        this.$emit('on:submit')
      }
    }
  },

  computed: {
    confirmPasswordRule() {
      let isValid =
        this.form.newPassword === this.form.confirm_password ||
        'Password not match'

      return isValid
    }
  }
}
</script>
