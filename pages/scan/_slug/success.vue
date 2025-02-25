<template>
  <div class="container">
    <template v-if="state.isLoading">
      <general-loading />
    </template>
    <template v-if="!state.isLoading">
      <div class="white pa-6 rounded-xl">
        <v-responsive max-width="300" class="d-flex mx-auto">
          <lotties-success />
        </v-responsive>

        <p class="h4--default success--text mt-6 mb-1 text-center">
          SCAN COMPLETE
        </p>

        <p class="text--large text-center dark--text">
          Selamat Kamu mendapatkan reward Rp {{ item.reward }}
        </p>

        <v-btn
          depressed
          small
          block
          class="success lighten-1 text-capitalize h7--xxsmall dark--text mt-10"
          link
          to="/my-rewards"
          >Cek Reward Saya</v-btn
        >
        <v-btn
          small
          block
          outlined
          depressed
          class="text-capitalize h7--xxsmall dark--text mt-2"
          link
          to="/scan"
          >Kerjakan Misi Lainnya</v-btn
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  layout: "app",
  props: {
    dialog: false,
  },

  data: () => ({
    state: {
      isLoading: false,
    },
    item: {},
  }),

  created() {
    this.getOne();
  },

  methods: {
    async getOne() {
      const id = this.$route.params.slug;
      this.state.isLoading = true;
      const res = await this.$api.products.scan.getOne(id);

      if (res.success) {
        this.item = res.data;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },
  },
};
</script>
