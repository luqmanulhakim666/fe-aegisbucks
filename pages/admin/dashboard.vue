<template>
  <div>
    <v-card width="50%" flat class="transparent mx-auto">
      <lotties-dashboard />
    </v-card>

    <!-- <nuxt-link
      to="/campaign/cover?brand=indofood&campaign=ayam-geprek&__preview=true"
      >Click</nuxt-link
    > -->
  </div>
</template>

<script>
import meta from "@/mixins/meta";
export default {
  mixins: [meta],
  data: () => ({
    meta: {
      title: "Dashboard",
    },
  }),
};
</script>
