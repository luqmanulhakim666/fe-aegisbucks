<template>
  <div class="pa-6 white rounded-xl">
    <h3 class="h4--default mb-1">Syarat & Ketentuan Pendaftaran Tenant</h3>

    <p class="p--large error--text mb-4">
      *Silakan upload gambar/dokumen (pdf) yang akan ditampilkan ketika tenant
      memilih inkubator saat pendaftaran mitra
    </p>

    <div>
      <input
        class="d-none"
        ref="input"
        type="file"
        :accept="['image/png, image/jpge, application/pdf']"
        @change="onFilePicked"
      />

      <div
        v-if="getMediaName()"
        class="grey lighten-3 secondary--text text--lighten-5 d-flex justify-space-between align-center py-1 px-2 rounded-lg"
      >
        <p class="text--default hover-underline" @click="onPreview()">
          {{ getMediaName() }}
        </p>
        <v-btn @click="onEmitRemove()" x-small color="secondary lighten-5" icon
          ><v-icon small>mdi-close</v-icon></v-btn
        >
      </div>

      <v-btn
        v-if="!getMediaName()"
        class="grey lighten-3 secondary--text text--lighten-5 text-capitalize h7--xxsmall"
        depressed
        :loading="mixins.state.isLoading"
        @click="onOpenFile"
      >
        Pilih File
      </v-btn>
    </div>
  </div>
</template>

<script>
import media from '@/mixins/media'
import alert from '@/mixins/alert'
export default {
  mixins: [media, alert],
  props: {
    form: Object
  },

  methods: {
    onEmitRemove() {
      this.$emit('on:remove')
    },
    getMediaName() {
      return this.form?.termConditionFile?.name || null
    },
    onPreview() {
      let url = this.form?.termConditionFile?.url
      window.open(url)
    }
  },
  watch: {
    'mixins.state.media'(val) {
      this.form.termConditionFile = val
      this.$emit('on:save')
    }
  }
}
</script>
