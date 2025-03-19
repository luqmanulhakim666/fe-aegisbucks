<template>
  <v-dialog width="500" v-model="dialog" persistent>
    <div
      class="white pa-6 rounded-xl d-flex flex-column align-center justify-center"
    >
      <v-img width="200" src="/images/email-verify.png"></v-img>

      <p class="text--default mt-4">1.Salin link dibawah ini</p>

      <v-card class="dark lighten-3 mt-2 pa-2 rounded-xl" flat>
        <p class="h7--xxsmall dark--text text-center">{{ shortUrl }}</p>
      </v-card>

      <v-list-item @click="copyLink(url)">
        <v-list-item-content class="text--default">
          <div class="d-flex align-center">
            <v-icon small class="mr-2">mdi-content-copy</v-icon>
            Salin
          </div>
        </v-list-item-content>
      </v-list-item>

      <p class="text--default text-center">
        2. Buka aplikasi web browser di iPhone Anda (Safari / Chrome / Firefox /
        Opera / Dll.)
      </p>

      <p class="text--default text-center mt-2">
        3. Lalu tempelkan link yang sudah di salin
      </p>
    </div>
  </v-dialog>
</template>

<script>
import utils from "@/mixins/utils";
export default {
  mixins: [utils],
  props: {
    dialog: Boolean,
    url: String,
    shortUrl: String,
  },
};
</script>
