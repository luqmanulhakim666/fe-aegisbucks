<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      :accept="acceptFile"
      @change="onFilePicked"
    />

    <div
      v-if="getMediaName()"
      class="grey lighten-3 secondary--text text--lighten-5 d-flex justify-space-between align-center py-1 pa-4 rounded-lg"
    >
      <p class="text--default pointer hover-underline" @click="onPreview()">
        {{ getMediaName() }}
      </p>
      <v-btn @click="onEmitRemove()" x-small color="secondary lighten-5" icon
        ><v-icon small>mdi-close</v-icon></v-btn
      >
    </div>

    <template v-if="!mixins.state.isLoading">
      <div
        v-if="!getMediaName()"
        :class="['drop-file-component', isDraggingOver ? 'dragging-over' : '']"
        @click="onOpenFile"
      >
        <v-icon>mdi-image</v-icon>

        <div class="d-flex mx-auto justify-center mt-1">
          <v-icon color="dark lighten-5" small>mdi-plus-circle</v-icon>
          <h6 class="h6--xsmall dark--text text--lighten-5">Add Image</h6>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="d-flex mx-auto justify-center">
        <v-progress-circular
          :rotate="360"
          :size="60"
          :width="8"
          :value="mixins.state.progress"
          color="primary"
        >
          {{ mixins.state.progress }}%
        </v-progress-circular>
      </div>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    form: Object,
    require: {
      type: Boolean,
      default: () => false,
    },
    optional: {
      type: Boolean,
      default: () => false,
    },
    acceptFile: {
      type: [String, Array],
      default: "/*",
    },
    actionLabel: {
      type: String,
      default: "Pilih File",
    },
  },
  data: () => ({
    fileInputRef: null,
    isDraggingOver: false,
    setIsDraggingOver: false,
  }),

  methods: {
    onEmitRemove() {
      this.form.emailHeaderImageId = null;
      this.mixins.state.media = null;
    },
    getMediaName() {
      if (this.form?.emailHeaderImageId?.name) {
        return this.form?.emailHeaderImageId?.name;
      }

      if (this.form.emailHeaderImageId && !this.form.emailHeaderImageId?.name) {
        this.getOneMedia(this.form.emailHeaderImageId);
      }

      if (!this.form.emailHeaderImageId) {
        return "";
      }
    },

    onPreview() {
      let url = "";

      if (this.form?.emailHeaderImageId?.url) {
        url = this.form?.emailHeaderImageId?.url;
      }

      if (this.form?.emailHeaderImageId?.id) {
        url = `${this.$config.API_URL}/file/${this.form?.emailHeaderImageId?.id}/file`;
      }

      window.open(url);
    },

    handleDragOver(event) {
      event.preventDefault();
      this.setIsDraggingOver = true;
    },

    handleDragLeave(event) {
      event.preventDefault();
      this.setIsDraggingOver = false;
    },

    handleClick() {
      this.fileInputRef.current.click();
    },
  },
  watch: {
    "mixins.state.media"(val) {
      this.form.emailHeaderImageId = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.drop-file-component {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drop-file-component.dragging-over {
  border-color: #333;
}
</style>
