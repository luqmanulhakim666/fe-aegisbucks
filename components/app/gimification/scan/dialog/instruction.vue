<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div class="white rounded-xl">
      <general-card-dialog-header @close="onEmitClose()" />
      <div class="container py-10">
        <v-img class="d-flex mx-auto" max-width="200" src="/images/empty.svg" />

        <v-row dense class="my-4">
          <v-col cols="12" sm="6">
            <div class="dark lighten-3 pa-4 rounded-xl">
              <p class="h6--xsmall dark--text ml-6">Reward</p>
              <app-point :points="200" />
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="dark lighten-3 pa-4 rounded-xl">
              <p class="h6--xsmall dark--text ml-6">Prosses Pengerjaan</p>
              <div class="d-flex align-center">
                <v-icon>mdi-clock-outline</v-icon>
                <p class="h7--xxsmall ml-2 dark--text">2 Menit</p>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="my-8">
          <p class="p--large dark--text">
            Lorem ipsum is a dummy or placeholder text commonly used in graphic
            design, publishing, and web development to fill empty spaces in a
            layout that does not yet have content.
          </p>
        </div>

        <v-btn
          depressed
          block
          class="mt-6 text-capitalize h7--xxsmall success lighten-1 success--text"
          @click="goScan()"
          >Klik untuk Scan Struck</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },

  methods: {
    goScan() {
      this.$router.push("/scan/u8enw4914n11tdq271318");
    },
  },
};
</script>
