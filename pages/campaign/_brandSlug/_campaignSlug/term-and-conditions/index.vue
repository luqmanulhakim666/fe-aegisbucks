<template>
  <div class="container">
    <template v-if="loading">
      <general-loading />
    </template>
    <template v-if="!loading">
      <div class="white pa-6 rounded-xl" v-if="campaign">
        <span v-html="campaign.termCondition"></span>
      </div>
    </template>
  </div>
</template>

<script>
import tracking from "@/mixins/tracking";
export default {
  mixins: [tracking],

  async asyncData({ store, route, error, redirect }) {
    let campaign = null;
    let loading = true;

    try {
      const res = await store.dispatch("campaign/getDetailPublic", {
        brandSlug: route.params?.brandSlug,
        campaignSlug: route.params?.campaignSlug,
        preview: route.query?.__preview,
      });

      campaign = res.data;

      if (!campaign) {
        redirect("/campaign/404");
      }
    } catch (err) {
      console.error("Error fetching campaign data:", err);
      error({ statusCode: 500, message: "Failed to load campaign data." });
    }
    loading = false;

    return { campaign: campaign, loading: loading };
  },
  layout: "campaign",

  created() {
    if (this.campaign?.id) {
      this.checkGoogleAuth();
    }
  },

  mounted() {
    if (!this.isPreview) {
      this.trackEvent("View Term & Conditions", {
        campaignId: this.campaign.id,
      });
    }
  },
};
</script>
