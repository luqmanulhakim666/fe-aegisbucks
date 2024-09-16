<template>
  <v-dialog v-model="dialog" persistent width="600">
    <v-card
      class="rounded-xl pa-6 d-flex align-center justify-center flex-column"
      flat
    >
      <v-icon size="72" color="gray">mdi-email-open-outline</v-icon>
      <p class="h5--small dark--text text-center mb-4">
        Verifikasi Email Anda Sekarang
      </p>
      <span class="text--default dark--text text-center">
        Kami telah mengirimkan tautan ke email <b>{{ email }}</b> . Silahkan
        klik tautan tersebut untuk dapat menyelesaikan pendaftaran
      </span>
      <v-btn
        block
        color="primary"
        class="mt-4 h6--xsmall text-capitalize"
        depressed
        @click="onEmitClose()"
        >Mengerti</v-btn
      >
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    email: String
  },
  methods: {
    onEmitClose() {
      this.$emit('on:close')
    }
  }
}
</script>
