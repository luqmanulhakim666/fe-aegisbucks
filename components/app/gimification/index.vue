<template>
  <div>
    <p class="h5--small mb-6 success--text">
      Kebijakan Misi dan Dapatkan Reward
    </p>
    <v-row dense>
      <v-col cols="12" sm="6" class="mb-6"> <app-gimification-survey /> </v-col>
      <v-col cols="12" sm="6" class="mb-6">
        <app-gimification-scan />
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
