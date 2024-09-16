<template>
  <v-card
    flat
    class="thumbnail rounded-xl"
    v-bind:class="{
      'd-flex flex-column align-center justify-center grey lighten-3 py-5':
        !image,
    }"
  >
    <v-img
      width="100"
      height="100"
      alt="thumbnail"
      :contain="contain"
      v-if="image"
      :src="image"
    />
    <!-- :aspect-ratio="ratio" -->
    <v-icon v-if="!image" class="">mdi-image</v-icon>
  </v-card>
</template>

<script>
export default {
  props: {
    contain: {
      type: Boolean,
      default: true,
    },
    image: String,
    ratio: {
      type: [Number, String],
      default: 3,
    },
  },
};
</script>
