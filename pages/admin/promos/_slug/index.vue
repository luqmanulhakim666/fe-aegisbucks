<template>
  <div>
    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="!state.isLoading">
      <general-breadcrumbs :lists="items.breadcrumbs" class="mb-9" />

      <!-- FORM -->
      <div class="white pa-6 rounded-xl">
        <v-form v-model="state.isValid" ref="form">
          <form-promos
            v-if="!state.isLoading"
            :form="form"
            :brands="items.brands"
            :partners="items.partners"
            :products="items.products"
            :loadingFetchBrands="state.loadingFetchBrands"
            :loadingFetchPartners="state.loadingFetchPartners"
            :loadingFetchProducts="state.loadingFetchProducts"
            @fetch:brand="fetchBrands"
            @fetch:partners="fetchRetailPartners"
            @fetch:products="fetchProducts"
          />
        </v-form>
      </div>
      <!-- END FORM -->

      <div class="d-flex justify-end mt-8">
        <v-btn
          @click="goBack()"
          class="primary-create-btn text-capitalize h7--xxsmall"
          depressed
          :disabled="state.isLoading"
        >
          Kembali
        </v-btn>
        <v-btn
          :loading="state.isLoading"
          class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
          depressed
          @click="onSubmit()"
        >
          Simpan
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import meta from "@/mixins/meta";
import pipe from "@/mixins/pipe";

export default {
  mixins: [rules, meta, pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },
  data: () => ({
    meta: {
      title: "",
    },
    form: {
      name: "",
      image: {},
      brandId: "",
      productId: "",
      retails: [],
      expiredDate: "",
      termCondition: "",
      description: "",
      howToInfo: "",
      helpInfo: "",
      walletInfo: "",
      ctaLabel: "",
      ctaUrl: "",
      hasCoupon: true,
      isSpecial: true,
      isActive: true,
      time: {
        hh: "",
        mm: "",
        ss: "",
      },
    },
    state: {
      isLoading: false,
      loadingFetchBrands: false,
      loadingFetchPartners: false,
      loadingFetchProducts: false,
      isValid: true,
      item: {},
    },
    items: {
      brands: [],
      partners: [],
      products: [],
      breadcrumbs: [
        { text: "Promos", slug: "/admin/promos" },
        { text: "Create New Promos", slug: "" },
      ],
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Create New Promos" : "Edit Promos";

    if (!this.isCreated) {
      this.getOne();
    }

    if (this.isCreated) {
      this.fetchBrands();
    }
    this.fetchRetailPartners();
  },

  mounted() {
    let appBar = {
      title: this.meta.title,
      child: true,
    };

    this.$store.commit("SET_META", appBar);
  },

  computed: {
    isCreated() {
      return this.$route?.params?.slug === "create";
    },
  },

  methods: {
    async fetchRetailPartners(val) {
      this.state.loadingFetchPartners = true;

      const payload = {
        limit: 50,
        page: 1,
        keyword: val || "",
        sort: "desc",
      };

      const res = await this.$api.partners.getList(payload);

      if (res.success) {
        this.items.partners = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loadingFetchPartners = false;
    },

    async fetchProducts(val) {
      this.state.loadingFetchProducts = true;

      const payload = {
        brandId: this.form.brandId,
        limit: 50,
        page: 1,
        keyword: val || "",
        sort: "desc",
      };

      const res = await this.$api.products.getList(payload);

      if (res.success) {
        this.items.products = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loadingFetchProducts = false;
    },

    async fetchBrands(val) {
      this.state.loadingFetchBrands = true;
      const payload = {
        limit: 10,
        page: 1,
        keyword: val || "",
        role: "customer",
        sort: "desc",
      };

      const res = await this.$api.brands.getList(payload);

      if (res.success) {
        this.items.brands = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loadingFetchBrands = false;
    },

    async getOne() {
      this.state.isLoading = true;
      const id = this.$route?.params?.slug;

      const res = await this.$api.promos.getOne(id);

      if (res.success) {
        this.form = res.data;
        this.form.image = res.data.image;
        this.form.retails = res.data.retails?.map((x) => {
          return x?.retailId;
        });

        this.fetchBrands(this.form.brand?.name);

        if (res.data.expiredDate) {
          this.form.time = {
            HH: this.$dayjs(res.data?.expiredDate).format("HH"),
            mm: this.$dayjs(res.data?.expiredDate).format("mm"),
            ss: this.$dayjs(res.data?.expiredDate).format("ss"),
          };

          this.form.expiredDate = this.$dayjs(res.data?.expiredDate).format(
            "YYYY-MM-DD"
          );
        }

        this.items.breadcrumbs[1].text = res.data?.name;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (valid) {
        this.state.isLoading = true;

        const hours = this.form.time?.HH || 23;
        const minutes = this.form.time?.mm || 59;
        const seconds = this.form.time?.ss || 59;

        const dateInstance = this.$dayjs(this.form.expiredDate)
          .hour(hours)
          .minute(minutes)
          .second(seconds);

        const payload = {
          name: this.form.name,
          imageId: this.form.image?.id || null,
          brandId: this.form.brandId,
          productId: this.form.productId,
          retails: this.form.retails,
          expiredDate: dateInstance.toISOString(),
          termCondition: this.form.termCondition,
          description: this.form.description,
          howToInfo: this.form.howToInfo,
          helpInfo: this.form.helpInfo,
          walletInfo: this.form.walletInfo,
          ctaLabel: this.form.ctaLabel,
          ctaUrl: this.form.ctaUrl,
          hasCoupon: this.form.hasCoupon,
          isSpecial: this.form.isSpecial,
          isActive: this.form.isActive,
        };

        let res = this.isCreated
          ? await this.$api.promos.create(payload)
          : await this.$api.promos.update(this.form.id, payload);

        if (res.success) {
          this.setSuccessAlert("Data has been saved");
          this.goBack();
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }
      this.state.isLoading = false;
    },
    goBack() {
      this.$router.push("/admin/promos");
    },
  },
};
</script>
