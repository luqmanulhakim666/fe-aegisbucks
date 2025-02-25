<template>
  <div class="container">
    <template v-if="state.isLoading">
      <general-loading />
    </template>
    <template v-if="!state.isLoading">
      <div class="success lighten-1 pa-10">
        <div class="white rounded-xl pa-6 d-flex">
          <img class="mr-1" width="50" height="50" src="/images/coin.png" />
          <div class="ml-4">
            <p class="h5--small">Saldo Reward</p>

            <h4 class="h4--default success--text">
              Rp {{ state.totalPoints }}
            </h4>
            <p class="h7--xxsmall mt-2 dark--text">
              Total Pendapatan: {{ state.totalPoints }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p class="h5--small mb-2 mt-8">Riwayat</p>

        <div v-for="(item, index) in items" :key="index">
          <div class="d-flex justify-space-between">
            <div>
              <p class="h7--xxsmall dark--text">
                {{ item.title }}
              </p>

              <p class="text--default dark--text">
                {{ fullDateTime(item.createdAt, "-") }}
              </p>
            </div>

            <div class="d-flex flex-column justify-start align-start">
              <p class="h8--supersmall">Rp {{ item.amount }}</p>

              <p
                class="text--default text-capitalized"
                v-bind:class="{
                  'success--text': item.status === 'approved',
                  'error--texx': item.status === 'reject',
                  'primary--text': item.status === 'pending',
                }"
              >
                {{ item.status }}
              </p>
            </div>
          </div>
          <v-divider class="my-2" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  layout: "app",
  mixins: [pipe],
  data: () => ({
    body: {
      page: 1,
      limit: 0,
      sort: "desc",
    },
    state: {
      isLoading: false,
      totalPoints: 0,
    },
    items: [],
  }),
  async created() {
    this.state.isLoading = true;

    await this.getList();
    await this.getTotalPoint();

    this.state.isLoading = false;
  },
  methods: {
    async getTotalPoint() {
      const res = await this.$api.users.point.total();

      if (res.success) {
        this.state.totalPoints = res.data?.total;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async getList() {
      const res = await this.$api.users.point.getList(this.body);

      if (res.success) {
        this.items = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },
  },
};
</script>
