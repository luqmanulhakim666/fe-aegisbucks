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
              Masukkan email Anda yang telah terdaftar, kami akan mengirim email
              untuk mereset kata sandi.
            </p>
          </div>

          <v-form v-model="state.isValid">
            <general-form-text-field
              className="transparent"
              v-model="state.email"
              label="Email"
              labelWhite
              placeholder="Ketik Email"
              hide-details="auto"
              :rules="[required, email]"
              outlined
              bold
              solo
              @keypress.enter.prevent="changePassword"
            />
          </v-form>

          <div class="d-flex flex-column mt-6">
            <v-btn
              depressed
              class="secondary lighten-5 text-capitalize text--default mb-4"
              :disabled="!state.isValid"
              :loading="state.isLoading"
              @click="changePassword"
            >
              Kirim
            </v-btn>

            <v-btn
              depressed
              class="text-capitalize text--default secondary--text text--lighten-5"
              color="#FAFAFA"
              @click="onGoBack"
            >
              Kembali ke Halaman Masuk
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

    state: {
      isValid: true,
      isLoading: false,
      email: ''
    }
  }),

  methods: {
    async changePassword() {
      this.state.isLoading = true

      const res = await this.$api.auth.forgotPassword(this.state.email)

      if (res.success) {
        this.setSuccessAlert('Check email Anda untuk merubah password')
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },

    onGoBack() {
      this.$router.go(-1)
    }
  },

  computed: {
    confirmPasswordRule() {
      const isValid =
        this.form.oldPassword === this.form.newPassword || 'Password not match'

      return isValid
    }
  }
}
</script>

<style lang="scss" scoped>
.auth__page {
  position: relative;
  padding: 90px 0;

  &::before {
    content: '';
    position: absolute;
    bottom: 100px;
    left: 50px;
    width: 41px;
    height: 41px;
    background: url('/api/media/static/vector_(1).svg');
    // background: url('https://dev-inkubator.lpdb.id/api/media/static/vector_(1).svg');
    @media (max-width: 600px) {
      top: 100px;
    }
  }

  &_caption {
    font-size: 40px !important;
  }
}
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
