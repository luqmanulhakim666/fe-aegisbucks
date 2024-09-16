<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      accept="image/*"
      @change="onFilePicked"
    />
    <v-row>
      <v-col cols="12" sm="12">
        <div class="pa-6 white rounded-xl d-sm-flex">
          <general-avatar :image="getAvatar" />

          <div class="ml-6">
            <h1 class="h1--xxlarge">{{ profile.name }}</h1>
            <h4 class="h4--default dark--text text--lighten-5 my-4">
              {{ profile.email }}
            </h4>
            <h4 class="h4--default dark--text text--lighten-5">
              {{ humanizeRole(role) }}
            </h4>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="pa-6 white rounded-xl">
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="h4--default">Informasi Pribadi</h3>
            <v-btn
              class="text-capitalize text--default primary-create-btn"
              depressed
              x-small
              @click="handleDialog()"
            >
              <v-icon x-small class="mr-2">mdi-pencil</v-icon>
              Ubah</v-btn
            >
          </div>

          <v-row>
            <v-col cols="12" sm="3">
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Nama</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.name }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Email</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.email }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Nomor Handphone
                </p>
                <p class="h6--xsmall dark--text">
                  {{ profile.phone }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Registrasi SIPENSI Inkubator
                </p>
                <p class="h6--xsmall dark--text">
                  {{ profile.sipensiRegistration || '-' }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">Website</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.website || '-' }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">Total UMKM</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.totalUmkm || 0 }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Total Koperasi
                </p>
                <p class="h6--xsmall dark--text">
                  {{ profile.totalKoperasi || 0 }}
                </p>
              </div>
            </v-col>
            <v-col cols="12" sm="3" offset-sm="1">
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Alamat</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.address || '-' }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">Provinsi</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.province || '-' }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Role</p>
                <p class="h6--xsmall dark--text">
                  {{ humanizeRole(role) }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Nama Penanggung Jawab
                </p>
                <p class="h6--xsmall dark--text">
                  {{ profile.personInCharge }}
                </p>
              </div>

              <div class="mb-4" v-if="isIncubator">
                <p class="h6--xsmall dark--text text--lighten-5">Profile</p>
                <p class="h6--xsmall dark--text">
                  {{ bio }}
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" v-if="role === 'Incubator'">
        <form-users-term-condition
          :form="form"
          @on:save="onSubmit"
          @on:remove="onRemoveTerms"
        />
      </v-col>

      <v-col cols="12">
        <div class="pa-6 white rounded-xl">
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="h4--default">Ubah Kata Sandi</h3>
            <v-btn
              class="text-capitalize text--default primary-create-btn"
              depressed
              x-small
              @click="handleDialogChangePassword()"
            >
              <v-icon x-small class="mr-2">mdi-pencil</v-icon>
              Ubah</v-btn
            >
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">
              Kata Sandi Sekarang
            </p>
            <p class="h6--xsmall dark--text">********</p>
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">Kata Sandi Baru</p>
            <p class="h6--xsmall dark--text">********</p>
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">
              Konfirmasi Kata Sandi
            </p>
            <p class="h6--xsmall dark--text">********</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <general-dialog-profile-user
      :form="form"
      :role="role"
      :dialog="state.isDialog"
      :loading="state.isLoading"
      :progress="mixins.state.progress"
      :uploadLoading="mixins.state.isLoading"
      :avatarUrl="getAvatar"
      @on:upload="onOpenFile"
      @on:close="handleDialog"
      @on:submit="onSubmit"
    />
    <general-dialog-change-password
      :form="auth"
      :dialog="state.isDialogPassword"
      :loading="state.isLoading"
      @on:close="handleDialogChangePassword"
      @on:submit="onChangePassword"
    />
  </div>
</template>

<script>
import meta from '@/mixins/meta'
import alert from '@/mixins/alert'
import media from '@/mixins/media'
import utils from '@/mixins/utils'
import pipe from '@/mixins/pipe'

export default {
  mixins: [meta, alert, media, utils, pipe],
  data: () => ({
    meta: {
      title: 'Profile'
    },
    state: {
      isLoading: false,
      isDialog: false,
      isDialogPassword: false
    },
    form: {
      role: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      termConditionFile: '',
      bio: '',
      website: '',
      totalUmkm: 0,
      totalKoperasi: 0,
      province: ''
    },
    auth: {
      oldPassword: '',
      newPassword: '',
      confirm_password: ' '
    }
  }),

  created() {
    this.setMeta(this.meta.title, false)
    this.form = { ...this.profile }
  },

  computed: {
    bio() {
      if (this.profile.bio?.length > 150) {
        return this.profile.bio?.substr(0, 150) + '... '
      }

      return this.profile.bio
    },
    profile() {
      return this.$store.getters['auth/profile']
    },

    role() {
      let name = this.$store.getters['auth/role']?.toLowerCase()

      if (name) {
        return name?.charAt(0)?.toUpperCase() + name?.slice(1)
      }
    },

    getAvatar() {
      return this.mixins.state?.media?.id
        ? this.mixins.state?.media
        : this.profile?.image
    }
  },

  methods: {
    async onSubmit() {
      this.state.isLoading = true

      let payload = {
        name: this.form.name,
        phone: this.form.phone,
        personInCharge: this.form.personInCharge,
        address: this.form.address,
        sipensiRegistration: this.form.sipensiRegistration,
        image: this.mixins.state?.media?.id
          ? this.mixins.state?.media?.id
          : this.profile?.image?.id,
        termConditionFile: this.form.termConditionFile?.id || null,
        website: this.form.website || null,
        bio: this.form.bio || null,
        totalUmkm: Number(this.form.totalUmkm) || 0,
        totalKoperasi: Number(this.form.totalKoperasi) || 0,
        province: this.form.province || null
      }

      if (this.role === 'Tenant') {
        delete payload['termConditionFile']
        delete payload['sipensiRegistration']
        delete payload['bio']
        delete payload['website']
        delete payload['totalUmkm']
        delete payload['totalKoperasi']
        delete payload['province']
      }

      let res =
        this.role === 'Tenant'
          ? await this.$api.auth.updateProfile.tenant(payload)
          : await this.$api.auth.updateProfile.incubator(payload)

      if (res.success) {
        let item = {
          ...this.profile,
          name: this.form.name,
          phone: this.form.phone,
          address: this.form.address,
          personInCharge: this.form.personInCharge,
          sipensiRegistration: this.form.sipensiRegistration,
          image: this.mixins.state?.media?.id
            ? this.mixins.state?.media
            : this.profile?.image,
          termConditionFile: this.form.termConditionFile?.id
            ? this.form.termConditionFile?.id
            : this.profile?.termConditionFile?.id,
          website: this.form.website,
          bio: this.form.bio,
          totalUmkm: Number(this.form.totalUmkm) || 0,
          totalKoperasi: Number(this.form.totalKoperasi) || 0,
          province: this.form.province || null
        }
        this.$store.commit('auth/SET_PROFILE', item)
        this.setSuccessAlert('Berhasil memperbaharui profile')
        this.state.isDialog = false
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }
      this.state.isLoading = false
    },

    async onChangePassword() {
      this.state.isLoading = true

      let payload = {
        ...this.auth
      }
      delete payload.confirm_password
      let res = await this.$api.auth.changePassword(payload)

      if (res.success) {
        this.setSuccessAlert('Berhasil merubah password')
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
      this.handleDialogChangePassword()
    },

    onRemoveTerms() {
      this.form.termConditionFile = ''
      setTimeout(() => {
        this.onSubmit()
      }, 50)
    },

    handleDialog() {
      this.mixins.state.media = []
      this.state.isDialog = !this.state.isDialog
    },

    handleDialogChangePassword() {
      this.state.isDialogPassword = !this.state.isDialogPassword
      this.auth.newPassword = ''
      this.auth.oldPassword = ''
      this.auth.confirm_password = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.conainer {
  padding: 0 !important;
}
</style>
