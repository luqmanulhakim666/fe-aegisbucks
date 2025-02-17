<template>
  <div class="shadow-base app-navbar">
    <div class="app-navbar_wrapper mx-auto px-10 py-4">
      <div class="d-flex justify-space-between">
        <div class="pointer" @click="goHome()">
          <general-logo :max_width="200" />
        </div>

        <v-avatar size="44" dark class="pointer" @click="goToProfile()">
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

  methods: {
    goHome() {
      this.$router.push("/");
    },

    goToProfile() {
      this.$router.push("/profile");
    },

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
