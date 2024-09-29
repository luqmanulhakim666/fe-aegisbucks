<template>
  <v-container class="social-media-section white">
    <div class="social-icons">
      <div v-for="(item, index) in items" :key="index">
        <v-btn
          class="mx-2"
          v-if="item.value"
          link
          :href="item.value"
          target="_blank"
          icon
        >
          <v-icon large :color="item.color">{{ item.icon }}</v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    items: Array,
  },
};
</script>

<style lang="scss" scoped>
/* Social Media Section Styles */
.social-media-section {
  border-bottom: 1px solid #f3f3f3;
  border-top: 1px solid #f3f3f3;
  padding: 20px;
}

.social-icons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.social-icons v-icon {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.social-icons v-icon:hover {
  transform: scale(1.1);
}
</style>
