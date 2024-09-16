<template>
  <div class="auth__page background-gradient">
    <div class="container">
      <v-row align="center">
        <v-col cols="12" sm="6">
          <v-img
            :src="`${$config.API_URL}/media/static/untitled-1_3_(1).svg`"
          />
        </v-col>

        <v-col cols="12" md="4">
          <div class="mb-6">
            <h2 class="white--text h2--xlarge mb-2">Lupa Kata Sandi</h2>
            <p class="white--text p--default">
              Silahkan buat kata sandi Anda yang baru, jangan sampai lupa lagi
              ya
            </p>
          </div>

          <v-form v-model="state.isValid">
            <general-form-text-field
              v-model="auth.password"
              class="mb-4"
              label="Kata Sandi Baru"
              labelWhite
              placeholder="Masukkan Kata Sandi Baru"
              hide-details="auto"
              outlined
              bold
              solo
              :rules="[required]"
            />

            <general-form-text-field
              v-model="auth.confirm_password"
              label="Ulangi Kata Sandi Baru"
              labelWhite
              placeholder="Ulangi Kata Sandi Baru"
              hide-details="auto"
              outlined
              bold
              solo
              :rules="[required, confirmPasswordRule]"
              @keypress.enter.prevent="onResetPassword"
            />
          </v-form>

          <div class="d-flex flex-column mt-6">
            <v-btn
              depressed
              class="secondary lighten-5 text-capitalize text--default mb-4"
              :disabled="!state.isValid"
              :loading="state.isLoading"
              @click="onResetPassword"
            >
              Ubah Kata Sandi
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import meta from '@/mixins/meta'
import rules from '@/mixins/rules'
import alert from '@/mixins/alert'

export default {
  layout: 'intro',
  mixins: [meta, rules, alert],
  data: () => ({
    meta: {
      title: 'Lupa Kata Sandi'
    },

    auth: {
      password: '',
      confirm_password: '',
      token: ''
    },

    state: {
      isValid: true,
      isLoading: false
    }
  }),

  created() {
    this.auth.token = this.$route.query?.token
  },

  methods: {
    async onResetPassword() {
      if (this.state.isValid) {
        this.state.isLoading = true

        let payload = {
          token: this.auth.token,
          password: this.auth.password
        }

        let res = await this.$api.auth.resetPassword(payload)

        if (res.success) {
          this.setSuccessAlert('Berhasil merubah password')
          this.$router.push('/login')
        }

        if (!res.success) {
          this.setFailedAlert(res)
        }

        this.state.isLoading = false
      }
    }
  },

  computed: {
    confirmPasswordRule() {
      const isValid =
        this.auth.password === this.auth.confirm_password ||
        'Password not match'

      return isValid
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-messages__message {
    color: #fff !important;
  }

  .v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: var(--v-secondary-lighten5) !important;
    color: #fff !important;
  }
}
</style>
