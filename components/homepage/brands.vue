<template>
  <div class="mt-10">
    <div class="d-flex align-center justify-space-between mb-4">
      <p class="h5--small dark--text">Brand Populer</p>
      <p class="h7--xxsmall pointer dark--text">Lihat Semua</p>
    </div>
    <v-row>
      <v-col cols="auto" v-for="(item, index) in items" :key="index">
        <v-img width="100" :src="item" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
  },
};
</script>
