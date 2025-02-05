<template>
  <v-card class="card pa-4 rounded-lg" flat>
    <v-skeleton-loader class="rounded" tile height="150" type="image" />
    <div class="flex-grow-1 mt-6">
      <v-skeleton-loader
        width="120"
        tile
        class="mt-2"
        height="10"
        type="text"
      />
      <v-skeleton-loader tile class="mt-2" height="16" type="text" />
      <v-skeleton-loader
        width="100"
        tile
        class="mt-2"
        height="10"
        type="text"
      />
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
.card {
  box-shadow: 0px 1px 5px rgba(155, 155, 155, 0.14) !important;
}
.v-skeleton-loader {
  &__avatar {
    width: 100px;
    height: 100px;
  }
}
</style>
