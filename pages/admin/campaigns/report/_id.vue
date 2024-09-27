<template>
  <div>
    <general-report-header :isSearch="false" />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
export default {
  async asyncData({ route, app }) {
    const id = route.params?.id;

    if (!id) {
      redirect("/campaign/404");
    }

    return { id: id };
  },
  mixins: [meta],

  data: () => ({
    body: {
      summary: {
        fromDate: "",
        toDate: "",
      },
    },
  }),
  created() {
    this.fetch();
  },

  mounted() {
    this.setMeta("Report");
  },

  methods: {
    async fetch() {
      const res = await this.$api.campaigns.report.getSummary(
        this.id,
        this.body.summary
      );

      return { res: res.data };
    },
  },
};
</script>
