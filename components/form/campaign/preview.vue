<template>
  <div>
    <iphone
      :brandSlug="brandSlug"
      :campaignSlug="campaignSlug"
      :isPublished="isPublished"
    />

    <div class="d-flex justify-end mt-8">
      <v-btn
        @click="goBack()"
        class="primary-create-btn text-capitalize h7--xxsmall"
        depressed
        outlined
        :disabled="state.isLoading"
      >
        Previous
      </v-btn>

      <v-btn
        v-if="!isPublished"
        :loading="state.isLoading"
        class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
        depressed
        @click="onSubmit()"
      >
        Publish
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    brandSlug: String,
    campaignSlug: String,
    isPublished: Boolean,
  },

  data: () => ({
    state: {
      isLoading: false,
    },
  }),

  methods: {
    async onSubmit() {
      this.state.isLoading = true;

      const res = await this.$api.campaigns.publish(this.$route.params.slug, {
        publish: true,
      });

      if (res.success) {
        this.setSuccessAlert("Campaign has been published");
        this.$router.push("/admin/campaigns");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    goBack() {
      this.$router.push({
        path: `/admin/campaigns/${this.$route.params.slug}`,
        query: { tab: "templates" },
      });
    },
  },
};
</script>
