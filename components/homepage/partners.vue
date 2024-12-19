<template>
  <v-row align="center">
    <v-col cols="12" md="4">
      <h2 class="h2--xlarge dark--text">
        Cari promo jadi lebih mudah di toko kesayangan mu
      </h2>
    </v-col>
    <v-col cols="12" md="8">
      <v-row align="center" justify="center">
        <v-col
          align="center"
          justify="center"
          cols="auto"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-img max-width="120" :src="getImage(item)"> </v-img>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    items: Array,
  },
};
</script>
