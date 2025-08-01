<template>
  <v-dialog width="500" v-model="dialog" persistent v-if="item">
    <div class="white">
      <template v-if="isLoading">
        <general-loading />
      </template>

      <template v-if="!isLoading">
        <general-card-dialog-header name="Qrcode" @close="onEmitClose()" />
        <div class="pa-4">
          <div
            id="print-section"
            class="d-flex mx-auto text-center flex-column justify-center border-thin pa-4"
          >
            <v-img class="mx-auto" max-width="100" :src="getImage(getLogo)" />
            <p class="h6--xsmall mt-4 dark--text">
              {{ item.name }}
            </p>

            <v-img class="mx-auto" :src="image" width="100%" max-width="250" />

            <campaign-footer />
          </div>

          <v-btn
            small
            depressed
            class="primary text-capitalize h7--xxsmall mx-auto d-flex mt-10"
            @click="onDownload()"
          >
            <v-icon small class="mr-2">mdi-download</v-icon>
            Download
          </v-btn>
        </div>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import html2canvas from "html2canvas";
import media from "@/mixins/media";

export default {
  mixins: [media],
  props: {
    item: Object,
    dialog: Boolean,
  },

  data: () => ({
    image: "",
    isLoading: false,
  }),

  computed: {
    getLogo() {
      return this.item?.logo ?? "";
    },
  },

  methods: {
    onEmitClose() {
      this.$emit("close");
    },

    async onDownload() {
      const element = document.getElementById("print-section");
      if (!element) return console.error("Element not found!");

      try {
        const canvas = await html2canvas(element, { useCORS: true });
        const imgData = canvas.toDataURL("image/png"); // Convert to PNG

        // Create a download link
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${this.item?.name?.toLowerCase()}-qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error capturing section:", error);
      }
    },

    async getQrCodeImage() {
      this.isLoading = true;

      let res = await this.$api.merchants.getQrCode(this.item.id);
      const blob = new Blob([res]);
      const src = URL.createObjectURL(blob);
      this.image = src;

      this.isLoading = false;
    },
  },

  watch: {
    dialog(val) {
      if (val) {
        this.getQrCodeImage();
      }
    },
  },
};
</script>
