import alert from "@/mixins/alert";
export default {
  mixins: [alert],
  data() {
    return {
      mixins: {
        state: {
          media: {},
          isLoading: false,
          progress: 0,
        },
      },
    };
  },

  methods: {
    getImage(val) {
      let url = "";

      if (val?.image?.url) {
        url = val?.image?.url;
      }

      if (!val?.image?.url) {
        url = `${this.$config.API_URL}/file/${val?.id}/file`;
      }

      return url;
    },

    async getOneMedia(id) {
      let res = await this.$api.media.getOne(id);
      if (res.success) {
        this.mixins.state.media = res.data;
      }
    },

    onOpenFile() {
      if (!this.mixins.state.isLoading) {
        this.$refs.input.click();
      }
    },

    onFilePicked(e) {
      let file = e.target.files[0];

      if (file !== undefined) {
        if (file.name.lastIndexOf(".") <= 0) {
          return;
        }
        let fr = new FileReader();
        fr.onload = () => {
          this.uploadFile(file);
        };
        fr.readAsDataURL(file);
      }
    },

    onDrop(e) {
      let file = e.dataTransfer.files[0];
      this.uploadFile(file);
    },

    async uploadFile(file) {
      let body = {
        file: file,
      };

      this.mixins.state.isLoading = true;

      let onUploadProgress = this.onUploadProgress;

      let res = await this.$api.media.upload({
        body,
        onUploadProgress,
      });

      if (res.success) {
        this.mixins.state.media = res.data;
        this.mixins.state.isLoading = false;
        if (this.mixins.state.progress >= 100) this.mixins.state.progress = 0;
      }

      if (!res.success) {
        this.mixins.state.isLoading = false;
        this.mixins.state.progress = 0;
        this.setFailedAlert(res);
      }
    },

    onUploadProgress(event) {
      this.mixins.state.progress = Math.round(
        (event.loaded / event.total) * 100
      );
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
