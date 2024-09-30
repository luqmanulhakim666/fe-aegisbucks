<template>
  <div class="container">
    <div class="white">
      <campaign-slider
        v-if="getImages"
        class="mb-4"
        height="250"
        :primaryColor="campaign.primaryColor"
        :items="getImages"
      />
      <campaign-slider
        :items="item.vouchers"
        :isImage="false"
        :productName="item.product.name"
        :retailName="item.retail.name"
        :title="getTitle"
        :description="getDescription"
        showArrow
        :cycle="false"
      />
    </div>

    <v-btn
      v-if="getCTA"
      @click="goToCtaLink()"
      block
      :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
      class="text-capitalize h6--xsmall mt-8"
      >{{ getCTA["name"] ? getCTA["name"] : "Click Here" }}</v-btn
    >
  </div>
</template>

<script>
export default {
  async asyncData({ store, route, app, redirect }) {
    const brandSlug = route.params.brandSlug;
    const campaignId = route.params.campaignSlug;
    const groupId = route.params.success;
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
    campaign: {},
  }),

  computed: {
    getImages() {
      const images = this.campaign.thanksSection?.filter(
        (x) => x.type === "image"
      );

      return images?.length > 0 ? images : false;
    },
    getTitle() {
      const item = this.campaign.thanksSection?.find((x) => x.type === "title");
      return item?.content;
    },
    getDescription() {
      const item = this.campaign.thanksSection?.find(
        (x) => x.type === "description"
      );
      return item?.content;
    },
    getCTA() {
      const item = this.campaign.thanksSection?.find((x) => x.type === "cta");
      return item;
    },
  },

  created() {
    if (this.data?.id) {
      this.item = this.data;
      this.getDetailCampaign();
    }
  },

  methods: {
    async getDetailCampaign() {
      const res = await this.$store.dispatch("campaign/getDetailPublic", {
        brandSlug: this.data.brand?.slug,
        campaignSlug: this.data.slug,
        preview: this.$route.query?.__preview,
      });

      if (res.success) {
        this.campaign = res.data;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    goToCtaLink() {
      const url = this.getCTA["url"];

      let domain = url.replace(/(^\w+:|^)\/\//, "");
      if (!url) return;

      window.open(`http://${domain}`, "_blank");
    },
  },
};
</script>
