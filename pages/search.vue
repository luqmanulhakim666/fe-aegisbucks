<template>
  <div class="container">
    <template v-if="state.isLoading">
      <v-row>
        <v-col cols="12" md="4" v-for="i in this.paging.limit" :key="i">
          <general-skeleton-promo-card />
        </v-col>
      </v-row>
    </template>

    <template v-if="!state.isLoading">
      <v-btn
        small
        depressed
        class="text-capitalize h7--xxsmall mb-8"
        @click="$router.go(-1)"
      >
        <v-icon small class="mr-2">mdi-arrow-left</v-icon>
        Kembali</v-btn
      >
      <template v-if="keyword">
        <h5 class="h5--small dark--text mb-4">
          Hasil Pencarian: {{ keyword }}
        </h5>
      </template>

      <template v-if="!keyword">
        <h5 class="h5--small dark--text mb-4">
          {{ hasCoupon === "true" ? "Penawaran Kupon" : "Penawaran Utama" }}
        </h5>
      </template>

      <v-row>
        <v-col cols="12" md="4" v-for="(item, index) in items" :key="index">
          <general-card-coupons-action
            @click="onDetail(item.id)"
            :id="item.id"
            :showButton="!item.hasCoupon"
            :image="item"
            :name="item.name"
            :expiredDate="item.expiredDate"
          />
        </v-col>
      </v-row>

      <general-pagination
        class="mt-10"
        :perPage="paging.limit"
        :total="paging.count"
        :totalPage="paging.totalPage"
        :paging="paging"
        @on:change="onChangePagination"
      />
    </template>
  </div>
</template>

<script>
export default {
  layout: "app",
  middleware: "userAuthenticated",
  data: () => ({
    keyword: "",
    state: {
      isLoading: false,
    },
    items: [],
    body: {
      isActive: true,
    },
    paging: {
      page: 1,
      limit: 9,
    },
    hasCoupon: "",
  }),

  created() {
    this.fetch();
  },

  methods: {
    async fetch() {
      const query = this.$route.query;

      this.hasCoupon = query?.hasCoupon;

      try {
        this.state.isLoading = true;
        const res = await this.$api.promos.getList({
          ...this.body,
          ...this.paging,
          ...query,
        });
        if (res.success) {
          this.items = res.data.list?.map((x, index) => ({
            no: (this.paging.page - 1) * this.paging.limit + index + 1,
            ...x,
          }));

          this.paging = res.data.paging;

          this.paging["totalPage"] = Math.ceil(
            this.paging?.count / this.paging.limit
          );
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      } catch (error) {
        console.log(error);
      }

      console.log(query);
      this.state.isLoading = false;

      this.keyword = query.keyword;
    },

    onChangePagination(val) {
      this.paging.page = val;
      this.fetch();
    },
  },
};
</script>
