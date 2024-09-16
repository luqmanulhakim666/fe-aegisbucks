<template>
  <div>
    <v-avatar :color="color" :size="size">
      <template v-if="!loading">
        <img
          :class="['img', objectFit]"
          :src="getImageUrl"
          alt="avatar"
          @error="onErrorImage"
        />
      </template>
      <template v-if="loading">
        <v-progress-circular
          :size="60"
          :width="6"
          :rotate="270"
          :value="progress"
          color="primary"
        >
          <p class="p--small">{{ progress }}</p>
        </v-progress-circular>
      </template>
    </v-avatar>
  </div>
</template>

<script>
import { AVATAR } from '@/data/images'
export default {
  props: {
    progress: {
      type: [Number, String],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 160
    },
    color: String,
    objectFit: {
      type: String,
      default: 'cover'
    },
    image: {
      type: [String, Object],
      default: AVATAR
    }
  },

  computed: {
    getImageUrl() {
      if (this.image?.url) {
        return this.image?.url
      }

      if (typeof this.image === 'string') {
        return this.image
      }

      return AVATAR
    }
  },

  methods: {
    onErrorImage(event) {
      event.target.src = AVATAR
    }
  }
}
</script>
