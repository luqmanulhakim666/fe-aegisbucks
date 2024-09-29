<template>
  <div class="white pa-6 rounded-xl fill-height">
    <h4 class="h4--default primary--text text--lighten-1 mb-4">
      Visit Claim Trend
    </h4>

    <apexchart
      class="fill-height"
      :options="chartOptions"
      :series="chartSeries"
      width="100%"
      height="auto"
    />
  </div>
</template>

<script>
export default {
  props: {
    summary: Object,
  },
  data: () => ({
    // summary: {
    //   trends: [
    //     { month: 1, year: 2024, totalClaim: 15, totalView: 250 },
    //     { month: 2, year: 2024, totalClaim: 20, totalView: 400 },
    //     { month: 3, year: 2024, totalClaim: 5, totalView: 100 },
    //     { month: 4, year: 2024, totalClaim: 10, totalView: 150 },
    //     { month: 5, year: 2024, totalClaim: 25, totalView: 500 },
    //     { month: 6, year: 2024, totalClaim: 0, totalView: 200 },
    //     { month: 7, year: 2024, totalClaim: 30, totalView: 600 },
    //     { month: 8, year: 2024, totalClaim: 18, totalView: 450 },
    //     { month: 9, year: 2024, totalClaim: 12, totalView: 300 },
    //     { month: 10, year: 2024, totalClaim: 22, totalView: 520 },
    //   ],
    // },
    chartSeries: [],
    chartOptions: {
      chart: {
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth", // Smooth line curves
      },
      xaxis: {
        categories: ["a"], // Months will go here
        title: {
          text: "Date (Month-Year)",
        },
      },
      colors: ["#20C933", "#6DA0DE"], // Custom colors for the lines
      legend: {
        position: "top",
      },
    },
  }),
  created() {
    this.generateChartData();
  },
  methods: {
    generateChartData() {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Prepare the data for the chart
      const claimData = this.summary?.trends.map((trend) => trend.totalClaim);
      const viewData = this.summary?.trends.map((trend) => trend.totalView);
      const categories = this.summary?.trends.map(
        (trend) => `${months[trend.month - 1]}-${trend.year}`
      );

      this.chartSeries = [
        {
          name: "Total Claims",
          data: claimData,
        },
        {
          name: "Total Views",
          data: viewData,
        },
      ];

      // Set categories (months and years) for the x-axis
      this.chartOptions.xaxis.categories = categories;
    },
  },
};
</script>

<style scoped>
/* Add some custom styles if needed */
</style>
