<template>
  <div>
    <general-form-autocomplete
      v-model="form.campaign"
      placeholder="Search Brand"
      className="text-capitalize"
      outlined
      label="Select Campaign"
      bold
      hide-details
      :items="items.campaigns"
      item-text="name"
      return-object
      :loading="state.isLoading"
      @keydown="onSearch"
      @change="selectCampaign"
    />

    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="state.campaignId">
      <dashboard
        :campaign="state.selectedItem"
        :campaignId="state.campaignId"
        class="mt-10"
      />
    </template>
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import routes from "@/mixins/routes";
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";
import debounce from "lodash/debounce";

export default {
  async asyncData({ app }) {
    let campaigns = [];

    const payload = {
      page: 1,
      limit: 10,
      keyword: "",
      sort: "desc",
      type: "",
    };

    const res = await app.$api.campaigns.getList(payload);

    if (res.success) {
      campaigns = res.data.list;
    }

    return { campaigns: campaigns };
  },

  mixins: [meta, routes, utils, pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },

  data: () => ({
    meta: {
      title: "Dashboard",
    },

    body: {
      page: 1,
      limit: 10,
      keyword: "",
      sort: "desc",
      type: "",
    },

    form: {
      campaign: {},
    },

    state: {
      isLoading: false,
      isDeleteDialog: false,
      campaignId: null,
      selectedItem: {},
    },
    report: {},
    items: {
      campaigns: [],
      paging: {},
    },
  }),

  async created() {
    this.setMeta(this.meta.title, false);

    this.items.campaigns = await this.campaigns;

    if (this.campaigns?.length > 0) {
      this.state.selectedItem = this.campaigns[0];
      this.form.campaign = this.campaigns[0];
      this.state.campaignId = this.campaigns[0]["id"];
    }
  },

  methods: {
    async fetch() {
      this.state.isLoading = true;

      const res = await this.$api.campaigns.getList({ ...this.body });

      if (res.success) {
        this.items.campaigns = res.data.list?.map((x, index) => ({
          no: (this.body.page - 1) * this.body.limit + index + 1,
          ...x,
        }));
        this.items.paging = res.data.paging;

        this.items.paging["totalPage"] = Math.ceil(
          this.items.paging?.count / this.body.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onFilterCampaignType(val) {
      this.body.type = val;

      this.fetch();
      this.pushQuery("campaignType", val);
    },

    onSearch(val) {},

    onSearch: debounce(function (val) {
      const keyword = val?.target?._value;

      this.body.keyword = keyword || "";
      this.body.page = 1;
      this.fetch();
    }, 500),

    selectCampaign(val) {
      this.state.selectedItem = val;
      this.state.campaignId = val?.id;
    },
  },

  watch: {
    "form.campaign"(val) {
      if (!val) {
        this.state.selectedItem = this.campaigns[0];
        this.form.campaign = this.campaigns[0];
        this.state.campaignId = this.campaigns[0]["id"];
      }
    },
  },
};
</script>
