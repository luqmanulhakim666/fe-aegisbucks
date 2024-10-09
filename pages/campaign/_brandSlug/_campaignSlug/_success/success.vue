<template>
  <div class="container">
    <div class="white pa-6">
      <campaign-slider
        v-if="getImages"
        class="mb-4"
        height="250"
        :primaryColor="campaign.primaryColor"
        :items="getImages"
      />

      <template v-if="!getTitle">
        <lotties-success />

        <div class="d-flex flex-column justify-center mt-n10">
          <h3 class="h3--small text-center">
            Selamat Kamu berhasil mendapatkan {{ getTotalVouchers }}
            {{ handleVoucherName }}
          </h3>

          <h3 class="h3--small text-center mb-6">
            {{ productName }}
          </h3>
        </div>
      </template>

      <template v-if="getTitle">
        <span v-html="getTitle"></span>
      </template>

      <div>
        <v-carousel
          v-model="index"
          hide-delimiters
          height="auto"
          :show-arrows="getTotalVouchers > 1"
          class="carousel"
          show-arrows-on-hover
          :cycle="false"
        >
          <v-carousel-item v-for="(item, i) in item.vouchers" :key="i">
            <div class="full-width text-center">
              <v-divider class="my-6" />
              <h4 class="success--text h4--default">
                {{ item.voucherCode.code }}
              </h4>
              <VueBarcode
                class="d-flex mx-auto justify-center"
                :value="item.voucherCode.code"
              >
                No Data
              </VueBarcode>
              <v-divider class="pb-6" />

              <div class="text-left">
                <p class="caps--small">
                  {{ handleVoucherName }}
                  berlaku hingga
                  <b>
                    {{
                      dateMonthTextYear(
                        item.voucherCode.campaignVoucher.expiredDate,
                        " "
                      )
                    }}</b
                  >
                  dan dapat digunakan di <b>{{ retailName }}</b>
                </p>
                <br />

                <p class="caps--small">
                  Kami juga telah mengirimkan
                  {{ handleVoucherName }}
                  beserta
                  <b
                    >cara pemakaian nya melalui email <b>{{ item.email }}</b></b
                  >
                </p>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>

        <div class="d-flex justify-center mt-6" v-if="getTotalVouchers > 1">
          <div v-for="i in getTotalVouchers" :key="i">
            <v-avatar
              @click="setIndex(i - 1)"
              size="8"
              class="mx-2 pointer"
              :color="
                i - 1 === index ? campaign.primaryColor : 'grey lighten-2'
              "
            ></v-avatar>
          </div>
        </div>
      </div>

      <template v-if="description">
        <v-divider class="my-6" />
        <span v-html="description"></span>
      </template>

      <v-btn
        v-if="getCTA"
        @click="goToCtaLink()"
        block
        large
        :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
        class="text-capitalize h6--xsmall mt-8"
        >{{ getCTA["name"] ? getCTA["name"] : "Click Here" }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import VueBarcode from "vue-barcode";
import pipe from "@/mixins/pipe";
import meta from "@/mixins/meta";

export default {
  mixins: [pipe, meta],
  async asyncData({ store, route, app, redirect }) {
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

    return { data: data, loading: loading };
  },
  layout: "campaign",
  components: {
    VueBarcode,
  },
  data: () => ({
    meta: {
      title: "",
    },
    item: {},
    campaign: {},
    index: 0,
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
    description() {
      const item = this.campaign.thanksSection?.find(
        (x) => x.type === "description"
      );
      return item?.content;
    },
    getCTA() {
      const item = this.campaign.thanksSection?.find((x) => x.type === "cta");
      return item;
    },
    retailName() {
      return this.item.retail?.name;
    },
    productName() {
      return this.item.product?.name;
    },
    handleVoucherName() {
      let name = "Voucher";
      if (this.productName === "indomaret") {
        name = "i-kupon";
      }

      return name;
    },
    getTotalVouchers() {
      return this.item.vouchers?.length;
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
        this.meta.title = `Voucher ${this.item.product.name} ${res.data.brand.name} ${res.data.name}`;
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
    setIndex(i) {
      this.index = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  // height: calc(65vh - 45px) !important;
}
.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures image scales and covers the area without distortion */
}
::v-deep text {
  display: none;
}
</style>
