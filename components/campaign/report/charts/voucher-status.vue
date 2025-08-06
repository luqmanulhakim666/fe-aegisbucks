<template>
  <div class="white pa-6 rounded-xl">
    <h4 class="h4--default dark--text text--lighten-1 mb-4">Voucher Status</h4>
    <v-row>
      <v-col align-self="center" cols="12" lg="6">
        <div class="d-flex justify-space-around" style="gap: 24px">
          <div
            class="d-flex justify-center flex-column"
            v-for="(item, index) in items"
            :key="index"
          >
            <v-avatar size="12" :color="item.color"></v-avatar>
            <h5 class="h5--small my-2">{{ decimal(item.value) }}</h5>
            <p class="text--default">{{ item.name }}</p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <apexchart
          :options="chartOptions"
          :series="chartSeries"
          width="300"
          height="700"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  props: {
    summary: Object,
  },
  data: () => ({
    items: [
      {
        name: "Total",
        value: 0,
        color: "primary lighten-2",
        textColor: "primary--text text--lighten-2",
      },
      {
        name: "Claimed",
        value: 0,
        color: "primary lighten-2",
        textColor: "primary--text text--lighten-2",
      },
      {
        name: "Used",
        value: 0,
        color: "success lighten-2",
        textColor: "success--text text--lighten-2",
      },
    ],
    chartSeries: [], // Holds the data for the pie chart
    chartOptions: {
      legend: false,
      chart: {
        type: "pie",
      },
      labels: ["Total", "Claim", "Used"],
      colors: ["#6DA0DE", "#F6BB66", "#20C933"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
          },
        },
      ],
    },
  }),
  mounted() {
    this.generateChartData();
  },
  methods: {
    generateChartData() {
      let voucherData = this.summary?.voucherCode;
      this.chartSeries = [
        voucherData?.total,
        voucherData?.claimed,
        voucherData?.usage,
      ];

      this.items[0].value = voucherData?.total;
      this.items[1].value = voucherData?.claimed;
      this.items[2].value = voucherData?.usage;
    },
  },
};
</script>

<style scoped>
/* Add some custom styles if needed */
</style>
