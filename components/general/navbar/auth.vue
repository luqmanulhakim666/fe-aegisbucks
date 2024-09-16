<template>
  <v-menu left offset-y nudge-top="-10" nudge-left="5">
    <template v-slot:activator="{ on, attrs }">
      <v-card
        v-bind="attrs"
        v-on="on"
        flat
        height="70"
        class="d-flex align-center primary fill-height pa-6 ml-6 rounded-0"
      >
        <v-icon color="white">mdi-account-circle</v-icon>
        <p class="white--text h6--xsmall ml-2">Daftar/Masuk</p>
      </v-card>
    </template>

    <v-card class="rounded-xl shadow-base">
      <div class="pa-4">
        <div
          class="d-flex pointer align-center my-2"
          @click="onRedirect(item)"
          v-for="(item, index) in list"
          :key="index"
        >
          <v-icon size="16" class="mr-2 primary--text">
            {{ item.icon }}
          </v-icon>
          <p class="h7--xxsmall primary--text hover-underline">
            {{ item.text }}
          </p>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    list: Array
  },

  methods: {
    onRedirect(val) {
      this.$router.push(val)
    }
  }
}
</script>
