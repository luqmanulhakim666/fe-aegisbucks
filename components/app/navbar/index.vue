<template>
  <div class="shadow-base app-navbar">
    <div class="app-navbar_wrapper mx-auto px-10 py-4">
      <div class="d-flex justify-space-between">
        <general-logo :max_width="200" />
        <v-menu class="profile" left offset-y nudge-top="-10">
          <template v-slot:activator="{ on, attrs }">
            <v-avatar size="44" dark v-bind="attrs" v-on="on">
              <img
                cover
                class="border-thin"
                :src="
                  profile.avatar_src
                    ? profile.avatar_src
                    : `${$config.API_URL}/file/0193df80-ee16-7774-bb9c-e0e1084cab49/file}`
                "
                alt="avatar"
                @error="onErrorImg"
              />
            </v-avatar>
          </template>

          <v-card class="profile__list rounded-xl" width="280">
            <div class="pa-4">
              <p class="h7--xxsmall dark--text mb-1">
                {{ profile.name }}
              </p>
              <p class="text--default dark--text">{{ profile.email }}</p>
            </div>
            <v-divider class="gray lighten-2" />
            <div class="pa-4">
              <div
                class="d-flex pointer align-center mb-8"
                @click="onDetailProfile(profile.employer_user_id)"
              >
                <v-icon size="16" class="mr-2 dark--text"> mdi-cog </v-icon>
                <p class="text--default">Pengaturan Akun</p>
              </div>
              <div
                class="d-flex align-center pointer error--text"
                @click="onLogout()"
              >
                <v-icon size="16" class="mr-2 error--text"> mdi-logout </v-icon>
                <p class="text--default">Keluar</p>
              </div>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { AVATAR } from "@/data/general";
export default {
  props: {
    logo: String,
    profile: Object,
  },
  mounted() {
    console.log(AVATAR);
  },
  methods: {
    onErrorImg(event) {
      event.target.src = `${this.$config.API_URL}/file/0193df80-ee16-7774-bb9c-e0e1084cab49/file`;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-navbar {
  &_wrapper {
    max-width: 961px;
  }
  &_logo {
    max-width: 300px;
    width: 100%;
    z-index: 0;
  }
}

.profile {
  &__list {
    box-shadow: 0px 10px 24px rgba(24, 39, 75, 0.08) !important;
  }
}
.v-menu__content {
  box-shadow: 0px 20px 23px rgba(65, 75, 58, 0.192) !important;
}
</style>
