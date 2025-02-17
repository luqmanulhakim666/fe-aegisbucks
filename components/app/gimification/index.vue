<template>
  <div>
    <p class="h5--small mb-6 success--text">
      Kebijakan Misi dan Dapatkan Reward
    </p>
    <v-row dense>
      <v-col cols="12" sm="6" class="mb-6">
        <v-card
          class="gimification pa-6 rounded-xl fill-height"
          flat
          color="#EC6484"
        >
          <h2 class="h2-xlarge white--text">Isi Survey</h2>
          <p class="h6--xsmall white--text">Fibe Mini</p>
          <img width="60" class="mt-4" src="/images/alfamart.png" alt="" />
          <img class="overlay-img" height="150" src="/images/fibe.png" alt="" />
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" class="mb-6">
        <v-card
          class="gimification pa-6 rounded-xl fill-height"
          flat
          color="#31288f"
        >
          <h2 class="h2-xlarge white--text">Scan Struk</h2>
          <p class="h6--xsmall white--text">Bear Brand</p>
          <div class="d-flex">
            <img width="60" class="mt-4" src="/images/alfamart.png" alt="" />
            <img
              width="60"
              class="mt-4 ml-2"
              src="/images/indomart.png"
              alt=""
            />
          </div>
          <img
            class="overlay-img"
            height="150"
            src="/images/bearbrand.png"
            alt=""
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.gimification {
  position: relative;
}
.overlay-img {
  right: 24px;
  top: -34px;
  position: absolute;
}
</style>
