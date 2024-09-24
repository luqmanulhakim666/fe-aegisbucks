<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      :accept="acceptFile"
      @change="onFilePicked"
    />

    <div>
      <template v-if="cropper.hasImageId">
        <div class="d-flex align-start">
          <div>
            <v-img
              contain
              max-width="250"
              max-height="250"
              class="rounded-xl cover mt-2 image-preview border-thin grey lighten-3"
              :src="getImage"
              alt="img"
            />
          </div>
          <v-btn icon @click="onEmitRemove()"
            ><v-icon color="error">mdi-close-circle</v-icon></v-btn
          >
        </div>
      </template>
    </div>

    <v-row>
      <draggable
        class="row"
        v-bind="dragOptions"
        v-model="cropper.images"
        @start="drag = true"
        @end="(drag = false), $emit('on:order')"
        group="people"
      >
        <v-col
          class="mt-6"
          cols="12"
          md="4"
          v-for="(cropper, index) in cropper.images"
          :key="index"
        >
          <div
            class="img-preview d-flex align-start justify-center border-thin fill-height"
            v-if="cropper.id"
          >
            <v-img
              contain
              max-width="250"
              max-height="250"
              class="rounded-xl cover mt-2 image-preview border-thin grey lighten-3"
              :src="getImage(cropper)"
              alt="img"
            />
            <div class="img-preview-btn">
              <v-btn icon @click="onEmitRemove(index)"
                ><v-icon color="error">mdi-close-circle</v-icon></v-btn
              >
            </div>
          </div>
        </v-col>
      </draggable>
    </v-row>

    <template v-if="!cropper.isLoading">
      <div class="drop-file-component mt-8" @click="onOpenFile">
        <v-icon>mdi-image</v-icon>

        <div class="d-flex mx-auto justify-center mt-1">
          <v-icon color="dark lighten-5" small>mdi-plus-circle</v-icon>
          <h6 class="h6--xsmall dark--text text--lighten-5">Add Image</h6>
        </div>
      </div>

      <general-form-text-field
        hide-details="auto"
        dense
        class="hide-input mt-2"
        v-model="cropper.images"
        :rules="[arrayRule]"
      />
    </template>

    <template v-else>
      <v-progress-circular
        class="d-flex justify-center mx-auto"
        :rotate="360"
        :size="60"
        :width="8"
        :value="cropper.progress"
        color="primary"
      >
        {{ cropper.progress }}%
      </v-progress-circular>
    </template>

    <v-dialog
      v-if="cropper.dialog"
      v-model="cropper.dialog"
      max-width="600px"
      persistent
    >
      <v-card :disabled="cropper.isLoading" :loading="cropper.isLoading">
        <v-card-title class="headline"></v-card-title>
        <v-card-text>
          <div
            class="d-flex flex-column justify-center align-center"
            v-if="!cropper.isEdited && !cropper.croppedImage"
          >
            <v-img :src="cropper.imageUrl" />

            <v-btn
              class="text--default mt-4"
              small
              outlined
              depressed
              color="secondary"
              @click="onEditImage()"
            >
              <v-icon size="16" class="mr-1">mdi-crop</v-icon>
              Crop
            </v-btn>
          </div>

          <div
            class="d-flex flex-column justify-center align-center"
            v-if="!cropper.croppedImage"
          >
            <template v-if="cropper.isEdited">
              <cropper
                ref="cropper"
                :src="cropper.imageUrl"
                :aspect-ratio="16 / 9"
                class="cropper"
              />
              <div class="d-flex align-center">
                <v-btn
                  plain
                  x-small
                  class="text--default mt-4 text-capitalize"
                  depressed
                  @click="onEditImage()"
                >
                  <v-icon size="16" class="mr-1">mdi-close</v-icon>
                  Cancel
                </v-btn>
                <v-btn
                  x-small
                  class="text--default mt-4 text-capitalize"
                  text
                  depressed
                  color="secondary"
                  @click="cropImage"
                >
                  <v-icon size="16" class="mr-1">mdi-check</v-icon>
                  Apply
                </v-btn>
              </div>
            </template>
          </div>

          <div v-if="cropper.croppedImage">
            <div
              class="d-flex align-center justify-center flex-column grey lighten-3"
            >
              <v-img :src="cropper.croppedImage" />
              <v-btn
                class="text--default mt-4"
                small
                depressed
                plain
                color="error"
                @click="onResetImage"
              >
                <v-icon size="16" class="mr-1">mdi-restart</v-icon>
                Reset
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="mb-4" v-if="!cropper.isEdited">
            <v-btn
              depressed
              class="h7--xxsmall text-capitalize"
              @click="closeDialog"
              :disabled="cropper.isLoading"
              >Cancel</v-btn
            >
            <v-btn
              depressed
              class="h7--xxsmall text-capitalize"
              color="primary"
              :loading="cropper.isLoading"
              @click="uploadFile"
              >Add</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cropper from "vue-cropperjs";
import draggable from "vuedraggable";
import "cropperjs/dist/cropper.css";
import rules from "@/mixins/rules";

export default {
  mixins: [rules],
  components: {
    Cropper,
    draggable,
  },
  props: {
    bold: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Boolean,
      default: false,
    },
    require: {
      type: Boolean,
      default: () => false,
    },
    aspectRatio: {
      type: [String, Number],
    },
    form: Object,
    label: String,
    icon: String,
    acceptFile: {
      type: [String, Array],
      default: "/*",
    },
    actionLabel: {
      type: String,
      default: "Choose file",
    },
    cropper: Object,
  },

  data: () => ({
    // cropper: {
    //   images: [],
    //   isEdited: false,
    //   media: {},
    //   isLoading: false,
    //   progress: 0,
    //   imageUrl: null,
    //   imageName: null,
    //   croppedImage: null,
    //   finalCroppedImage: null,
    //   dialog: false,
    //   hasImageId: false,
    //   indexFile: null,
    // },
  }),

  created() {
    this.cropper.hasImageId = !!this.cropper?.image?.id;
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        ghostClass: "ghost",
      };
    },
    mediaId() {
      return this.cropper?.image?.id ? true : false;
    },
  },

  methods: {
    getImage(val) {
      return `${this.$config.API_URL}/file/${val.id}/file` || "";
    },

    onEditImage() {
      this.cropper.isEdited = !this.cropper.isEdited;
    },

    onEmitRemove(index) {
      this.cropper.images.splice(index, 1);
      this.cropper.hasImageId = false;
      this.cropper.finalCroppedImage = null;
      this.cropper.image = "";
      this.onResetImage();
      this.$emit("on:remove");
    },

    getMediaName() {
      return this.cropper?.image?.name || null;
    },

    onPreview() {
      let url = this.cropper?.image?.url;
      window.open(url);
    },

    async getOneMedia(id) {
      let res = await this.$api.media.getOne(id);
      if (res.success) {
        this.cropper.media = res.data;
      }
    },

    onOpenFile() {
      if (!this.cropper.isLoading) {
        this.$refs.input.click();
      }
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files.length === 0) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.cropper.imageUrl = e.target.result;
        this.cropper.imageName = files[0]["name"];
        this.cropper.dialog = true;
      };
      reader.readAsDataURL(files[0]);
    },

    onDrop(e) {
      let file = e.dataTransfer.files[0];
      this.uploadFile(file);
    },

    cropImage() {
      const croppedDataUrl = this.$refs?.cropper.getCroppedCanvas().toDataURL();
      this.cropper.croppedImage = croppedDataUrl;
      this.cropper.isEdited = false;
    },

    async uploadFile() {
      const image = this.cropper.croppedImage
        ? this.cropper.croppedImage
        : this.cropper.imageUrl;

      let blob = this.dataURLtoBlob(image);

      const body = {
        file: blob,
      };

      this.cropper.isLoading = true;

      let onUploadProgress = this.onUploadProgress;

      let res = await this.$api.media.upload({
        body,
        onUploadProgress,
      });

      if (res.success) {
        this.cropper.images.push({
          ...res.data,
          finalCroppedImage: image,
        });
        this.cropper.media = res.data;
        this.cropper.isLoading = false;
        if (this.cropper.progress >= 100) this.cropper.progress = 0;
        this.cropper.finalCroppedImage = image;
        this.closeDialog();
      }

      if (!res.success) {
        this.cropper.isLoading = false;
        this.cropper.progress = 0;
        this.setFailedAlert(res);
      }
    },

    onUploadProgress(event) {
      this.cropper.progress = Math.round((event.loaded / event.total) * 100);
    },

    dataURLtoBlob(dataUrl) {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], this.cropper.imageName, { type: mime });
    },

    closeDialog() {
      const index = this.cropper.indexFile;

      // this.cropper.images?.splice(index, 1);
      this.cropper.dialog = false;
      this.cropper.imageUrl = null;
      this.cropper.imageName = null;
      this.cropper.croppedImage = null;
    },

    onResetImage() {
      this.$refs?.cropper?.reset();
      this.cropper.isEdited = false;
      this.cropper.croppedImage = null;
    },

    handleAcceptFiles(files) {
      let mimeType = [];
      for (let i in files) {
        let type = files[i];

        if (type === "pdf") {
          mimeType.push("application/pdf");
        }

        if (type === "doc") {
          mimeType.push("application/msword");
        }

        if (type === "ppt") {
          mimeType.push(
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          );
        }

        if (type === "video") {
          mimeType.push(".mp4");
        }

        if (type === "text") {
          mimeType.push(".txt");
        }

        if (type === "image") {
          mimeType.push("image/png, image/jpeg");
        }
      }
      return mimeType;
    },
  },
  watch: {
    "cropper.media"(val) {
      // this.cropper.image = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.cropper-bg {
  background-image: none !important;
}

::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
.drop-file-component {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drop-file-component.dragging-over {
  border-color: #333;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #00557c15;
}

.list-group-item {
  cursor: move;
}

.img-preview {
  position: relative;
  cursor: grab;
  &-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
