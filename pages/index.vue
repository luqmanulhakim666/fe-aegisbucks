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
        :settings="settings.product"
        showButton
        :isCoupon="false"
      />

      <!-- Banner -->
      <homepage-slider
        class="mb-8"
        title="Best Deal Minggu Ini"
        :items="items.mainOffers"
        :settings="settings.product"
        showButton
        :isCoupon="false"
        isBannerOnly
      />
      <!-- Banner -->

      <app-gimification />

      <homepage-slider
        class="my-8"
        title="History Voucher"
        :items="items.mainOffers"
        :settings="settings.product"
        :isCoupon="false"
      />

      <!-- <homepage-partners class="my-10" :items="items.retails" /> -->

      <!-- <homepage-card
        title="Penawaran Kupon"
        :settings="settings.product"
        :items="items.couponOffers"
        isCoupon
      /> -->

      <!-- BRANDS -->
      <!-- <homepage-brands :items="items.brands" /> -->
    </template>
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
    },
    body: {},
    items: {
      mainOffers: [],
      specialOffers: [],
      couponOffers: [],
      retails: [],
    },
    settings: {
      banners: {
        dots: true,
        dotsClass: "slick-dots custom-dot-class",
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      product: {
        autoplay: true,
        autoplaySpeed: 1500,
        focusOnSelect: true,
        infinite: true,
        slidesToScroll: 1,
        speed: 500,
        centerPadding: "20px",
      },
    },
    meta: {
      title: "LetsbuyAsia",
    },
  }),

  created() {
    this.fetchAll();
  },

  computed: {
    handleSlideToShow() {
      if (this.isMobile) return 1;
      if (this.isTablet) return 2;
      if (this.isDesktop) return 3;
      return 3;
    },
  },

  methods: {
    async fetchAll() {
      this.state.isLoading = true;

      let body = {
        page: 1,
        limit: 10,
        isActive: true,
      };

      let api = [
        this.$api.promos.getList({ ...body, hasCoupon: true }),
        this.$api.promos.getList({ ...body, hasCoupon: false }),
        this.$api.promos.getList({ ...body, isSpecial: true }),
        this.$api.partners.getList({ page: 1, limit: 12 }),
        // this.$api.brands.getList({ page: 1, limit: 12 }),
      ];

      let [
        resCouponOffers,
        resMainOffers,
        resSpecialOffers,
        resRetail,
        resBrands,
      ] = await Promise.all(api);

      this.handleCouponOffers(resCouponOffers);
      this.handleMainOffers(resMainOffers);
      this.handleSpecialOffers(resSpecialOffers);
      this.handleRetails(resRetail);
      // this.handleBrands(resBrands);

      this.state.isLoading = false;
    },

    handleMainOffers(res) {
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

    handleRetails(res) {
      if (res.success) {
        this.items.retails = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },
  },
};
</script>
