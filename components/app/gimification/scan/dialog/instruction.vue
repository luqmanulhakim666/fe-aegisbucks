<template>
  <v-dialog v-model="dialog" persistent width="600" v-if="dialog">
    <div class="white rounded-xl">
      <general-card-dialog-header :name="item.name" @close="onEmitClose()" />
      <div class="container py-10">
        <v-form v-model="state.isValid" ref="form">
          <v-img
            class="d-flex mx-auto mb-8"
            max-width="200"
            max-height="200"
            :src="getImage(item)"
            contain
          />

          <general-form-autocomplete
            v-model="form.variant"
            :items="item.variants"
            item-text="name"
            item-value="id"
            label="Variants"
            outlined
            required
            bold
            :rules="[required]"
          />

          <v-row dense class="my-4">
            <v-col cols="12" sm="6">
              <div class="dark lighten-3 pa-4 rounded-xl">
                <p class="h6--xsmall dark--text ml-6">Reward</p>
                <app-point :points="item.reward" />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="dark lighten-3 pa-4 rounded-xl">
                <p class="h6--xsmall dark--text ml-6">Prosses Pengerjaan</p>
                <div class="d-flex align-center">
                  <v-icon>mdi-clock-outline</v-icon>
                  <p class="h7--xxsmall ml-2 dark--text">
                    {{ item.timeSpent }} Menit
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>

          <div class="my-8">
            <p class="p--large dark--text">
              {{ item.description }}
            </p>
          </div>

          <v-btn
            depressed
            block
            class="mt-6 text-capitalize h7--xxsmall success lighten-1 success--text"
            @click="goScan()"
            >Klik untuk Scan Struck</v-btn
          >
        </v-form>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import media from "@/mixins/media";

export default {
  mixins: [rules, media],
  props: {
    dialog: Boolean,
    item: Object,
  },

  data: () => ({
    state: {
      isValid: true,
    },
    form: {
      variant: "",
    },
  }),

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },
    async goScan() {
      const valid = await this.validate(this.state.isValid);
      if (!valid) return;
      this.$router.push(`/scan/${this.item.id}?variantId=${this.form.variant}`);
    },
  },
};
</script>
