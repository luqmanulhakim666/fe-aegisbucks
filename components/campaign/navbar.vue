<template>
  <div class="campaign-navbar white">
    <div
      class="campaign-navbar_logo d-flex justify-center mx-auto container--fluid px-6 py-4 px-sm-10"
    >
      <general-logo-brand
        v-bind:class="{
          pointer: $route.name !== 'campaign-brandSlug-campaignSlug-success',
        }"
        :logo="logo"
        min_width="75"
        max_width="75"
      />
      <v-spacer />
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon size="32">mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- <v-list-item @click="share('facebook')">
          <v-list-item-content>Share on Facebook</v-list-item-content>
        </v-list-item>
        <v-list-item @click="share('twitter')">
          <v-list-item-content>Share on Twitter</v-list-item-content>
        </v-list-item> -->
          <v-list-item @click="copyLink">
            <v-list-item-content class="text--default">
              <div class="d-flex align-center">
                <v-icon small class="mr-2">mdi-content-copy</v-icon>
                Copy Link
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logo: String,
  },
  methods: {
    share(platform) {
      const url = window.location.href;
      const encodedUrl = encodeURIComponent(url);

      if (platform === "facebook") {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
      } else if (platform === "twitter") {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}`,
          "_blank"
        );
      }
    },
    copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(
        () => {
          this.$store.dispatch("snack", [
            "Link copied to clipboard!",
            "success lighten-2",
            "mdi-check-circle",
          ]);
        },
        (err) => {
          this.$store.dispatch("snack", [
            "Failed to copy link",
            "error",
            "mdi-close-circle",
          ]);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.campaign-navbar {
  &_logo {
    max-width: 500px;
    width: 100%;
    z-index: 0;
  }
}
</style>
