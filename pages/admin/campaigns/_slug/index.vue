<template>
  <div>
    <template v-if="state.fetchLoading">
      <general-loading />
    </template>

    <template v-if="!state.fetchLoading">
      <v-tabs show-arrows grow v-model="state.tab" centered icons-and-text>
        <v-tab
          :class="['header', { 'disabled-tab': true }]"
          active-class="header-active"
          v-for="(header, index) in items.tab_headers"
          :key="index"
        >
          <p class="h8--supersmall text-capitalize">
            {{ header.name }}
          </p>

          <v-icon class="mb-1">{{ header.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items class="mt-10 transparent" v-model="state.tab">
        <v-tab-item>
          <form-campaign-general
            v-if="state.tab === 0"
            :form="form"
            :users="items.users"
            :brands="items.brands"
            :loading="state.isLoading"
            :loadingFetchBrand="state.loadingFetchBrand"
            @on:next="onNext"
            @set:loading="setLoading"
            @fetch:brand="fetchBrands"
          />
        </v-tab-item>

        <v-tab-item>
          <form-campaign-products
            v-if="state.tab === 1"
            :products="items.products"
            :form="form"
            @get:detail="fetchCampaignDetail"
          />
        </v-tab-item>

        <v-tab-item>
          <form-campaign-voucher
            v-if="state.tab === 2"
            :products="form.campaignProducts"
            :partners="items.partners"
            :form="form"
          />
        </v-tab-item>
        <v-tab-item>
          <form-campaign-templates v-if="state.tab === 3" :form="form" />
        </v-tab-item>
        <v-tab-item>
          <form-campaign-preview
            v-if="state.tab === 4"
            :brandSlug="form.brand.slug"
            :campaignSlug="form.slug"
            :isPublished="form.published"
          />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import meta from "@/mixins/meta";
import utils from "@/mixins/utils";
export default {
  mixins: [rules, meta, utils],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },
  data: () => ({
    meta: {
      title: "Create Campaign",
    },
    form: {
      userId: "",
      name: "",
      brandId: "",
      termCondition: "",
      budget: null,
      description: "",
      expiredDate: null,
      enableCaptcha: null,
      loginGmail: null,
      loginWhatsapp: null,
      googleAnalyticScript: "",
      gmailUsername: "",
      gmailPassword: "",
      templateId: "1",
      primaryColor: "#2962ff",
      secondaryColor: "#E27106",
      backgroundImageId: "",
      coverSection: [],
      headerSection: [],
      footerSection: [],
      thanksSection: [],
      campaignProducts: [],
      additionalInformation: [{ label: "Title", content: "" }],
      date: "",
      time: {
        hh: "",
        mm: "",
        ss: "",
      },
    },
    state: {
      isLoading: false,
      fetchLoading: false,
      loadingFetchBrand: false,
      tab: 0,
    },
    items: {
      users: [],
      brands: [],
      products: [],
      partners: [],
      tab_headers: [
        {
          name: "General",
          icon: "mdi-tune",
          completed: false,
        },
        {
          name: "Products",
          icon: "mdi-package-variant-closed",
          completed: false,
        },
        {
          name: "Voucher",
          icon: "mdi-ticket-percent-outline",
          completed: false,
        },
        // {
        //   name: "Rating",
        //   icon: "mdi-star",
        //   completed: false,
        // },
        {
          name: "Templates",
          icon: "mdi-hammer-screwdriver",
          completed: false,
        },
        {
          name: "Preview",
          icon: "mdi-monitor-eye",
          completed: false,
        },
      ],
    },
  }),

  created() {
    this.fetchUsers();
    if (this.isCreated) {
      this.fetchBrands();
    }

    this.fetchRetailPartners();

    if (!this.isCreated) {
      this.fetchCampaignDetail(this.$route.params.slug);
    }
  },

  mounted() {
    this.setMeta("Campaign");
  },

  methods: {
    async fetchProducts(val) {
      const payload = {
        keyword: val || "",
        limit: 0,
        page: 1,
        brandId: this.form.brandId,
      };

      const res = await this.$api.products.getList(payload);

      if (res.success) {
        this.items.products = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },
    async fetchUsers(val) {
      const payload = {
        limit: 10,
        page: 1,
        keyword: val || "",
        role: "customer",
      };

      const res = await this.$api.users.getList(payload);

      if (res.success) {
        this.items.users = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async fetchBrands(val) {
      this.state.loadingFetchBrand = true;
      const payload = {
        limit: 10,
        page: 1,
        keyword: val || "",
        role: "customer",
      };

      const res = await this.$api.brands.getList(payload);

      if (res.success) {
        this.items.brands = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loadingFetchBrand = false;
    },

    async fetchRetailPartners(val) {
      const payload = {
        limit: 10,
        page: 1,
        keyword: val || "",
      };

      const res = await this.$api.partners.getList(payload);

      if (res.success) {
        this.items.partners = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async fetchCampaignDetail(id) {
      this.state.fetchLoading = true;
      const res = await this.$store.dispatch("campaign/getDetail", id);

      this.form = res.data;
      this.form.templateId = "1";

      this.fetchBrands(this.form.brand?.name);

      this.meta.title = res.data.name;

      if (!res.data.primaryColor) {
        this.form.primaryColor = "#2962ff";
      }

      if (!res.data.secondaryColor) {
        this.form.secondaryColor = "#E27106";
      }

      if (!res.data.additionalInformation) {
        this.form.additionalInformation = [{ label: "Title", content: "" }];
      }

      if (res.data.expiredDate) {
        this.form.date = this.$dayjs(res.data?.expiredDate).format(
          "YYYY-MM-DD"
        );
        this.form.time = {
          HH: this.$dayjs(res.data?.expiredDate).format("HH"),
          mm: this.$dayjs(res.data?.expiredDate).format("mm"),
          ss: this.$dayjs(res.data?.expiredDate).format("ss"),
        };
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.fetchLoading = false;
    },

    goBack() {
      if (this.state.tab > 0) {
        this.state.tab -= 1;
      }
    },

    onNext() {
      if (this.state.tab + 1 < this.items.tab_headers.length) {
        this.state.tab += 1;
      }
    },

    setLoading(val) {
      this.state.isLoading = val;
    },
  },
  watch: {
    "form.brandId": {
      handler(val) {
        this.fetchProducts();
      },
      immediate: true,
    },
    $route: {
      handler(val) {
        const q = val?.query?.tab;

        switch (q) {
          case "general":
            this.state.tab = 0;
            break;
          case "products":
            this.state.tab = 1;
            break;
          case "vouchers":
            this.state.tab = 2;
            break;
          case "templates":
            this.state.tab = 3;
            break;
          case "preview":
            this.state.tab = 4;
            break;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.disabled-tab {
  pointer-events: none;
}
.header {
  // background: #eef5f9 !important;
  // border: 1px solid red;
  // margin: 2px;
}
.header-active {
  // color: white;
  // background: var(--v-primary-base) !important;
}
</style>
