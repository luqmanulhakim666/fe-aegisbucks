<template>
  <div class="pb-12">
    <v-list-group no-action>
      <template v-slot:activator>
        <v-btn large block depressed color="primary">
          <v-list-item-title class="white--text text-capitalize">
            <v-icon size="18" color="#fff" class="mb-1 mr-2"
              >mdi-account-circle</v-icon
            >
            Daftar/Masuk
          </v-list-item-title>
        </v-btn>
      </template>

      <v-list-item
        v-for="(item, index) of menus"
        :key="index"
        class="pl-6"
        @click="onAction(item.path)"
      >
        <v-list-item-icon>
          <v-icon size="18" class="ml-2">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  props: {
    menus: Array
  },

  methods: {
    onAction(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-list-item__icon.v-list-group__header__append-icon {
    display: none !important;
  }

  .v-list-group {
    .v-list-item--active {
      background: unset !important;
    }
  }
}
</style>
