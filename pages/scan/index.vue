<template>
  <div class="container">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="d-sm-flex justify-space-between align-center border-thin rounded-xl py-2 px-6 mb-6"
    >
      <div class="d-flex flex-column align-center flex-sm-row">
        <v-img
          :lazy-src="`${getImage(item)}?auto=format,compress&w=10`"
          width="100"
          height="100"
          contain
          :src="getImage(item)"
          alt="product"
        />

        <div class="ml-4">
          <p class="h6--xsmall mb-2 dark--text text-center text-sm-left">
            {{ item.name }}
          </p>
          <app-point :points="item.reward" />
        </div>
      </div>

      <v-btn
        :block="isMobile"
        depressed
        small
        class="success lighten-1 text-capitalize h7--xxsmall dark--text mt-4 mt-sm-0"
        @click="onSeeInstruction(item)"
        >Lihat Petunjuk</v-btn
      >
    </div>

    <app-gimification-scan-dialog-instruction
      @on:close="onSeeInstruction()"
      :item="state.selectedItem"
      :dialog="state.isDialog"
    />
  </div>
</template>

<script>
import media from "@/mixins/media";
import screen from "@/mixins/screen";
export default {
  layout: "app",
  mixins: [media, screen],
  middleware: "userAuthenticated",
  data: () => ({
    state: {
      isLoading: false,
      isDialog: false,
    },
    items: [],
    selectedItem: {},
  }),

  created() {
    this.getProductScan();
  },

  methods: {
    async getProductScan() {
      this.state.isLoading = true;

      const payload = {
        page: 1,
        limit: 0,
        isActive: true,
      };

      const res = await this.$api.products.scan.getList(payload);

      if (res.success) {
        this.items = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onSeeInstruction(item) {
      if (item?.id) {
        this.state.selectedItem = item;
      }
      this.state.isDialog = !this.state.isDialog;
    },
  },
};
</script>
