<template>
  <div class="container mb-14">
    <template v-if="state.isLoading">
      <general-loading />
    </template>
    <template v-if="!state.isLoading">
      <div class="success lighten-1 pa-10">
        <div class="white rounded-xl pa-6">
          <div class="d-flex">
            <img class="mr-1" width="50" height="50" src="/images/coin.png" />
            <div class="ml-4">
              <p class="h5--small">Saldo Reward</p>

              <h4 class="h4--default success--text">
                Rp {{ decimal(state.totalPoints) }}
              </h4>
              <p class="h7--xxsmall mt-2 dark--text">
                Total Pendapatan: {{ decimal(state.totalPoints) }}
              </p>
            </div>
          </div>

          <div class="ml-sm-16 mt-4">
            <!-- <v-btn
              small
              :block="isMobile"
              outlined
              rounded
              depressed
              color="success"
              class="h7--xxsmall text-capitalize mb-2 mb-sm-0"
            >
              Cara Dapat
            </v-btn> -->
            <v-btn
              :block="isMobile"
              small
              rounded
              depressed
              color="success lighten-1"
              class="h7--xxsmall text-capitalize success--text ml-sm-2"
              @click="handleDialogWithdraw"
            >
              Tarik Saldo Reward
            </v-btn>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="d-flex">
          <v-btn
            class="rounded-pill text-capitalize mr-2"
            @click="onChangeStatus(i)"
            v-for="i in 2"
            :key="i"
            width="140"
            depressed
            v-bind:class="{
              'success lighten-1 ': state.tab === i,
              'border-thin': state.tab !== i,
            }"
          >
            <div class="rounded-pill py-2">
              <p class="h7--xxsmall success--text">
                {{ i === 1 ? "Semua" : "Penarikan" }}
              </p>
            </div>
          </v-btn>
        </div>

        <div class="dark lighten-3 pa-4 mt-4 mb-2">
          <p class="h5--small">Riwayat</p>
        </div>

        <div v-for="(item, index) in items.list" :key="index">
          <div class="d-flex justify-space-between">
            <div>
              <p v-if="state.tab === 2">Reference No:{{ item.referenceNo }}</p>

              <p class="h7--xxsmall dark--text" v-else>
                {{ item.title }}
              </p>

              <p class="text--default dark--text">
                {{ fullDateTime(item.createdAt, "-") }}
              </p>

              <p class="text--default mt-2" v-if="item.description">
                *{{ item.description }}
              </p>
            </div>

            <div class="d-flex flex-column justify-end align-end">
              <p class="h8--supersmall">
                Rp
                {{
                  item.status === "approved" && item.type === "withdraw"
                    ? "-"
                    : item.status === "approved" && item.type === "scan_receipt"
                    ? ""
                    : ""
                }}
                {{ decimal(item.amount) }}
              </p>

              <p
                v-if="
                  item.type !== 'withdraw_falied' && item.type !== 'withdraw'
                "
                class="text--small text-capitalize"
                v-bind:class="{
                  'success--text': item.status === 'approved',
                  'error--text': item.status === 'reject',
                  'error--text': item.status === 'failed',
                  'primary--text': item.status === 'pending',
                }"
              >
                {{ item.status }}
              </p>
            </div>
          </div>
          <v-divider class="my-2" />
        </div>

        <client-only v-if="items.list ? items.list.length > 1 : 0">
          <infinite-loading @infinite="getMoreItems">
            <slot slot="spinner">
              <v-progress-circular
                indeterminate
                color="success lighten-1"
                size="25"
              />
            </slot>

            <span slot="no-more">
              <div class="mt-5">
                <p class="text--small dark--text">
                  Akhir dari data yang tersedia
                </p>
              </div>
            </span>
            <span slot="no-results"></span>
          </infinite-loading>
        </client-only>
      </div>
    </template>

    <app-dialog-withdraw
      :isDialog="state.isDialogWithdraw"
      :form="form"
      :isValid="state.isValid"
      :isLoading="state.loadingWithdraw"
      @on:submit="withdraw"
      @on:close="handleDialogWithdraw"
    />
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
import screen from "@/mixins/screen";
import { state } from "../store/auth";
export default {
  layout: "app",
  mixins: [pipe, screen],
  middleware: "userAuthenticated",
  data: () => ({
    form: {
      name: "",
      bankCode: "",
      amount: 0,
      bankAccoutnNo: "",
      note: "",
    },
    paging: {
      page: 1,
      limit: 5,
      sort: "desc",
      type: "",
    },
    state: {
      isLoading: false,
      totalPoints: 0,
      tab: 1,
      isDialogWithdraw: false,
      loadingWithdraw: false,
      isValid: true,
    },
    items: [],
  }),
  async created() {
    this.state.isLoading = true;

    await this.getItems();
    await this.getTotalPoint();

    this.state.isLoading = false;
  },
  methods: {
    async withdraw() {
      this.state.loadingWithdraw = true;

      const payload = {
        name: this.form.name,
        bankAccoutnNo: this.form.bankAccoutnNo,
        bankCode: this.form.bankCode,
        amount: this.form.amount,
        note: this.form.note,
      };

      const res = await this.$api.withdraw.create(payload);

      if (res.success) {
        this.setSuccessAlert("Permohonan pencairan telah dirikim");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loadingWithdraw = false;
    },

    handleDialogWithdraw() {
      this.form.name = "";
      this.form.bankCode = "";
      this.form.amount = 0;
      this.form.bankAccoutnNo = "";
      this.formnote = "";
      this.state.isDialogWithdraw = !this.state.isDialogWithdraw;
    },

    onChangeStatus(i) {
      this.paging.type = i === 2 ? "withdraw" : "";
      this.state.tab = i;
      this.paging.page = 1;
      this.items = [];
      this.getItems();
    },

    async getTotalPoint() {
      const res = await this.$api.users.point.total();

      if (res.success) {
        this.state.totalPoints = res.data?.total;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async getItems() {
      const res =
        this.state.tab === 1
          ? await this.$api.users.point.getList(this.paging)
          : await this.$api.withdraw.getList(this.paging);

      if (res.success) {
        this.items = res.data;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async getMoreItems($state) {
      let items = this.items;

      if (items?.list.length >= items?.paging.count) {
        $state.complete();
      } else {
        this.paging.page += 1;

        const res =
          this.state.tab === 1
            ? await this.$api.users.point.getList(this.paging)
            : await this.$api.withdraw.getList(this.paging);

        if (res.success) {
          this.items.list = [...this.items.list, ...res.data.list];

          if (this.items?.list?.length <= this.items.paging?.count) {
            $state.loaded();
          }
        }
      }
    },
  },
};
</script>
