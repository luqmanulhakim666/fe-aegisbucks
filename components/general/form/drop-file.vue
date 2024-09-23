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
      :class="['drop-file-component', isDraggingOver ? 'dragging-over' : '']"
      @click="onOpenFile"
    >
      <v-icon>mdi-image</v-icon>

      <div class="d-flex mx-auto justify-center mt-1">
        <v-icon color="dark lighten-5" small>mdi-plus-circle</v-icon>
        <h6 class="h6--xsmall dark--text text--lighten-5">Add Image</h6>
      </div>
    </div>
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
      this.$emit("on:remove");
    },
    getMediaName() {
      return this.form?.image?.name || null;
    },

    onPreview() {
      let url = this.form?.image?.url;
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
