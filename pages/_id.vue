<template>
  <div class="container">
    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="!state.isLoading">
      ww
      {{ item }}
    </template>
  </div>
</template>

<script>
import { BANNERS, PRODUCTS, BRANDS } from "@/data/dummy";
import meta from "@/mixins/meta";
import alert from "@/mixins/alert";
export default {
  async asyncData({ route, app }) {
    const id = route.params.id;
    let item = {};

    const res = await app.$api.promos.getOne(id);

    console.log(res);

    item = res.data;

    return { item: item };
  },
  layout: "app",
  mixins: [alert],
  middleware: "userAuthenticared",
  meta: [meta],
  data: () => ({
    state: {
      isLoading: false,
    },
    body: {},
    items: {
      mainOffers: [],
      specialOffers: [],
      cuponOffers: [],
      retails: [],
      banners: BANNERS,
      products: PRODUCTS,
      brands: BRANDS,
    },
    settings: {
      banner: {
        dots: true,
        dotsClass: "slick-dots custom-dot-class",
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      product: {
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
    console.log(this.$route);
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
      ];

      let [resCuponOffers, resMainOffers, resSpecialOffers, resRetail] =
        await Promise.all(api);

      this.handleCuponOffers(resCuponOffers);
      this.handleMainOffers(resMainOffers);
      this.handleSpecialOffers(resSpecialOffers);
      this.handleRetails(resRetail);

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

    handleSpecialOffers(res) {
      if (res.success) {
        this.items.specialOffers = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleCuponOffers(res) {
      if (res.success) {
        this.items.cuponOffers = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    handleRetails(res) {
      console.log(res);
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

<style lang="scss" scoped>
::v-deep {
  .slick-dots {
    z-index: 1;
  }
  .slick-dots li.slick-active button:before {
    opacity: unset;
    color: #e27106;
    width: 36px;
    height: 13px;
    background: #e27106;
    border-radius: 28px;
    margin-top: 2px;
    margin-left: -10px;
  }

  .slick-arrow {
    z-index: 1;
    width: 40px;
    height: 40px;
    // border: 2px solid #000;
    border-radius: 9999px;
    background-color: rgb(241, 241, 241);
  }

  .slick-next:before {
    content: "\02C3";
    font-size: 14px;
    font-weight: bold;
    opacity: 1;
    color: #000000d7 !important;
  }

  .slick-prev:before {
    content: "\02C2";
    font-size: 14px;
    font-weight: bold;
    opacity: 1;
    color: #000000d7 !important;
  }

  .slick-next {
    margin-right: -20px;
  }

  .slick-prev {
    margin-left: -20px;
  }
}
</style>
