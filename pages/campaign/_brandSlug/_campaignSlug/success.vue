<template>
  <div class="container">
    <campaign-slider
      :items="item.vouchers"
      :isImage="false"
      :productName="item.product.name"
      :retailName="item.retail.name"
      showArrow
      :cycle="false"
    />
  </div>
</template>

<script>
export default {
  async asyncData({ store, route, app, redirect }) {
    const campaignId = route.params.brandSlug;
    const groupId = route.params.campaignSlug;
    let loading = true;
    let data = {};

    const res = await app.$api.campaigns.claim.detail(campaignId, groupId);

    if (res.success) {
      data = res.data;
      loading = false;
    }

    if (!res.success) {
      redirect("/campaign");
    }

    return { data: data };
  },
  layout: "campaign",

  data: () => ({
    item: {},
  }),

  created() {
    if (this.data?.id) {
      this.item = this.data;

      this.$store.dispatch("campaign/getDetailPublic", {
        brandSlug: this.data.brand?.slug,
        campaignSlug: this.data.slug,
        preview: this.$route.query?.__preview,
      });
    }

    console.log(this.item);
  },
};
</script>
