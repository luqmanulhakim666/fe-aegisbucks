<template>
  <v-dialog v-model="dialog" width="300" persistent>
    <div class="white pa-6 rounded-xl">
      <v-img class="d-flex mx-auto" width="150" src="/images/happy-girl.png" />

      <p class="h5--small dark--text mt-6 mb-1">Dapatkan Welcome Bonus!</p>

      <p class="text--default dark--text">
        Lengkapi profil dan dapatkan reward pertamamu yang dapat ditukar dengan
        saldo e-wallet/hadiah menarik!
      </p>

      <v-row dense class="mt-6">
        <v-col cols="12" sm="6">
          <v-btn
            depressed
            small
            outlined
            block
            class="text-capitalize h7--xxsmall dark--text"
            @click="onEmitClose()"
            >Nanti Saja</v-btn
          >
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            small
            block
            depressed
            class="success lighten-1 text-capitalize h7--xxsmall dark--text"
            link
            to="/profile"
            >Lengkapi Profile</v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },
  },
};
</script>
