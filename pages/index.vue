<template>
  <div>
    <h1>Hello</h1>
  </div>
</template>

<script>
// import meta from "@/mixins/meta";
export default {
  layout: "empty",
  // middleware: "unauthenticated",
  // meta: [meta],

  created() {
    this.$router.push("/login");
  },
  data: () => ({
    // meta: {
    //   title: "Beranda",
    // },
  }),
};
</script>
