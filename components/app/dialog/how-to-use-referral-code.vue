<template>
  <v-dialog width="500" v-model="isDialog" persistent scrollable>
    <v-card flat class="white rounded-xl">
      <div class="d-flex success lighten-1 rounded-t-xl">
        <div class="d-flex align-center py-3 ml-sm-10 ml-2">
          <v-icon size="42" outline color="#FFFF00">mdi-lightbulb-on</v-icon>
          <h5 class="text-sm-center h5--small ml-3 dark--text text-lighten-4">
            Cara Menggunakan Kode Referral
          </h5>
        </div>
      </div>

      <v-card-text class="container">
        <div class="d-flex align-center mb-4">
          <v-avatar color="success lighten-1" size="30">
            <p class="h5--small success--text">1</p>
          </v-avatar>
          <p class="h7--default darl--text ml-3">
            ⁠Salin kode referral dari profil akunmu.
          </p>
        </div>

        <div class="d-flex align-center mb-4">
          <v-avatar color="success lighten-1" size="30">
            <p class="h5--small success--text">2</p>
          </v-avatar>
          <p class="h7--default darl--text ml-3">
            ⁠Bagikan kode referral ke teman-temanmu.
          </p>
        </div>

        <div class="d-flex align-center mb-4">
          <v-avatar color="success lighten-1" size="30">
            <p class="h5--small success--text">3</p>
          </v-avatar>
          <p class="h7--default darl--text ml-3">
            Pastikan temanmu memasukkan kode referral yang kamu berikan, ketika
            mereka membuat akun.
          </p>
        </div>

        <div class="d-flex align-center mb-4">
          <v-avatar color="success lighten-1" size="30">
            <p class="h5--small success--text">4</p>
          </v-avatar>
          <p class="h7--default darl--text ml-3">
            Ketika teman mu berhasil terdaftar reward poin akan masuk ke akunmu
            dan akun temanmu!
          </p>
        </div>

        <v-btn
          @click="onEmitCopy()"
          block
          depressed
          class="mt-8 success lighten-1 success--text text-capitalize h7--xxsmall"
          >Salin Kode Referral Saya</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isDialog: Boolean,
  },

  methods: {
    onEmitCopy() {
      this.$emit("copy:referral");
      this.$emit("on:close");
    },
  },
};
</script>
