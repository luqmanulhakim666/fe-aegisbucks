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
      <span
        class="text-capitalize label-text"
        v-if="label"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        {{ label }}
        <span
          class="text-capitalize label-text ml-1 error--text"
          v-if="required"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          *
        </span>
        <span
          class="text-capitalize label-text ml-1 info--text text--lighten-2"
          v-if="optional"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          (Opsional)
        </span>
      </span>
    </div>
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

    <template v-if="cropper.finalCroppedImage">
      <div class="d-flex align-start">
        <div>
          <v-img
            contain
            max-width="250"
            max-height="250"
            class="rounded-xl cover mt-2 image-preview border-thin grey lighten-3"
            :src="cropper.finalCroppedImage"
            alt="img"
          />
        </div>
        <v-btn icon @click="onEmitRemove()"
          ><v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>
    </template>

    <template v-if="!cropper.isLoading">
      <v-btn
        v-if="!getMediaName()"
        class="grey lighten-3 secondary--text text--lighten-5 text-capitalize h7--xxsmall"
        depressed
        @click="onOpenFile"
      >
        <v-icon v-if="icon" small class="mr-2">{{ icon }}</v-icon>
        {{ actionLabel }}
      </v-btn>

      <general-form-text-field
        hide-details="auto"
        dense
        class="hide-input mt-2"
        v-model="form.image"
        :rules="[required]"
      />
    </template>

    <template v-else>
      <v-progress-circular
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
                :aspect-ratio="aspectRatio"
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
              >Upload</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import rules from "@/mixins/rules";

export default {
  mixins: [rules],
  components: {
    Cropper,
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
  },

  data: () => ({
    cropper: {
      isEdited: false,
      media: {},
      isLoading: false,
      progress: 0,
      imageUrl: null,
      imageName: null,
      croppedImage: null,
      finalCroppedImage: null,
      dialog: false,
      hasImageId: null,
    },
  }),

  created() {
    this.cropper.hasImageId = !!this.form?.image?.id;
  },

  computed: {
    mediaId() {
      return this.form?.image?.id ? true : false;
    },

    getImage() {
      return this.mediaId
        ? `${this.$config.API_URL}/file/${this.form.image?.id}/file`
        : "";
    },
  },

  methods: {
    onEditImage() {
      this.cropper.isEdited = !this.cropper.isEdited;
    },

    onEmitRemove() {
      this.cropper.hasImageId = false;
      this.cropper.finalCroppedImage = null;
      this.form.image = "";
      this.onResetImage();
      this.$emit("on:remove");
    },

    getMediaName() {
      return this.form?.image?.name || null;
    },

    onPreview() {
      let url = this.form?.image?.url;
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
      this.form.image = val;
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
</style>
