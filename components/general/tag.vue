<template>
  <v-card
    flat
    :color="backgroundColor"
    :class="['tag rounded-pill text-center px-4', textColor]"
  >
    <p class="text-uppercase h8--supersmall">
      {{ text }}
    </p>
  </v-card>
</template>

<script>
export default {
  props: {
    text: String,
    textColor: String,
    backgroundColor: String,
    borderRadius: String
  }
}
</script>
