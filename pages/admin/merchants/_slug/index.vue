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
          <form-merchants
            v-if="!state.isLoading"
            :form="form"
            :categories="items.categories"
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
export default {
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
      phone: "",
      pic: "",
      categoryId: "",
      logoId: "",
      address: "",
      description: "",
      agreementNumber: "",
      agreementDate: "",
    },
    state: {
      isLoading: false,
      isValid: true,
      item: {},
    },
    items: {
      categories: [],
      breadcrumbs: [
        { text: "Merchants", slug: "/admin/merchants" },
        { text: "Create New Merchant", slug: "" },
      ],
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Create New Merchant" : "Edit Merchant";

    if (!this.isCreated) {
      this.getOne();
    }

    this.fetchCategories();
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
    async fetchCategories() {
      this.state.isLoading = true;
      let payload = {
        page: 0,
        limit: 0,
        keyword: "",
      };

      let res = await this.$api.merchants.category.getList(payload);

      if (res.success) {
        this.items.categories = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
      this.state.isLoading = false;
    },
    async getOne() {
      this.state.isLoading = true;
      const id = this.$route?.params?.slug;

      const res = await this.$api.merchants.getOne(id);

      if (res.success) {
        this.form = res.data;
        this.form.image = res.data.logo;
        this.form.agreementDate =
          this.$dayjs(this.form.agreementDate).format("YYYY-MM-DD") || "";

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
          phone: this.form.phone,
          pic: this.form.pic,
          logoId: this.form.image?.id || null,
          categoryId: this.form.categoryId || "",
          address: this.form.address,
          description: this.form.description,
          agreementNumber: this.form.agreementNumber,
          agreementDate: this.form.agreementDate,
        };

        let res = this.isCreated
          ? await this.$api.merchants.create(payload)
          : await this.$api.merchants.update(this.form.id, payload);

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
      this.$router.push("/admin/merchants");
    },
  },
};
</script>
