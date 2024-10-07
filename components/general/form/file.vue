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
    <div
      v-if="getMediaName()"
      class="grey lighten-3 secondary--text text--lighten-5 d-flex justify-space-between align-center py-1 px-2 rounded-lg"
    >
      <p class="text--default pointer hover-underline" @click="onPreview()">
        {{ getMediaName() }}
      </p>
      <v-btn @click="onEmitRemove()" x-small color="secondary lighten-5" icon
        ><v-icon small>mdi-close</v-icon></v-btn
      >
    </div>

    <template v-if="!mediaFile.isLoading">
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
        v-model="form.file"
        :rules="[required]"
      />
    </template>

    <template v-else>
      <v-progress-circular
        :rotate="360"
        :size="60"
        :width="8"
        :value="mediaFile.progress"
        color="primary"
      >
        {{ mediaFile.progress }}%
      </v-progress-circular>
    </template>
  </div>
</template>

<script>
import rules from "@/mixins/rules";

export default {
  mixins: [rules],
  props: {
    form: Object,
    label: String,
    icon: String,
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
    mediaFile: {
      media: {},
      isLoading: false,
      progress: 0,
      url: null,
      name: null,
      dialog: false,
    },
  }),

  created() {},

  computed: {},

  methods: {
    getMediaName() {
      return this.form?.file?.name || null;
    },

    onEmitRemove() {
      this.mediaFile.media = {};
      this.mediaFile.url = null;
      this.mediaFile.name = null;
      this.$emit("on:remove");
    },

    onPreview() {
      return;
      let url = this.form?.image?.url;
      window.open(url);
    },

    onOpenFile() {
      if (!this.mediaFile.isLoading) {
        this.$refs.input.click();
      }
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files.length === 0) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.mediaFile.url = e.target.result;
        this.mediaFile.name = files[0]["name"];
        this.mediaFile.media = files[0];
      };
      reader.readAsDataURL(files[0]);
    },

    onDrop(e) {
      let file = e.dataTransfer.files[0];
      this.uploadFile(file);
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
    "mediaFile.media"(val) {
      this.form.file = val;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
