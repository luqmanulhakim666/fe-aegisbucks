<template>
  <v-img
    contain
    :max-width="max_width"
    :max-height="max_height"
    :src="logo"
    alt="logo"
    @click="goHome()"
  />
</template>

<script>
export default {
  props: {
    logo: String,
    max_width: [String, Number],
    max_height: [String, Number],
  },

  methods: {
    goHome() {
      if (
        this.$route?.name === "campaign-brandSlug-campaignSlug-success-success"
      ) {
        return;
      }

      const params = this.$route.params;
      const brandSlug = params?.brandSlug;
      const campaignSlug = params?.campaignSlug;

      this.$router.push(`/campaign/${brandSlug}/${campaignSlug}`);
    },
  },
};
</script>
