<template>
  <v-card class="px-6 py-10 rounded-lg mb-5" flat>
    <div class="d-md-flex justify-space-between align-center">
      <div>
        <v-skeleton-loader tile height="10" width="300" type="heading" />
        <v-skeleton-loader
          tile
          class="mt-6"
          height="10"
          max-width="400"
          type="heading"
        />
      </div>
      <v-skeleton-loader class="justify-end d-flex" width="300" type="button" />
    </div>
  </v-card>
</template>
