<template>
  <div class="statistic">
    <span class="h3--large">
      Statistik Pendaftaran Calon Mitra Inkubator
      <span class="primary--text"> {{ form.year }}</span>
    </span>

    <div class="white rounded-xl px-6 mt-8">
      <div
        class="shadow-small pa-4 align-start d-md-flex align-md-center justify-space-between"
        v-bind:class="{ 'd-flex flex-column-reverse ': isMobile }"
      >
        <template v-if="!state.isLoading">
          <div class="d-flex align-center">
            <v-card
              flat
              class="pa-4 rounded-xl"
              :color="generateColor('register')"
            >
              <v-icon :color="generateIcon('register').color">{{
                generateIcon("register").icon
              }}</v-icon>
            </v-card>
            <div class="ml-4">
              <p
                class="text--default mb-1 underline-hover pointer"
                @click="redirectToVerification()"
              >
                {{ humanizeLabel("register") }}
              </p>
              <p class="h4--default">{{ getTotalRegister }}</p>
            </div>
          </div>
        </template>
        <template v-if="state.isLoading">
          <general-skeleton-statistics />
        </template>

        <v-responsive max-width="130" class="mb-10 mb-md-0">
          <general-form-select
            v-model="form.year"
            class="dark lighten-3 rounded-xl"
            :items="getYearRange"
            outlined
            placeholder="Pilih Tahun"
            dense
            hide-details
            @change="onChangeYear"
          />
        </v-responsive>
      </div>

      <div class="shadow-small pa-4 mt-4">
        <template v-if="state.isLoading">
          <v-row>
            <v-col cols="12" md="3" v-for="i in 4" :key="i">
              <general-skeleton-statistics />
            </v-col>
          </v-row>
        </template>
        <template v-if="!state.isLoading">
          <v-row>
            <v-col
              cols="12"
              md="3"
              v-for="(item, index) in statistics"
              :key="index"
            >
              <div class="d-flex align-center">
                <v-card
                  flat
                  class="pa-4 rounded-xl"
                  :color="generateColor(index)"
                >
                  <v-icon :color="generateIcon(index).color">{{
                    generateIcon(index).icon
                  }}</v-icon>
                </v-card>
                <div class="ml-4">
                  <p
                    class="text--default mb-1 underline-hover pointer"
                    @click="redirectToVerification(index)"
                  >
                    {{ humanizeLabel(index) }}
                  </p>
                  <p class="h4--default">{{ item }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
import alert from "@/mixins/alert";
import screen from "@/mixins/screen";
export default {
  mixins: [pipe, alert, screen],

  data: () => ({
    form: {
      year: null,
    },
    state: {
      isLoading: false,
      currentYear: null,
    },
    items: {
      statistics: {},
    },
  }),

  created() {
    this.state.currentYear = new Date().getFullYear();
    this.form.year = this.state.currentYear;
    this.fetch(this.state.currentYear);
  },

  computed: {
    getYearRange() {
      let startYear = 2023;
      let years = [];

      while (startYear <= this.state.currentYear + 7) {
        years.push(startYear++);
      }

      return years;
    },

    statistics() {
      let { notChecklist, checklist, approve, reject } = this.items?.statistics;
      return { notChecklist, checklist, approve, reject };
    },

    getTotalRegister() {
      return this.items?.statistics["register"];
    },
  },

  methods: {
    redirectToVerification(status) {
      let val = "";

      if (status === "notChecklist") {
        val = "not_checklist";
      }

      if (status === "checklist") {
        val = "checklist";
      }

      if (status === "approve") {
        val = "approve";
      }

      if (status === "reject") {
        val = "reject";
      }

      this.$router.push({
        path: "/admin/verification-incubator/detai",
        query: {
          page: 1,
          limit: 10,
          isDraft: false,
          keyword: "",
          status: val,
          year: this.form.year,
        },
      });
    },
    async fetch(year) {
      this.state.isLoading = true;

      let payload = {
        year: Number(year),
      };

      const res = await this.$api.dashboard.summary.batch(payload);

      if (res.success) {
        this.items.statistics = res.data;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onChangeYear(val) {
      this.fetch(val);
    },

    humanizeLabel(val) {
      if (val === "register") return "Pendaftar";
      if (val === "checklist") return "Checklist";
      if (val === "notChecklist") return "Belum Checklist";
      if (val === "approve") return "Lolos Adm.";
      if (val === "reject") return "Tidak Lolos Adm.";
      return "";
    },

    generateColor(val) {
      if (val === "register") return "primary lighten-4";
      if (val === "checklist") return "primary lighten-3";
      if (val === "notChecklist") return "grey lighten-2";
      if (val === "approve") return "success lighten-4";
      if (val === "reject") return "error lighten-3";
      return "";
    },

    generateIcon(val) {
      let item = {
        icon: "",
        color: "",
      };

      if (val === "register") {
        item.icon = "mdi-clipboard-text";
        item.color = "primary lighten-1";
      }
      if (val === "checklist") {
        item.icon = "mdi-clipboard-check";
        item.color = "primary ligthten-1";
      }
      if (val === "notChecklist") {
        item.icon = "mdi-note-alert";
        item.color = "dark";
      }
      if (val === "approve") {
        item.icon = "mdi-checkbox-multiple-marked-circle";
        item.color = "success lighten-2";
      }
      if (val === "reject") {
        item.icon = "mdi-note-remove";
        item.color = "error lighten-1";
      }

      return item;
    },
  },
};
</script>

<style lang="scss" scoped>
.underline-hover:hover {
  text-decoration: underline !important;
}
</style>
