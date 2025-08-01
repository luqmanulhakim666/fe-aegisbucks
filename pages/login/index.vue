<template>
  <div class="login fill-height d-flex flex-column justify-center align-center">
    <div
      class="login-form shadow-base pa-6 rounded-xl d-flex flex-column justify-center"
    >
      <general-logo class="d-flex mx-auto mb-10" :max_width="180" />

      <div>
        <div class="d-flex align-center mb-2">
          <span class="text-capitalize label-text h6--xsmall">
            Kode Referal

            <span
              class="text-capitalize label-text ml-1 info--text text--lighten-2 h6--xsmall"
            >
              (Opsional)
            </span>
          </span>
        </div>

        <v-text-field
          rounded
          v-model.trim="form.referalCode"
          class="border-thin"
          dense
          :disabled="state.isUsedReveralCode"
          hide-details
          v-bind="$attrs"
          v-on="$listeners"
          placeholder="Kode Referal"
        >
          <template v-slot:append>
            <v-btn
              @click="hanleReferalCode"
              :loading="state.isLoading"
              x-small
              :disabled="!form.referalCode"
              depressed
              class="primary lighten-1 rounded-pill h7--xxsmall text-capitalize my-2"
            >
              {{ !state.isUsedReveralCode ? "Gunakan" : "Ubah" }}
            </v-btn>
          </template>
        </v-text-field>
      </div>

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
      description:
        "Unlocking Audience Insights, Empowering Conversions: LetsBuyAsia's Data-Driven Tracking Solutions",
    },
    form: {
      email: "",
      password: "",
      referalCode: "",
    },
    state: {
      isValid: true,
      isLoading: false,
      isUsedReveralCode: false,
    },
  }),

  methods: {
    async hanleReferalCode() {
      this.state.isUsedReveralCode = !this.state.isUsedReveralCode;
      if (this.state.isUsedReveralCode) {
        return localStorage.setItem("referalCode", this.form.referalCode);
      }

      localStorage.removeItem("referalCode");
    },
  },

  beforeDestroy() {
    this.form.referalCode = "";
  },
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
.text-field__prepend {
  width: 61px;
}

.v-input--is-disabled {
  background-color: var(--v-gray-lighten3) !important;
}

::v-deep {
  .v-input__append-inner {
    margin: auto !important;
  }
}
</style>
