<template>
  <v-app-bar fixed app class="app-bar primary px-sm-7 px-2" flat>
    <v-icon
      size="18"
      class="mr-5 pointer white--text"
      @click="onGoBack()"
      v-if="meta.child"
    >
      mdi-arrow-left
    </v-icon>
    <v-toolbar-title class="h4--default text-capitalize white--text">
      {{ meta.title }}
    </v-toolbar-title>
    <v-spacer />

    <div>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center" v-bind="attrs" v-on="on">
            <p class="h7--xxsmall white--text">{{ profile.name }}</p>
            <v-icon size="26" color="white">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-list>
          <v-list-item @click="$router.push(`/users/${profile.id}`)">
            <v-list-item-title class="text--default d-flex align-center">
              <v-icon size="16" class="mr-2">mdi-account</v-icon>
              Profile</v-list-item-title
            >
          </v-list-item>
          <!-- <v-list-item @click="$router.push(`/change-password`)">
            <v-list-item-title class="text--default d-flex align-center">
              <v-icon size="16" class="mr-2">mdi-lock</v-icon>
              Change Passowrd</v-list-item-title
            >
          </v-list-item> -->
          <v-list-item @click="$store.dispatch('auth/logout')">
            <v-list-item-title
              class="text--default d-flex align-center error--text"
            >
              <v-icon color="error" size="16" class="mr-2">mdi-logout</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!-- <general-drawer-sidebar /> -->
    <v-btn
      @click="onEmitShowSidebar"
      depressed
      fab
      size="24"
      class="hidden-lg-and-up transparent"
    >
      <v-icon size="36" color="#757575">mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    meta() {
      return this.$store.state.meta;
    },
    profile() {
      return this.$store.getters["auth/profile"];
    },
  },

  methods: {
    onGoBack() {
      this.$router.go(-1);
    },

    onEmitShowSidebar() {
      this.$emit("on:show-sidebar");
    },
  },
};
</script>

<style lang="scss" scoped>
.app-bar {
}
</style>
