<template>
  <div class="neat white container pa-0 mx-auto">
    <img
      class="full-width"
      src="https://assets.klikindomaret.com///products/promopage/Mini-Banner-1.jpg"
    />

    <div class="content">
      <v-container fluid pa-4>
        <v-row>
          <v-col cols="6" v-for="i in 6" :key="i">
            <div :class="[i % 2 == 0 ? 'mb-10' : 'mb-0', 'v-responsive']">
              <div>
                <img
                  class="v-responsive"
                  src="https://sukamurah.com/wp-content/uploads/2020/05/NESTLE-BEAR-BRAND-01.png"
                  alt=""
                />
              </div>

              <div>
                <p>Brear Brand</p>
                <p>9.500</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.neat {
  max-width: 400px;
  width: 100%;
}
</style>
