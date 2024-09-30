<template>
  <div
    class="product pointer d-flex flex-column justify-space-between fill-height white pa-4 rounded-xl"
    @click="onEmitDetail()"
  >
    <img class="product-img" :src="imageUrl" alt="Product Image" />

    <p class="product-title">
      {{ name }}
    </p>

    <!-- Product Price -->
    <div class="price d-flex flex-column align-start">
      <p class="discount">Rp {{ decimal(price) }}</p>
      <p class="final-price">Rp {{ decimal(finalPrice) }}</p>
    </div>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  props: {
    imageUrl: String,
    name: String,
    price: [String, Number],
    discount: [String, Number],
  },
  computed: {
    finalPrice() {
      return this.price - this.discount || 0;
    },
  },
  methods: {
    onEmitDetail() {
      this.$emit("on:detail");
    },
  },
};
</script>

<style lang="scss" scoped>
.product {
  height: 100%;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
}

.product-img {
  width: 100%;
  height: auto;
  max-height: 130px;
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
</style>
