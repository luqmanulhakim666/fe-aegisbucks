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
          <form-products-scan v-if="!state.isLoading" :form="form" />
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
import utils from "@/mixins/utils";
export default {
  mixins: [rules, meta, utils],
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
      reward: null,
      timeSpent: 0,
      isActive: true,
      variants: [],
      imageId: "",
      description: "",
    },
    state: {
      isLoading: false,
      isValid: true,
      item: {},
    },
    items: {
      breadcrumbs: [
        { text: "Products Scan", slug: "/admin/products-scn" },
        { text: "Create New Product Scan", slug: "" },
      ],
    },
  }),

  created() {
    this.meta.title = this.isCreated
      ? "Create New Product Scan"
      : "Edit Product Scan";

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

      const res = await this.$api.products.scan.getOne(id);

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
          timeSpent: Number(this.form.timeSpent),
          imageId: this.form.image?.id,
          isActive: this.form.isActive,
          description: this.form.description,
          reward: this.toInt(this.form.reward),
          variants: this.form.variants?.map((x) => {
            return x?.name;
          }),
        };

        let res = this.isCreated
          ? await this.$api.products.scan.create(payload)
          : await this.$api.products.scan.update(this.form.id, payload);

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
      this.$router.push("/admin/products-scan");
    },
  },

  watch: {
    "form.reward"(val) {
      if (val) {
        this.form.reward = this.decimal(val);
      }
    },
  },
};
</script>
