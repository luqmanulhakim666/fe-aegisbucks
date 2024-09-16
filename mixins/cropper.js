export default {
  data() {
    return {
      cropper: {
        media: {},
        isLoading: false,
        progress: 0,
        imageUrl: null,
        imageName: null,
        croppedImage: null,
        finalCroppedImage: null,
        dialog: false,
      },
    };
  },

  methods: {
    getImage(val) {
      return val?.image?.url || "";
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
    },

    async uploadFile() {
      let blob = this.dataURLtoBlob(this.cropper.croppedImage);

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
        this.cropper.finalCroppedImage = this.cropper.croppedImage;
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

      // Create a File object with the Blob data and the specified file name
      return new File([u8arr], this.cropper.imageName, { type: mime });
    },

    closeDialog() {
      this.cropper.dialog = false;
      this.cropper.imageUrl = null; // Clear the image when the dialog is closed
      this.cropper.imageName = null;
      this.cropper.croppedImage = null;
    },
    // Add methods for fit and show entire image

    onResetImage() {
      // Reset the cropper to show the entire image
      this.$refs?.cropper?.reset();
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
};
