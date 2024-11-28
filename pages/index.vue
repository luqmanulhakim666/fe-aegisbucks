<template>
  <div></div>
</template>

<script>
import meta from "@/mixins/meta";
export default {
  layout: "empty",
  middleware: "unauthenticated",
  meta: [meta],

  created() {
    this.$router.push("/login");
  },
  data: () => ({
    meta: {
      title: "LetsbuyAsia",
    },
  }),
};
</script>
