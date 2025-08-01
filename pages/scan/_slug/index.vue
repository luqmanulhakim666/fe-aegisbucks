<template>
  <div class="container scan">
    <template v-if="deviceType === 'pc'">
      <div class="d-flex flex-column align-center justify-center">
        <general-form-image-cropper
          :form="form"
          bold
          required
          acceptFile="image/png, image/jpg, image/jpeg"
          @on:remove="onRemoveFile()"
        />

        <v-btn
          v-if="form.image.id"
          depressed
          small
          class="success lighten-1 success--text text-capitalize h7--xxsmall mt-2"
          :loading="isLoading"
          @click="postImage()"
        >
          Upload Gambar</v-btn
        >
      </div>
      <div class="text-center">
        <p class="h5--small success--text lighten-1 mt-6 mb-4 text-center">
          Upload Struk
        </p>
        <p class="text--default dark--text mb-4 text-center">
          Pastikan seluruh tulisan pada struk terlihat jelas & bukan merupakan
          struk duplikasi
        </p>

        <p class="h5--small primary--text my-4">Tips Scan Struk Belanja</p>

        <p class="text--default dark--text">
          1. Pastikan Struk dalam keadaan baik & terlihat jelas
        </p>
        <p class="text--default dark--text">
          2. Seluruh tulisan masih terlihat jelas
        </p>
        <p class="text--default dark--text">
          3. Foto pada bidang datar dengan pencahayaan yang jelas
        </p>
      </div>
    </template>

    <template v-else>
      <template v-if="location && cameraAccess">
        <div class="text-center">
          <p class="h5--small success--text lighten-1 mt-6 mb-4 text-center">
            Scan Struk
          </p>
          <p class="text--default dark--text mb-4 text-center">
            Pastikan seluruh tulisan pada struk terlihat jelas & bukan merupakan
            struk duplikasi
          </p>

          <p class="h5--small primary--text my-4">Tips Scan Struk Belanja</p>

          <p class="text--default dark--text">
            1. Pastikan Struk dalam keadaan baik & terlihat jelas
          </p>
          <p class="text--default dark--text">
            2. Seluruh tulisan masih terlihat jelas
          </p>
          <p class="text--default dark--text mb-8">
            3. Foto pada bidang datar dengan pencahayaan yang jelas
          </p>
        </div>

        <template v-if="!isTakenPicture">
          <div class="scanner-container rounded-lg">
            <div class="scanner-frame">
              <div class="corner top-left"></div>
              <div class="corner top-right"></div>
              <div class="corner bottom-left"></div>
              <div class="corner bottom-right"></div>

              <video
                class="d-flex align-center mx-auto justify-center"
                ref="video"
                autoplay
                muted
                playsinline
                disablePictureInPicture
                controlslist="nodownload nofullscreen noremoteplayback"
              ></video>
            </div>
          </div>
        </template>

        <template v-if="isTakenPicture">
          <!-- <v-img class="rounded-xl d-flex mx-auto" :src="capturedImage" /> -->
          <v-img
            class="rounded-xl d-flex mx-auto"
            :aspect-ratio="9 / 16"
            :src="capturedImage"
          />
        </template>

        <v-btn
          v-if="isTakenPicture"
          depressed
          small
          block
          outlined
          class="dark--text text-capitalize h7--xxsmall mt-8"
          @click="retake()"
        >
          Ambil ulang Gambar</v-btn
        >

        <v-btn
          v-if="isTakenPicture"
          depressed
          small
          block
          class="success lighten-1 success--text text-capitalize h7--xxsmall mt-2"
          :loading="isLoading"
          @click="uploadFile()"
        >
          Upload Gambar</v-btn
        >

        <v-btn
          v-if="!isTakenPicture"
          depressed
          small
          block
          class="success lighten-1 success--text text-capitalize h7--xxsmall mt-8"
          @click="captureFrame()"
        >
          <v-icon class="mr-2">mdi-camera</v-icon>
          Ambil Gambar</v-btn
        >
      </template>
    </template>
    <!-- Dialog -->
    <v-dialog
      v-if="deviceType !== 'pc'"
      persistent
      v-model="dialogVisible"
      class="dialog"
      width="300"
    >
      <div class="white rounded-xl">
        <div class="container">
          <div class="d-flex flex-column align-center">
            <v-img width="150" src="/images/selfie.svg" />
            <p class="text-center h6--xsmall dark--text mt-10 mb-4">
              Untuk scan struk anda harus memberikan akses terlebih dahulu
            </p>
          </div>

          <div class="mb-2">
            <v-btn
              block
              depressed
              class="text-capitalize h7--xxsmall success lighten-1 dark--text"
              small
              v-bind:class="{ success: location }"
              @click="getLocation()"
            >
              <v-icon small color="success" class="mr-2" v-if="location"
                >mdi-check-circle</v-icon
              >
              Izinkan Lokasi
            </v-btn>
          </div>

          <div>
            <v-btn
              depressed
              block
              class="text-capitalize h7--xxsmall success lighten-1 dark--text"
              small
              @click="getCameraAccess()"
              v-bind:class="{ success: cameraAccess }"
            >
              <v-icon small color="success" class="mr-2" v-if="cameraAccess">
                mdi-check-circle
              </v-icon>
              Izinkan Kamera
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  asyncData(context) {
    const deviceType = context.$ua.deviceType();
    return { deviceType };
  },
  layout: "app",
  middleware: "userAuthenticated",

  data() {
    return {
      form: {
        image: {},
      },
      location: null,
      cameraAccess: false,
      error: null,
      dialogVisible: false,
      stream: null,
      capturedImage: null,
      isLoading: false,
      progress: null,
      imageName: "",
      isTakenPicture: false,
    };
  },

  async mounted() {
    await this.checkPermissions();
    if (!this.location || !this.cameraAccess) {
      this.dialogVisible = true;
    }
  },

  beforeDestroy() {
    this.stopCamera();
  },

  computed: {
    isFromPC() {
      // user agent
      return this.$nuxt.$ua.isFromPc();
    },
  },

  methods: {
    onRemoveFile() {
      this.form.image = "";
    },

    captureFrame() {
      const video = this.$refs.video;
      if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video is not ready yet.");
        return;
      }

      requestAnimationFrame(async () => {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Target resolution: 9:16 aspect ratio (1080x1920)
        const targetWidth = 1080;
        const targetHeight = 1920;
        const targetAspectRatio = targetWidth / targetHeight;

        // Calculate scaling factor to maintain aspect ratio
        const videoAspectRatio = videoWidth / videoHeight;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (videoAspectRatio > targetAspectRatio) {
          // Video is wider than 9:16, crop horizontally
          drawHeight = videoHeight;
          drawWidth = videoHeight * targetAspectRatio;
          offsetX = (videoWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Video is taller than 9:16, crop vertically
          drawWidth = videoWidth;
          drawHeight = videoWidth / targetAspectRatio;
          offsetX = 0;
          offsetY = (videoHeight - drawHeight) / 2;
        }

        // Use OffscreenCanvas for high-performance rendering
        const canvas = new OffscreenCanvas(targetWidth, targetHeight);
        const ctx = canvas.getContext("2d", {
          alpha: false,
          willReadFrequently: true,
        });

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the cropped and scaled video frame onto the canvas
        ctx.drawImage(
          video,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        try {
          // Convert to PNG Blob for the best quality
          const blob = await canvas.convertToBlob({
            type: "image/png",
            quality: 1.0,
          });

          // Convert Blob to Data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            this.capturedImage = reader.result;
            this.isTakenPicture = true;
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Error capturing image:", error);
        }
      });
    },

    retake() {
      this.isTakenPicture = false;
      this.capturedImage = null;
      this.startCamera();
    },

    async postImage() {
      this.isLoading = true;

      const productScanId = this.$route.params?.slug;
      const variantId = this.$route.query?.variantId;
      const imageId = this.form.image?.id;
      const payload = {
        productScanId: productScanId,
        imageId: imageId,
        variantId: variantId,
      };

      const scan = await this.$api.userScan.post(payload);

      if (scan.success) {
        this.$router.push(`/scan/${scan.data.productScanId}/success`);
      }

      if (!scan.success) {
        this.setFailedAlert(scan);
      }

      this.isLoading = false;
    },

    async uploadFile() {
      this.isLoading = true;
      const byteCharacters = atob(this.capturedImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const setFile = new File([byteArray], "captured_image.jpg", {
        type: "image/jpeg",
      });

      const body = {
        file: setFile,
      };

      let onUploadProgress = this.onUploadProgress;

      let res = await this.$api.media.upload({
        body,
        onUploadProgress,
      });

      if (res.success) {
        const productScanId = this.$route.params?.slug;
        const variantId = this.$route.query?.variantId;
        const imageId = res.data?.id;
        const payload = {
          productScanId: productScanId,
          imageId: imageId,
          variantId: variantId,
        };

        const scan = await this.$api.userScan.post(payload);

        if (scan.success) {
          this.$router.push(`/scan/${scan.data.productScanId}/success`);
        }

        if (!scan.success) {
          this.setFailedAlert(scan);
        }
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.isLoading = false;
    },

    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            advanced: [
              { width: { exact: 2560 } },
              { width: { exact: 1920 } },
              { width: { exact: 1280 } },
              { width: { exact: 1024 } },
              { width: { exact: 900 } },
              { width: { exact: 800 } },
              { width: { exact: 640 } },
              { width: { exact: 320 } },
            ],
            facingMode: {
              exact: "environment",
            },
          },
        });
        this.$refs.video.srcObject = this.stream;
        this.cameraAccess = true;
      } catch (err) {
        this.error = "Error accessing the camera.";
      }
    },

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop(); // Stop each track
        });
        this.stream = null; // Clear reference
      }
    },

    async checkPermissions() {
      try {
        const locationPermission = await navigator.permissions.query({
          name: "geolocation",
        });
        const cameraPermission = await navigator.permissions.query({
          name: "camera",
        });

        const locationGranted =
          localStorage.getItem("locationGranted") === "true";
        const cameraGranted = localStorage.getItem("cameraGranted") === "true";

        // Check if the user reset permissions
        if (locationGranted && locationPermission.state !== "granted") {
          localStorage.removeItem("locationGranted");
        }

        if (cameraGranted && cameraPermission.state !== "granted") {
          localStorage.removeItem("cameraGranted");
        }

        // Re-check after possible reset
        const finalLocationGranted =
          localStorage.getItem("locationGranted") === "true";
        const finalCameraGranted =
          localStorage.getItem("cameraGranted") === "true";

        if (finalLocationGranted) {
          this.getLocation();
        }

        if (finalCameraGranted) {
          this.cameraAccess = true;
        }

        if (finalLocationGranted && finalCameraGranted) {
          this.startCamera();
        }

        if (!finalLocationGranted || !finalCameraGranted) {
          this.dialogVisible = true;
        }
      } catch (err) {
        this.error = "Failed to check permissions.";
      }
    },

    // 📍 Request Location Permission (After User Agrees)
    async getLocation() {
      if (!navigator.geolocation) {
        this.error = "Geolocation is not supported by your browser.";
        return;
      }

      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.error = null;
          },
          (err) => {
            this.error = err.message;
          }
        );

        localStorage.setItem("locationGranted", "true");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.error = null;
          },
          (err) => {
            this.error = err.message;
          }
        );
        localStorage.setItem("locationGranted", "true");
      }
    },

    // 📷 Request Camera Permission (After User Agrees)
    async getCameraAccess() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput"
        );

        if (!hasCamera) {
          this.error = "No camera detected.";
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        localStorage.setItem("cameraGranted", "true");

        this.cameraAccess = true;

        stream.getTracks().forEach((track) => track.stop()); // Stop camera after checking
        this.error = null;
      } catch (err) {
        this.error = "Camera permission denied.";
      }
    },
  },

  watch: {
    location(val) {
      if (val && this.cameraAccess) {
        this.dialogVisible = false;
        this.startCamera();
      }
    },

    cameraAccess(val) {
      if (val && this.location?.lat) {
        this.dialogVisible = false;
        this.startCamera();
      }
    },
  },
};
</script>

<style scoped>
.scan {
  margin-bottom: 64px;
}
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.scanner-frame {
  position: relative;
  width: 320px; /* Set the desired width of the scanner */
  height: 520px; /* Set the desired height of the scanner */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  --s: 50px; /* the size on the corner */

  padding: 20px; /* the gap between the border and image */
  border: 5px solid var(--v-success-lighten1); /* the thickness and color */
  -webkit-mask: conic-gradient(at var(--s) var(--s), #0000 75%, #000 0) 0 0 /
      calc(100% - var(--s)) calc(100% - var(--s)),
    linear-gradient(#000 0 0) content-box;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 5px solid #ccc; /* Color of the frame corner */
  border-radius: 10px;
}

.top-left {
  top: -5px;
  left: -5px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: -5px;
  right: -5px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: -5px;
  right: -5px;
  border-left: none;
  border-top: none;
}

.scanner {
  width: 100%;
  height: 100%;
}
video {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 85%;
  object-fit: cover; /* Ensures the video fills the frame without distortion */
  border-radius: inherit; /* Matches the scanner-frame rounded corners */
}
</style>
