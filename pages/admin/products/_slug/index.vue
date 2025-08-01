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
          <form-products
            v-if="!state.isLoading"
            :form="form"
            :brands="items.brands"
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
          class="primary lighten-5 text-capitalize ml-2 h7--xxsmall"
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
export default {
  mixins: [rules, meta],
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
      brandId: null,
      imageId: "",
      description: "",
    },
    state: {
      isLoading: false,
      isValid: true,
      item: {},
    },
    items: {
      brands: [],
      breadcrumbs: [
        { text: "Products", slug: "/admin/products" },
        { text: "Create New Product", slug: "" },
      ],
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Create New Product" : "Edit Product";

    if (!this.isCreated) {
      this.getOne();
    }

    this.fetchBrands();
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
    async fetchBrands() {
      this.state.isLoading = true;

      let payload = {
        page: 0,
        limit: 0,
        keyword: "",
      };

      let res = await this.$api.brands.getList(payload);

      if (res.success) {
        this.items.brands = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
      this.state.isLoading = false;
    },
    async getOne() {
      this.state.isLoading = true;
      const id = this.$route?.params?.slug;

      const res = await this.$api.products.getOne(id);

      if (res.success) {
        this.form = res.data;
        this.form.image = res.data.image;

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

        const payload = {
          name: this.form.name,
          brandId: this.form.brandId,
          imageId: this.form.image?.id,
          description: this.form.description,
        };

        let res = this.isCreated
          ? await this.$api.products.create(payload)
          : await this.$api.products.update(this.form.id, payload);

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
      this.$router.push("/admin/products");
    },
  },
};
</script>
