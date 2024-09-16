<template>
  <v-card class="ounded-lg" flat>
    <div class="d-flex">
      <v-skeleton-loader type="button" />
      <div class="ml-4">
        <v-skeleton-loader
          tile
          height="10"
          width="120"
          type="heading"
          class="mb-2"
        />
        <v-skeleton-loader width="100" tile height="10" type="heading" />
      </div>
    </div>
  </v-card>
</template>
