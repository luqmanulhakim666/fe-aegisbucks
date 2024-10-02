<template>
  <div>
    <pageNotFound />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
export default {
  mixins: [meta],
  layout: "empty",
  data: () => ({
    meta: {
      title: "404 Page Not Found",
    },
  }),
};
</script>
