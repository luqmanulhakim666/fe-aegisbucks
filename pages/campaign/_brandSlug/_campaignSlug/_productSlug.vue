<template>
  <div class="product container">
    <general-loading v-if="state.loadingRecaptcha" />
    <div class="white pa-6 rounded-xl">
      <v-img
        class="mx-auto border-thin"
        width="200"
        height="200"
        :src="getImage(product.product.image)"
      />

      <div class="d-flex flex-column justify-center align-center">
        <p class="product-promo_label text-center h7--xxsmall mt-2 mb-4">
          {{ product.promoLabel }}
        </p>

        <p class="text--default dark--text text--lighten-1">Jumlah Voucher</p>
        <div class="d-flex align-center my-4">
          <v-btn
            v-if="product.limitClaim > 1"
            x-small
            :style="`background:${campaign.primaryColor};color:${campaign.primaryColor}`"
            icon
            @click="handleQuantity('decrease')"
            ><v-icon color="white">mdi-minus</v-icon></v-btn
          >
          <p
            :style="`border:1px solid ${campaign.primaryColor}`"
            class="py-2 px-4 rounded-xl h6--xsmall mx-4"
          >
            {{ decimal(state.qty) }}
          </p>
          <v-btn
            v-if="product.limitClaim > 1"
            :style="`background:${campaign.primaryColor};color:${campaign.primaryColor}`"
            x-small
            icon
            @click="handleQuantity('increase')"
            ><v-icon color="white">mdi-plus</v-icon></v-btn
          >
        </div>
      </div>

      <v-form v-model="state.isValid" ref="form">
        <!-- Term and Conditions -->
        <!-- <campaign-accordion
              class="mt-6"
              :termAndConditions="campaign.termCondition"
            /> -->

        <div
          v-for="(item, index) in campaign.additionalInformation"
          :key="index"
        >
          <campaign-accordion
            class="mt-6"
            :termAndConditions="item.content"
            :label="item.label"
          />
        </div>

        <!-- Retail Partners -->
        <campaign-retail-partners
          class="mb-4"
          :retailPartners="handleStores"
          :isRetailType="isRetailType"
          :form="form"
          @on:select="onSelectRetailPartner"
        />

        <template v-if="hasFormInput">
          <p class="text-center h5--small mb-4">
            {{ handleInstruction }}
          </p>
          <!-- FORM SECTION -->
          <campaign-form :fields="form.userInputs" />
          <!-- END FORM SECTIOn -->
        </template>
      </v-form>

      <v-card v-if="!captchaVerified" class="pa-2 mb-4" outlined>
        <div class="d-flex justify-space-between align-center">
          <v-checkbox label="I am not a robot" @click="onVerifyCaptcha()" />
          <v-img max-width="50" src="/images/recaptcha.png" />
        </div>
      </v-card>

      <div v-if="campaign.loginGmail">
        <v-card flat :disabled="!captchaVerified" v-if="!isAuthenticated">
          <general-google-login :campaignId="campaign.id" :form="form" />
        </v-card>

        <div v-else>
          <div
            class="d-flex rounded-xl py-3 justify-center grey lighten-3 mb-2"
          >
            <v-icon class="mr-2">mdi-email</v-icon>
            <p class="h7--xxsmall">{{ profile.email }}</p>
          </div>
          <v-btn
            block
            large
            depressed
            class="text-capitalize h6--xsmall get_voucher-btn"
            @click="onSubmit()"
            :loading="state.isLoading"
            :style="`background:${campaign.primaryColor};color:${campaign.primaryColor}`"
          >
            Dapatkan Voucher Sekarang
          </v-btn>
        </div>
      </div>

      <v-btn
        v-if="!campaign.loginGmail"
        block
        large
        depressed
        class="text-capitalize h6--xsmall get_voucher-btn"
        @click="onSubmit()"
        :loading="state.isLoading"
        :style="`background:${campaign.primaryColor};color:${campaign.primaryColor}`"
      >
        Dapatkan Voucher Sekarang
      </v-btn>
    </div>

    <v-dialog width="500" v-model="state.isDialog">
      <div
        class="white pa-6 rounded-xl d-flex flex-column align-center justify-center"
      >
        <v-icon size="62" color="error">mdi-close-octagon</v-icon>
        <h5 class="text-center h5--small dark--text text-lighten-4 mt-8">
          Email Business tidak diizinkan
        </h5>
        <h5 class="text-center h5--small dark--text text-lighten-4">
          Harap login dengan akun @gmail.com
        </h5>

        <v-btn
          @click="onCloseDialog()"
          block
          depressed
          class="mt-8 primary text-capitalize h7--xxsmall"
          >Tutup</v-btn
        >
      </div>
    </v-dialog>

    <!-- IG MESSAGE -->
    <v-dialog width="500" v-model="state.dialogMessage">
      <div
        class="white pa-6 rounded-xl d-flex flex-column align-center justify-center"
      >
        <v-img width="200" src="/images/empty.svg"></v-img>
        <h5 class="text-center h5--small dark--text text-lighten-4 mt-8">
          Maaf voucher habis
        </h5>

        <p class="text--default mt-4">
          kirim pesan dibawah ini untuk mendapatkan voucher baru
        </p>

        <v-card class="dark lighten-3 mt-2 pa-2 rounded-xl" flat>
          <p class="h7--xxsmall dark--text">"{{ getMessageInstagram }}"</p>
        </v-card>

        <v-list-item @click="copyLink">
          <v-list-item-content class="text--default">
            <div class="d-flex align-center">
              <v-icon small class="mr-2">mdi-content-copy</v-icon>
              Salin
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-btn
          @click="goToInstagramMessage()"
          block
          depressed
          class="mt-8 primary text-capitalize h7--xxsmall"
          >Dapatkan Voucher Baru</v-btn
        >
      </div>
    </v-dialog>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import rules from "@/mixins/rules";
import tracking from "@/mixins/tracking";
import meta from "@/mixins/meta";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  async asyncData({ store, route }) {
    let campaign = null;
    let product = null;

    const res = await store.dispatch("campaign/getDetailProductPublic", {
      brandSlug: route.params?.brandSlug,
      campaignSlug: route.params?.campaignSlug,
      productSlug: route.params?.productSlug,
      preview: route.query.__preview,
    });

    if (res.success) {
      campaign = res.data;
      product = res.data.campaignProduct;
    }

    return {
      campaign: campaign,
      product: product,
    };
  },

  mixins: [pipe, media, rules, tracking, meta],
  layout: "campaign",

  data: () => ({
    captchaVerified: false,
    meta: {
      title: "",
      image: "",
      description: "",
    },
    form: {
      campaignId: "",
      retailId: "",
      productId: "",
      name: "",
      email: "",
      googleId: "",
      phone: null,
      count: 1,
      userInputs: [],
    },
    state: {
      loadingRecaptcha: false,
      isLoading: false,
      isDialog: false,
      isValid: true,
      qty: 1,
      dialogMessage: false,
    },
  }),

  created() {
    if (this.product) {
      this.setUserInputs();
      this.meta.title = `Campaign ${this.campaign.brand.name} ${this.campaign.name} ${this.product.product.slug}`;
      this.meta.image = this.getImage(this.product.product);
      this.meta.description = this.campaign.slug;
      this.form.campaignId = this.campaign.id;
      this.form.productId = this.product.id;
    }
  },

  async mounted() {
    const isRecaptcha = Cookie.get("recaptcha");

    if (!isRecaptcha) {
      this.$recaptcha.init();
    }

    if (isRecaptcha) {
      this.captchaVerified = true;
    }

    const formLocalStorage =
      typeof this.formLocalStorage === "object"
        ? JSON.parse(localStorage.getItem("form"))
        : {};

    if (
      formLocalStorage?.productId === this.form?.productId &&
      formLocalStorage?.campaignId === this.form?.campaignId
    ) {
      this.form = formLocalStorage;
      this.state.qty = formLocalStorage.count;
    }

    await this.checkGoogleAuth();

    if (!this.isPreview) {
      this.trackEvent("View Campaign Product Detail", {
        campaignId: this.campaign.id,
        productId: this.product.id,
      });
    }

    if (this.$route.query?.success) {
      this.$vuetify?.goTo(`.get_voucher-btn`, { offset: 100 });
    }
  },

  computed: {
    isRetailType() {
      return this.campaign?.type === "retail";
    },

    handleStores() {
      if (this.isRetailType) {
        return this.campaign.retails;
      }

      return this.campaign?.merchantCategories;
    },
    getMessageInstagram() {
      return `Halo min, saya mau voucher ${this.campaign?.brand.name} ${this.campaign?.name} ${this.campaign?.campaignProduct?.product?.name}`;
    },

    handleInstruction() {
      let label = "Login dan dapatkan vouchernya";

      if (this.hasFormInput) {
        const type = this.form.userInputs?.map((x) => {
          return x?.type;
        });

        if (
          type?.includes("text") ||
          type?.includes("text_area") ||
          type?.includes("select") ||
          type?.includes("number")
        )
          label = "Isi data dan dapatkan vouchernya";
      }

      return label;
    },
    hasFormInput() {
      const form = this.form.userInputs;

      return form?.length > 0;
    },
  },

  methods: {
    copyLink() {
      const url = this.getMessageInstagram;
      navigator.clipboard.writeText(url).then(
        () => {
          this.$store.dispatch("snack", [
            "Link copied to clipboard!",
            "success lighten-2",
            "mdi-check-circle",
          ]);
        },
        (err) => {
          this.$store.dispatch("snack", [
            "Failed to copy link",
            "error",
            "mdi-close-circle",
          ]);
        }
      );
    },
    goToInstagramMessage() {
      window.location.href = "https://www.instagram.com/Aegisbucks";
    },
    async onVerifyCaptcha() {
      try {
        this.state.loadingRecaptcha = true;
        const token = await this.$recaptcha.execute("login");
        const res = await this.$api.auth.verifyCaptcha({
          token: token,
        });

        if (res.success) {
          Cookie.set("recaptcha", true, { expires: 1 });
          this.captchaVerified = true;
        }
      } catch (error) {
      } finally {
        this.state.loadingRecaptcha = false;
      }
    },
    setUserInputs() {
      this.form.userInputs = JSON.parse(JSON.stringify(this.product?.inputs));
    },

    handleGoogleLogin(token) {
      this.$store.dispatch("auth/setGoogleToken", token);
    },

    onSelectRetailPartner(id) {
      this.form.retailId = id;
    },

    handleQuantity(key) {
      if (key === "increase" && this.product.limitClaim > this.state.qty) {
        this.state.qty += 1;
      }

      if (key === "decrease" && this.state.qty > 1) {
        this.state.qty -= 1;
      }

      this.form.count = this.state.qty;
    },

    onCloseDialog() {
      const Cookie = process.client ? require("js-cookie") : undefined;

      if (process.client) {
        Cookie.remove("googleToken");
        Cookie.remove("googleProfile");
      }

      window.location.reload();
    },

    async onSubmit() {
      if (!this.profile?.email?.includes("@gmail.com")) {
        this.state.isDialog = true;

        return;
      }

      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.state.isLoading = true;

      const query = this.$route?.query;

      const payload = {
        campaignId: this.campaign.id,
        retailId: this.form.retailId,
        productId: this.product?.productId,
        // name: this.profile.name,
        // email: this.profile.email,
        // googleId: this.profile.googleId,
        // phone: this.profile?.phone
        //   ? this.profile?.phone
        //   : "081" + this.profile.googleId,
        count: this.form.count,
        userInputs: this.form.userInputs?.map((x) => {
          let finalValue = x.defaultValue;

          if (x.type === "checkbox" && x.options?.length === 1) {
            finalValue = x.options?.map((y) => {
              return y?.value[0];
            });
          }

          if (x.type === "checkbox" && x.options?.length > 1) {
            finalValue = x.defaultValue?.map((y) => {
              return y;
            });
          }
          return {
            inputId: x.id,
            value: finalValue,
          };
        }),
        url: window.location.href,
      };

      if (this.campaign.type === "merchant") {
        delete payload.retailId;

        payload["merchantCategoryId"] = this.form.retailId;
      }

      const res = await this.$api.campaigns.claimVoucher(payload);

      if (res.success) {
        this.trackEvent("Click Claim Voucher", {
          campaignId: payload.campaignId,
          productId: payload.productId,
          userInputs: payload.userInputs,
          count: payload.count,
        });

        if (localStorage.getItem("form")) {
          localStorage.removeItem("form");
        }

        this.$router.push({
          path: `/campaign/${res.data.brand?.slug}/${res.data?.campaign?.id}/${res.data?.groupId}/success`,
          query: query,
        });
      }

      if (!res.success) {
        this.setFailedAlert(res);

        if (res.error.message === "Mohon maaf voucher sudah habis") {
          console.log(res);
          this.state.dialogMessage = true;
        }
      }

      this.state.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.product {
  &-promo_label {
    white-space: pre-line;
  }
}
</style>
