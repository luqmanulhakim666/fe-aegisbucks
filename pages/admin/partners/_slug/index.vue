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
          <form-partners v-if="!state.isLoading" :form="form" />
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
      imageId: "",
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
      breadcrumbs: [
        { text: "Brands", slug: "/admin/brands" },
        { text: "Create New Brand", slug: "" },
      ],
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Buat Berita Baru" : "Ubah Berita";

    if (!this.isCreated) {
      this.getOne();
    }
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
    async getOne() {
      this.state.isLoading = true;
      const id = this.$route?.params?.slug;

      const res = await this.$api.partners.getOne(id);

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
          imageId: this.form.image?.id || null,
          address: this.form.address,
          description: this.form.description,
          agreementNumber: this.form.agreementNumber,
          agreementDate: this.form.agreementDate,
        };

        let res = this.isCreated
          ? await this.$api.partners.create(payload)
          : await this.$api.partners.update(this.form.id, payload);

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
      this.$router.push("/admin/partners");
    },
  },
};
</script>
