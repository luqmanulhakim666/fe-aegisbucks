<template>
  <div class="white pa-6 rounded-xl">
    <h4 class="h4--default dark--text text--lighten-1 mb-4">Products</h4>
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="chartSeries"
      width="100%"
      height="400"
    />
  </div>
</template>

<script>
export default {
  props: {
    summary: Object,
  },
  data: () => ({
    chartSeries: [],
    chartOptions: {
      chart: {
        type: "bar",
        stacked: false, // You can toggle this to true for a stacked bar chart
      },
      plotOptions: {
        bar: {
          horizontal: false, // Makes it a horizontal bar chart
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [], // Product names will go here
      },
      labels: [],
      colors: ["#008FFB", "#00E396"], // Custom colors for claimed and view
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
      // Prepare the data for the chart
      const claimedData = this.summary.products?.map(
        (product) => product.claimed
      );
      const viewData = this.summary.products?.map((product) => product.view);
      const categories = this.summary.products?.map((product) => product.name);

      this.chartSeries = [
        {
          name: "Claimed",
          data: claimedData,
        },
        {
          name: "View",
          data: viewData,
        },
      ];

      this.chartOptions.labels = categories;
      // Set categories (product names) for the x-axis
      this.chartOptions.xaxis.categories = categories;
    },
  },
};
</script>

<style scoped>
/* Add some custom styles if needed */
</style>
