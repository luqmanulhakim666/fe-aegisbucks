<template>
  <v-dialog v-model="dialog" persistent width="500" v-if="dialog">
    <div class="white rounded-xl">
      <general-card-dialog-header
        :name="item.productScan.name"
        @close="onEmitClose()"
      />

      <div class="pa-6">
        <div>
          <p class="h7--xxsmall dark--text text-center mb-4">
            Bukti Upload Struk:
          </p>
          <div class="d-flex mx-auto justify-center">
            <v-img
              :lazy-src="`${getImage(item)}?auto=format,compress&w=50`"
              max-height="300"
              contain
              :src="getImage(item)"
            />
          </div>
        </div>

        <div class="d-flex justify-center mt-4">
          <a
            class="pa-2 rounded-xl text-center h8--supersmall d-inline-block v-card v-card--flat v-sheet theme--light success lighten-1 success--text"
            :href="`${getImage(item)}`"
            target="_blank"
          >
            <v-icon color="success">mdi-magnify</v-icon>
            Perbesar
          </a>
        </div>

        <v-divider class="my-8" />

        <v-expansion-panels flat class="mb-4 border-thin rounded-lg" focusable>
          <v-expansion-panel>
            <v-expansion-panel-header class="grey lighten-3">
              <span class="h6--xsmall">User</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content color="py-6">
              <p class="h7--xxsmall dark--text">Name</p>
              <p class="text--default dark--text">
                {{ item.user.name }}
              </p>

              <v-divider class="my-2" />
              <p class="h7--xxsmall dark--text">Email</p>

              <p class="text--default dark--text">
                {{ item.user.email }}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <template v-if="item.status === 'pending'">
          <general-form-text-area
            outlined
            label="Comment"
            bold
            optional
            v-model="form.reason"
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-btn
                block
                small
                depressed
                class="error lighten-1 text-capitalize h7--xxsmall"
                @status="onSubmit(reject)"
                :loading="loading"
              >
                Reject
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                small
                depressed
                class="primary lighten-1 text-capitalize h7--xxsmall"
                :loading="loading"
                @click="onSubmit('approved')"
              >
                Approve
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    dialog: Boolean,
    item: Object,
    loading: Boolean,
  },

  data: () => ({
    form: {
      reason: "",
    },
  }),

  computed: {
    products() {
      return this.item.productS;
    },
  },

  methods: {
    onSubmit(status) {
      this.$emit("on:submit", status, this.form.reason);
      this.onEmitClose();
    },

    onEmitClose() {
      this.form.reason = "";
      this.$emit("on:close");
    },
  },
};
</script>
