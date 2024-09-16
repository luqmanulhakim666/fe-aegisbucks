<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white">
      <input
        class="d-none"
        ref="input"
        type="file"
        accept="image/*"
        @change="onFilePicked"
      />
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
        <v-btn
          class="d-flex mx-auto mb-6 text-capitalize h7--xxsmall"
          @click="onEmitUpload"
          small
          outlined
        >
          <v-icon small class="mr-2">mdi-camera</v-icon>
          Ubah Foto</v-btn
        >
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

              <div class="mt-4">
                <general-form-text-field
                  label="NIP"
                  optional
                  v-model="form.nip"
                  class="mt-3"
                  bold
                  outlined
                  hide-details="auto"
                />
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div>
                <p class="h6--xsmall darkk-text">Role</p>
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
                class="text-capitalize d-none"
                v-model="role"
                disabled
                bold
                outlined
                label="Role"
                hide-details="auto"
              />

              <div class="mt-6">
                <p class="h6--xsmall">Tanda Tangan</p>
                <p class="text--small mt-2 dark--text mb-4">
                  *Upload tanda tangan 120x120px
                </p>

                <v-img
                  v-if="getSignature && !mixins.state.isLoading"
                  class="mb-4"
                  max-width="120"
                  max-height="120"
                  :src="getSignature"
                />

                <v-btn
                  depressed
                  small
                  class="h8--supersmall primary-create-btn"
                  :loading="mixins.state.isLoading"
                  @click="onOpenFile"
                  >{{ !getSignature ? 'Upload' : 'Upload Ulang' }}</v-btn
                >

                <general-form-text-field
                  class="hide-input"
                  hide-details="auto"
                  dense
                  v-model="getSignature"
                  :rules="[required]"
                />
              </div>
            </v-col>
          </v-row>
        </v-form>
        <div class="d-flex justify-end mt-4">
          <v-btn
            depressed
            class="text-capitalize h6--xsmall secondary lighten-5"
            :loading="loading"
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
import media from '@/mixins/media'
import pipe from '@/mixins/pipe'

export default {
  mixins: [rules, media, pipe],
  props: {
    form: Object,
    loading: Boolean,
    dialog: Boolean,
    role: String,
    progress: [String, Number],
    uploadLoading: Boolean,
    avatarUrl: [String, Object]
  },

  computed: {
    getSignature() {
      return this.form.signature?.url || ''
    }
  },

  data: () => ({
    state: {
      isValid: true,
      showUpload: false
    }
  }),

  methods: {
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
  },
  watch: {
    'mixins.state.media'(val) {
      this.form.signature = val
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
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
