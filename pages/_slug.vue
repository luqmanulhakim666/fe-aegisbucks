<template>
  <div class="container">
    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="!state.isLoading">
      <v-btn small class="mb-6" depressed @click="() => $router.push('/')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-img class="cover rounded-xl" height="350" :src="getImage(item)" />

      <h3 class="h3--xlarge my-8">{{ item.name }}</h3>

      <div class="d-md-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-chip
            outlined
            color="success lighten-2"
            class="d-flex mr-1"
            v-for="(partner, index) in item.retails"
            :key="index"
          >
            <p class="text--default dark--text">{{ partner.retail.name }}</p>
          </v-chip>

          <div class="ml-4 d-flex align-center">
            <v-avatar size="10" color="dark lighten-2"></v-avatar>
            <p class="h7--xxsmall dark--text ml-4">
              {{ item.brand.name }}
            </p>
          </div>
        </div>
        <!-- <div class="d-flex">
          <div v-for="(partner, index) in item.retails"></div>
          <v-chip>
            {{ partner.retail }}
          </v-chip>
          {{ item.brand }}
        </div> -->

        <div>
          <p class="h7--xxsmall dark--text">Berlaku Sampai</p>
          <p class="text--default dark--text">
            {{ fullDateMonthTextYear(item.expiredDate, " ") }}
          </p>
        </div>
      </div>

      <campaign-accordion
        class="my-6"
        label="Description"
        :termAndConditions="item.description"
      />
      <campaign-accordion
        class="my-6"
        label="How To"
        :termAndConditions="item.howToInfo"
      />
      <campaign-accordion
        class="my-6"
        label="Term and Conditions"
        :termAndConditions="item.termCondition"
      />
      <campaign-accordion
        class="my-6"
        label="Help"
        :termAndConditions="item.helpInfo"
      />
      <campaign-accordion
        class="my-6"
        label="Wallet"
        :termAndConditions="item.walletInfo"
      />

      <v-btn
        block
        depressed
        color="success lighten-1"
        class="h6--xsmall dark--text text-capitalize my-8"
        @click="onClaim()"
      >
        {{ item.ctaLabel ? item.ctaLabel : "Claim" }}
      </v-btn>
    </template>
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import alert from "@/mixins/alert";
export default {
  async asyncData({ route, app }) {
    const slug = route.params.slug;
    let item = {};

    try {
      const res = await app.$api.promos.slug(slug);
      item = res.data;
    } catch (error) {}

    return { item: item };
  },
  mixins: [alert, media, pipe],
  middleware: "userAuthenticated",
  meta: [meta],
  layout: "app",
  data: () => ({
    state: {
      isLoading: false,
    },
  }),

  computed: {},

  methods: {
    onClaim() {
      const url = this.item.ctaUrl;

      let domain = url.replace(/(^\w+:|^)\/\//, "");
      if (!url) return;

      window.open(`http://${domain}`, "_blank");
    },
  },
};
</script>
