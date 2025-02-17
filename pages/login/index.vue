<template>
  <div class="login fill-height d-flex flex-column justify-center align-center">
    <div
      class="login-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <general-logo class="d-flex mx-auto mb-10" :max_width="180" />

      <general-form-text-field
        v-model.trim="form.password"
        label="Kode Referal"
        optional
        placeholder="Kode Referal"
        appendButton
        appendName="Gunakan"
        outlined
        bold
      />
      <div class="d-flex align-center">
        <v-divider />
        <p class="p--small mb-4 text-center mt-4 mx-2">Continue with:</p>
        <v-divider />
      </div>

      <!-- <v-divider class="mb-4" /> -->

      <general-google-login class="mb-4" isApp />

      <!-- <div v-for="(item, index) in items" class="mb-4">
        <button
          class="login-social-media-btn border-thin d-flex justify-center full-width pa-3"
        >
          <div
            class="login-social-media-icon-wrapper d-flex justify-center align-center pa-2"
          >
            <v-icon size="26">{{ item.src }}</v-icon>
          </div>
          <span class="ml-6 dark--text">{{ item.label }} </span>
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import meta from "@/mixins/meta";
export default {
  mixins: [rules, meta],
  middleware: "userUnauthenticated",
  layout: "empty",
  data: () => ({
    items: [
      { label: "Facebook", src: "mdi-facebook" },
      { label: "Twitter", src: "mdi-twitter" },
      { label: "Line", src: "mdi-size-l" },
      { label: "Apple", src: "mdi-apple" },
    ],
    meta: {
      title: "Login",
    },
    form: {
      email: "",
      password: "",
      referalCode: "",
    },
    state: {
      isValid: true,
      isLoading: false,
    },
  }),
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  &-form {
    max-width: 350px;
    width: 100%;
  }

  &-social-media-btn {
    position: relative;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    font-family: Arial, sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  &-social-media-btn:hover {
    background-color: rgba(243, 243, 243, 0.747);
  }

  &-social-media-icon-wrapper {
    position: absolute;
    left: 3px;
    top: 3px;
    bottom: 3px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  &-social-media-icon {
    height: 20px;
    width: 20px;
  }

  &-social-media-login-btn span {
    font-weight: bold;
  }
}
</style>
