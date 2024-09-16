<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white">
      <general-card-dialog-header name="Edit Profile" @close="onEmitClose()" />
      <div class="pa-6">
        <div class="d-flex justify-center mb-6">
          <div
            class="upload"
            @mouseenter="handleShowUpload()"
            @mouseleave="handleShowUpload()"
          >
            <div
              v-if="state.showUpload"
              class="upload__avatar pointer"
              @click="onEmitUpload"
            >
              <v-icon class="d-flex mx-auto mt-6" color="white"
                >mdi-camera-plus</v-icon
              >
            </div>
            <general-avatar
              :progress="progress"
              :loading="uploadLoading"
              :image="avatarUrl"
            />
          </div>
        </div>
        <v-form v-model="state.isValid" ref="form">
          <v-row>
            <v-col cols="12" sm="6">
              <general-form-text-field
                v-model="form.name"
                bold
                outlined
                label="Nama"
                hide-details="auto"
                :rules="[required]"
              />
              <general-form-text-field
                class="mt-4"
                v-model="form.email"
                disabled
                bold
                outlined
                label="Email"
                hide-details="auto"
              />
              <general-form-text-field
                class="mt-4"
                v-model="form.phone"
                bold
                outlined
                label="No Telp"
                hide-details="auto"
                :rules="[required]"
              />

              <template v-if="isIncubator">
                <general-form-text-field
                  label="Registrasi SIPENSI Inkubator"
                  optional
                  v-model="form.sipensiRegistration"
                  class="mt-4"
                  bold
                  outlined
                  hide-details="auto"
                />

                <general-form-text-field
                  label="Website"
                  v-model="form.website"
                  class="mt-4"
                  bold
                  outlined
                  required
                  :rules="[required, link]"
                  hide-details="auto"
                />

                <general-form-text-field
                  label="Total UMKM"
                  v-model="form.totalUmkm"
                  class="mt-4"
                  bold
                  outlined
                  hide-details="auto"
                  required
                  :rules="[required]"
                />

                <general-form-text-field
                  label="Total Koperasi"
                  v-model="form.totalKoperasi"
                  class="mt-4"
                  bold
                  outlined
                  hide-details="auto"
                  required
                  :rules="[required]"
                />
              </template>
            </v-col>

            <v-col cols="12" sm="6">
              <general-form-text-field
                v-model="form.address"
                bold
                outlined
                label="Alamat"
                hide-details="auto"
                required
                :rules="[required]"
              />

              <template v-if="isIncubator">
                <general-form-autocomplete
                  class="mt-4"
                  label="Provinsi"
                  bold
                  required
                  v-model="form.province"
                  className="text-capitalize"
                  outlined
                  hide-details="auto"
                  :items="provincies"
                  item-text="name"
                  item-value="name"
                  :loading="state.loading.province"
                  :rules="[required]"
                />
              </template>

              <div>
                <p class="h6--xsmall darkk-text mt-3">Role</p>
                <v-card
                  disabled
                  style="border: 1px solid grey; background: #eaeaea"
                  flat
                  class="rounded-lg mt-2 py-2"
                >
                  <span class="ml-3">
                    {{ humanizeRole(role) }}
                  </span>
                </v-card>
              </div>

              <general-form-text-field
                class="text-capitalize mt-4 d-none"
                v-model="role"
                disabled
                bold
                outlined
                label="Role"
                hide-details="auto"
              />

              <general-form-text-field
                class="text-capitalize mt-4"
                v-model="form.personInCharge"
                bold
                outlined
                label="Nama Penanggung Jawab"
                hide-details="auto"
              />

              <template v-if="isIncubator">
                <general-form-text-area
                  class="text-capitalize mt-4"
                  v-model="form.bio"
                  bold
                  outlined
                  :maxLength="500"
                  :counter="500"
                  required
                  label="Profile"
                  hide-details="auto"
                  :rules="[required]"
                />
              </template>
            </v-col>
          </v-row>
        </v-form>
        <div class="d-md-flex justify-space-between mt-4">
          <p class="p--small error--text" v-if="isIncubator">
            *Provinsi, Website, Total Tenant (UMKM dan Koperasi) dan Profil akan
            menjadi informasi pada halaman Mitra Inkubator apabila terpilih
            menjadi mitra inkubator LPDB-KUMKM
          </p>
          <v-btn
            depressed
            class="text-capitalize h6--xsmall secondary lighten-5 mt-5 mt-sm-0"
            :loading="loading"
            :block="xs"
            @click="onEmitSubmit"
            >Simpan</v-btn
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from '@/mixins/rules'
import utils from '@/mixins/utils'
import pipe from '@/mixins/pipe'
import screen from '@/mixins/screen'

export default {
  mixins: [rules, utils, pipe, screen],
  props: {
    form: Object,
    loading: Boolean,
    dialog: Boolean,
    role: String,
    progress: [String, Number],
    uploadLoading: Boolean,
    avatarUrl: [String, Object]
  },

  data: () => ({
    state: {
      isValid: true,
      showUpload: false,
      loading: {
        province: false
      }
    },
    provincies: []
  }),

  created() {
    this.getProvincies()
  },

  methods: {
    async getProvincies(val) {
      this.state.loading.province = true
      let payload = {
        // keyword: val,
        limit: 0
      }

      let res = await this.$api.general.provincies(payload)

      if (res.success) {
        let asc = res?.data?.list?.sort((a, b) => {
          if (a?.name < b?.name) return -1
          if (a?.name > b?.name) return 1
          return 0
        })
        this.provincies = asc
      }

      this.state.loading.province = false
    },

    handleShowUpload() {
      this.state.showUpload = !this.state.showUpload
    },

    onEmitUpload() {
      this.$emit('on:upload')
    },

    onEmitClose() {
      this.$emit('on:close')
    },

    async onEmitSubmit() {
      let valid = await this.validate(this.state.isValid)

      if (valid) {
        this.$emit('on:submit')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  position: relative;
  &__avatar {
    position: absolute;
    top: 78%;
    z-index: 1;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 159px;
    height: 71px;
    border-radius: 0 0 999999px 999099px;
    background-color: #333333;
  }
}
</style>
