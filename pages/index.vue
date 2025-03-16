<template>
  <div class="container">
    <template v-if="state.isLoading">
      <general-skeleton-promo-card />

      <v-row>
        <v-col cols="12" md="4" v-for="i in 3" :key="i">
          <general-skeleton-promo-card />
        </v-col>
      </v-row>

      <general-skeleton-promo-card class="my-8" />

      <v-row>
        <v-col cols="12" md="4" v-for="i in 3" :key="i">
          <general-skeleton-promo-card />
        </v-col>
      </v-row>
    </template>

    <template v-if="!state.isLoading">
      <homepage-hero />

      <homepage-slider
        class="mb-8"
        title="Best Promo to Claim"
        :items="items.couponOffers"
        showButton
        :isCoupon="false"
      />

      <!-- Banner -->
      <homepage-slider
        class="mb-8"
        title="Best Deal Minggu Ini"
        :items="items.banners"
        showButton
        :isCoupon="false"
        isBannerOnly
      />
      <!-- Banner -->

      <app-gimification />

      <homepage-slider
        class="my-8"
        title="Main Offers"
        :items="items.mainOffers"
        :isCoupon="false"
      />

      <homepage-slider
        class="my-8"
        title="History Voucher"
        :items="items.voucherHistories"
        :isCoupon="false"
        hideDate
        showButton
      />

      <!-- BRANDS -->
      <!-- <homepage-brands :items="items.brands" /> -->
    </template>

    <app-profile-dialog-email-verify
      :dialog="state.dialogEmailVerify"
      @on:close="state.dialogEmailVerify = false"
    />

    <app-profile-dialog-complete-profile
      :dialog="state.dialogCompleteProfile"
      @on:close="closeCompleteProfileDialog()"
    />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import alert from "@/mixins/alert";
export default {
  layout: "app",
  middleware: "userAuthenticated",
  mixins: [alert],
  meta: [meta],
  data: () => ({
    state: {
      isLoading: false,
      dialogCompleteProfile: false,
      dialogEmailVerify: false,
    },
    body: {},
    items: {
      mainOffers: [],
      specialOffers: [],
      couponOffers: [],
      voucherHistories: [],
      banners: [],
    },
    meta: {
      title: "LetsbuyAsia",
    },
  }),

  async created() {
    await this.fetchAll();
  },

  mounted() {
    this.state.dialogCompleteProfile =
      !this.profile.isCompleteProfile && this.profile.emailVerified;
    this.state.dialogEmailVerify = !this.profile.emailVerified;
  },

  computed: {
    profile() {
      return this.$store.getters["auth/profile"];
    },

    handleSlideToShow() {
      if (this.isMobile) return 1;
      if (this.isTablet) return 2;
      if (this.isDesktop) return 3;
      return 3;
    },
  },

  methods: {
    closeCompleteProfileDialog() {
      this.state.dialogCompleteProfile = false;
    },
    async fetchAll() {
      this.state.isLoading = true;

      let body = {
        page: 1,
        limit: 10,
        sort: "desc",
        isActive: true,
      };

      let api = [
        this.$api.promos.getList({ ...body, hasCoupon: true }),
        this.$api.promos.getList({ ...body, hasCoupon: false }),
        this.$api.promos.getList({ ...body, isSpecial: true }),
        this.$api.banners.getList({ ...body }),
        this.$api.campaigns.history({ ...body }),
      ];

      let [
        resCouponOffers,
        resMainOffers,
        resSpecialOffers,
        resBanners,
        resHistory,
      ] = await Promise.all(api);

      this.handleCouponOffers(resCouponOffers);
      this.handleMainOffers(resMainOffers);
      this.handleSpecialOffers(resSpecialOffers);
      this.handleBanners(resBanners);
      this.handleVoucherHistories(resHistory);

      this.state.isLoading = false;
    },

    handleVoucherHistories(res) {
      const host = this.$config.API_URL.replace("/api", "");

      if (res.success) {
        this.items.voucherHistories = res.data.list?.map((x) => {
          const splitUrl = x.url?.split("/");
          return {
            name: x.product?.name,
            image: x.product?.image,
            imageId: x.product?.image?.id,
            ctaUrl: `${host}/campaign/${splitUrl[4]}/${x.campaignId}/${x.groupId}/success`,
            id: x.id,
          };
        });
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleMainOffers(res) {
      console.log("mainOffers", res);
      if (res.success) {
        this.items.mainOffers = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleBrands(res) {
      if (res.success) {
        this.items.brands = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleSpecialOffers(res) {
      if (res.success) {
        this.items.specialOffers = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleCouponOffers(res) {
      if (res.success) {
        this.items.couponOffers = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleBanners(res) {
      if (res.success) {
        this.items.banners = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },
  },
};
</script>
