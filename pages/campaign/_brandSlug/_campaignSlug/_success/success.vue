<template>
  <div class="container">
    <template v-if="isLoading">
      <general-skeleton-incubator />
      <general-skeleton-batch-list />
      <general-skeleton-promo-card />
    </template>

    <div class="white pa-6" v-else>
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
            Selamat kamu berhasil mendapatkan <br />
            {{ getTotalVouchers }}
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
          :cycle="false"
        >
          <v-carousel-item v-for="(item, i) in item.vouchers" :key="i">
            <div class="full-width text-center">
              <v-divider class="my-6" />
              <div style="position: relative">
                <h4 class="success--text h4--default text-center">
                  {{ item.voucherCode.code }}
                </h4>
                <v-btn
                  x-small
                  icon
                  style="position: absolute; right: 0; bottom: 0"
                  @click="copyLink(item.voucherCode.code)"
                >
                  <v-icon> mdi-content-copy </v-icon>
                </v-btn>
              </div>
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

                <template v-if="!isRetailType">
                  <p class="caps--small">Kota:</p>

                  <ul>
                    <li v-for="(city, index) in getCitites" :key="index">
                      <p class="caps--small text-capitalize">{{ city }}</p>
                    </li>
                  </ul>
                </template>

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

      <template v-if="hasCtaItems">
        <div v-for="(item, index) in campaign.ctaItems" :key="index">
          <v-btn
            depressed
            @click="goToCtaLink(index)"
            block
            large
            :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
            class="text-capitalize h6--xsmall mt-8"
            >{{ item.label ? item.label : "Click Here" }}</v-btn
          >
        </div>
      </template>
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
    isLoading: false,
  }),

  computed: {
    getCitites() {
      return this.data?.merchantCities?.map((x) => {
        return x.name?.toLowerCase();
      });
    },

    isRetailType() {
      return this.campaign?.type === "retail";
    },

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
    hasCtaItems() {
      return this.campaign?.ctaItems?.length > 0;
    },
    retailName() {
      console.log("item", this.item);
      if (this.isRetailType) {
        return this.item.retail?.name;
      }

      return `${this.item.merchantCategory?.name}`;
    },
    productName() {
      return this.item.product?.name;
    },
    handleVoucherName() {
      const retailName = this.item?.retail?.name?.toLowerCase();
      let name = "voucher";
      if (retailName === "indomaret") {
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
    copyLink(voucherCode) {
      navigator.clipboard.writeText(voucherCode).then(
        () => {
          this.$store.dispatch("snack", [
            "Link copied to clipboard!",
            "success lighten-2",
            "mdi-check-circle",
          ]);
        },
        (err) => {
          this.$store.dispatch("snack", [
            "Failed to copy link",
            "error",
            "mdi-close-circle",
          ]);
        }
      );
    },
    async getDetailCampaign() {
      this.isLoading = true;
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

      this.isLoading = false;
    },

    goToCtaLink(index) {
      const url = this.campaign?.ctaItems[index]["url"];

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
