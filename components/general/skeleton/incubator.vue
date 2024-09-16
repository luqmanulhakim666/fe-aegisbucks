<template>
  <v-card class="card pa-5 rounded-lg mb-5" flat height="250">
    <v-skeleton-loader
      class="d-block ma-auto rounded-pill"
      width="80"
      height="80"
      type="image"
    />

    <div class="d-flex align-center flex-column mt-5">
      <v-skeleton-loader tile height="10" width="155" type="text" />
      <v-skeleton-loader
        tile
        class="mt-2"
        height="10"
        width="100"
        type="text"
      />
    </div>

    <div class="mt-7">
      <v-skeleton-loader height="50" type="image" />
    </div>
  </v-card>
</template>
