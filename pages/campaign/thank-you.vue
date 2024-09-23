<template>
  <div class="neat mx-auto">
    <div class="d-flex my-4">
      <general-logo max_width="60" />
      <v-spacer />

      <v-icon size="32">mdi-share-variant</v-icon>
    </div>

    <div
      class="d-flex full-width flex-column align-center justify-center container"
    >
      <v-icon class="text-center mx-auto d-flex success--text" size="150"
        >mdi-check-circle</v-icon
      >

      <div class="d-flex flex-column justify-center">
        <h3 class="section-title h3--xsmall text-center mb-6">
          Selamat, Kamu berhasil mendapatkan i-Kupon 1 KALENG BEAR BRAND!
        </h3>
      </div>

      <div class="full-width text-center">
        <v-divider class="my-6" />
        <h4 class="success--text h4--default">LSWJQNK</h4>
        <v-icon size="100">mdi-barcode</v-icon>
        <v-divider class="my-6" />
      </div>

      <p class="text--default">
        i-Kupon berlaku hinggal 15 Sep 2024 dan dapat digunakan di Indomaret
      </p>
      <br />
      <p class="text--default">
        Kami juga telah mengirimkan i-Kupon beserta
        <b>cara pemakaian nya melalui email luqmanulh25@gmail.com</b>
      </p>
    </div>

    <div
      class="mx-auto my-10 d-flex flex-column text-center align-center justify-center"
    >
      <p class="text--small my-2">Powered by:</p>
      <general-logo max_width="70" />
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty",
  data() {
    return {
      heroImages: [
        "https://assets.klikindomaret.com/products/promopage/Mini-Banner-1.jpg",
        "https://assets.klikindomaret.com/products/promopage/Mini-Banner-2.jpg",
        "https://assets.klikindomaret.com/products/promopage/Mini-Banner-3.jpg",
      ],
    };
  },

  methods: {
    onDetail() {
      this.$router.push("/admin/templates/1");
    },
  },
};
</script>

<style lang="scss" scoped>
.neat {
  max-width: 500px;
  width: 100%;
}

.hero-slider {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
}

.content {
  background-color: #fff;
}

.product {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
}

.product-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 15px;
}

.product-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.price {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.discount {
  font-size: 12px;
  color: #e57373;
  text-decoration: line-through;
}

.final-price {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Social Media Section Styles */
.social-media-section {
  border-bottom: 1px solid #f3f3f3;
  border-top: 1px solid #f3f3f3;
  margin-top: 20px;
  padding: 20px;
}

.social-icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.social-icons v-icon {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.social-icons v-icon:hover {
  transform: scale(1.1);
}
</style>
