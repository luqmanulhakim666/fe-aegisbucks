<template>
  <div class="flex-column-center align-center">
    <v-img :max-width="max_width" alt="empty" :src="img" />
    <h5 class="h5--small dark--text mt-6">
      {{ title }}
    </h5>
    <p class="text--default dark--text text--lighten-5">
      {{ description }}
    </p>

    <v-btn
      v-if="action"
      large
      class="primary-create-btn text--large mt-6"
      width="400"
      outlined
      @click="onEmitAction()"
    >
      <v-icon v-if="icon" class="mr-2">
        {{ icon }}
      </v-icon>
      Buat Halaman</v-btn
    >
  </div>
</template>

<script>
import { EMPTY } from '@/data/images'
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    action: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: EMPTY
    },
    max_width: {
      type: [String, Number],
      default: 420
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },

  methods: {
    onEmitAction() {
      this.$emit('on:action')
    }
  }
}
</script>
