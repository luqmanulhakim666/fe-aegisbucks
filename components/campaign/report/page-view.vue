<template>
  <div class="white pa-6 rounded-xl primary">
    <h4 class="h4--default primary--text text--lighten-1">Page View</h4>
    {{ decimal(total) }}
  </div>
</template>

<script>
import utils from "@/mixins/utils";
export default {
  mixins: [utils],
  props: {
    summary: Object,
  },
  computed: {
    total() {
      return this.summary.pageView?.total || 0;
    },
  },
};
</script>

<style scoped>
/* Add some custom styles if needed */
</style>
