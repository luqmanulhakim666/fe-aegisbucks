<template>
  <section class="card__news mt-6">
    <h1 class="dark--text h3--large mb-4">Popular di Forum</h1>

    <template v-if="isEmpty">
      <general-empty-state max_width="200" title="Tidak Ada Forum" />
    </template>

    <template v-if="!isEmpty">
      <v-carousel
        height="auto"
        hide-delimiters
        :show-arrows="false"
        :continuous="false"
        v-model="stepNo"
      >
        <v-carousel-item v-for="(item, i) of items.forum" :key="i">
          <v-card class="d-sm-flex shadow-small rounded-xl pa-4">
            <v-img
              max-height="180"
              max-width="190"
              :src="getImage(item)"
              class="mr-0 mr-sm-4 mb-3 mb-md-0 rounded-xl card__news-thumbnail"
            />

            <aside class="d-flex flex-column justify-space-between forum">
              <content>
                <h3 class="dark--text h7--xxsmall mb-1">{{ item.title }}</h3>
                <p class="p--small dark--text text--lighten-5 five-lines">
                  {{ htmlToPlainText(item.content) }}
                </p>
              </content>
              <div class="d-md-flex justify-space-between align-center pt-3">
                <div>
                  <v-icon class="mr-1"> mdi-comment </v-icon>
                  <span class="dark--text text--default">{{
                    item.totalComment
                  }}</span>
                </div>

                <div class="d-sm-flex align-center">
                  <div class="d-flex align-center my-4 my-sm-0">
                    <p class="text--small dark--text text--lighten-5">
                      {{ getUserName(item) }}
                    </p>
                    <v-avatar size="4" class="mx-2" color="dark lighten-5" />
                    <p class="text--small dark--text text--lighten-5">
                      {{ getFullDate(item.createdAt) }}
                    </p>
                  </div>

                  <v-btn
                    depressed
                    x-small
                    class="primary lighten-5 text-capitalize text--small ml-sm-6"
                    @click="onDetail(item.id)"
                  >
                    Lihat Detail
                    <v-icon size="14" class="ml-2">mdi-arrow-right </v-icon>
                  </v-btn>
                </div>
              </div>
            </aside>
          </v-card>
        </v-carousel-item>
      </v-carousel>

      <div class="d-flex justify-end mt-2">
        <v-btn
          x-small
          depressed
          outlined
          color="primary lighten-5"
          min-width="32"
          min-height="34"
          class="card__news-arrow mr-2"
          @click="prevButton"
          :disabled="prev"
        >
          <v-icon size="14"> mdi-arrow-left </v-icon>
        </v-btn>

        <v-btn
          x-small
          depressed
          outlined
          color="primary"
          min-width="32"
          min-height="34"
          class="card__news-arrow"
          @click="nextButton"
          :disabled="next"
        >
          <v-icon size="14"> mdi-arrow-right </v-icon>
        </v-btn>
      </div>
    </template>
  </section>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  data: () => ({
    stepNo: 0,
    next: false,
    prev: true,

    body: {
      skip: 1,
      limit: 5,
      keyword: "",
      sort: "popular",
      key: "",
      published: true,
    },

    items: {
      forum: [],
    },

    state: {
      isLoading: false,
    },
  }),

  created() {
    this.fetch();
  },

  computed: {
    isEmpty() {
      return this.items.forum?.length === 0;
    },
  },

  methods: {
    async fetch() {
      this.state.isLoading = true;

      const payload = {
        ...this.body,
      };

      let res = await this.$api.forum.getList(payload);

      if (res.success) {
        this.items.forum = res.data.list?.sort((a, b) => {
          if (a?.totalComment > b?.totalComment) return -1;
          if (a?.totalComment < b?.totalComment) return 1;
          return 0;
        });
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    getFullDate(val) {
      if (val) {
        return this.$dayjs(val).format(`DD MMMM YYYY`);
      }
      return "";
    },

    getUserName(val) {
      return val.user?.name || "";
    },

    onDetail(id) {
      this.$router.push(`/e-learning/forum/${id}/detail`);
    },

    nextButton() {
      this.stepNo += 1;
      this.prev = false;
    },

    prevButton() {
      this.stepNo -= 1;
    },

    getImage(val) {
      return val?.image?.url || "";
    },
  },

  watch: {
    stepNo(newStep, oldStep) {
      const lastIndex = this.items.forum.length - 1;

      if (lastIndex - 1 === oldStep) {
        this.next = true;
        this.prev = false;
      }

      if (this.stepNo < 1) {
        this.next = false;
        this.prev = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card__news {
  &-thumbnail {
    @media (max-width: 600px) {
      max-width: 100% !important;
    }
  }

  aside.forum {
    width: 100%;
  }
}
</style>
