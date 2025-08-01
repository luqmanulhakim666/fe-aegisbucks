<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      :accept="acceptFile"
      @change="onFilePicked"
    />
    <div class="d-flex align-center mb-2">
      <p
        class="text-capitalize label-text"
        v-if="label"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        {{ label }}
      </p>
      <p
        class="text-capitalize label-text ml-1 error--text"
        v-if="required"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        *
      </p>
      <p
        class="text-capitalize label-text ml-1 info--text text--lighten-2"
        v-if="optional"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        (Opsional)
      </p>
    </div>

    <div
      v-if="getMediaName()"
      class="grey lighten-3 primary--text text--lighten-5 d-flex justify-space-between align-center py-1 px-2 rounded-lg"
    >
      <p class="text--default pointer hover-underline" @click="onPreview()">
        {{ getMediaName() }}
      </p>
      <v-btn
        v-if="removeAble"
        @click="onEmitRemove()"
        x-small
        color="primary lighten-5"
        icon
        ><v-icon small>mdi-close</v-icon></v-btn
      >
    </div>

    <template v-if="!mixins.state.isLoading">
      <v-btn
        v-if="!getMediaName()"
        class="grey lighten-3 primary--text text--lighten-5 text-capitalize h7--xxsmall"
        depressed
        @click="onOpenFile"
      >
        <v-icon v-if="icon" small class="mr-2">{{ icon }}</v-icon>
        {{ actionLabel }}
      </v-btn>
    </template>
    <template v-else>
      <v-progress-circular
        :rotate="360"
        :size="60"
        :width="8"
        :value="mixins.state.progress"
        color="primary"
      >
        {{ mixins.state.progress }}%
      </v-progress-circular>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import alert from "@/mixins/alert";
export default {
  mixins: [media, alert],
  props: {
    removeAble: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: () => false,
    },
    optional: {
      type: Boolean,
      default: () => false,
    },
    bold: {
      type: Boolean,
      default: () => false,
    },
    form: Object,
    mediaId: [String, Object],
    label: String,
    icon: String,
    acceptFile: {
      type: [String, Array],
      default: "/*",
    },
    actionLabel: {
      type: String,
      default: "Pilih File",
    },
  },

  methods: {
    onEmitRemove() {
      this.$emit("on:remove");
    },
    getMediaName() {
      return this.form?.image?.name || null;
    },

    onPreview() {
      let url = this.form?.image?.url;
      window.open(url);
    },
  },
  watch: {
    "mixins.state.media"(val) {
      this.form.image = val;
    },
  },
};
</script>
