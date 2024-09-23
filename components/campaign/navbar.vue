<template>
  <div class="d-flex ma-4">
    <general-logo-brand :logo="logo" max_width="60" />
    <v-spacer />
    <v-icon size="32">mdi-share-variant</v-icon>
  </div>
</template>

<script>
export default {
  props: {
    logo: String,
  },
};
</script>
