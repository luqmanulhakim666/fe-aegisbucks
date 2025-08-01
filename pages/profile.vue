<template>
  <div class="container">
    <v-row dense>
      <v-col cols="12" md="3" sm="4" align-self="center">
        <general-avatar
          :image="profile.imageUrl"
          class="d-flex mx-auto flex-column justify-xs-center align-center d-sm-block mb-6 mb-sm-0"
        />
      </v-col>
      <v-col
        cols="12"
        md="9"
        sm="8"
        align-self="center"
        class="d-flex mx-auto flex-column justify-xs-center align-center d-sm-block"
      >
        <p class="h5--small dark--text">{{ profile.name }}</p>
        <p class="text--default dark--text">{{ profile.email }}</p>

        <div class="d-flex align-center mt-2">
          <v-btn
            rounded
            depressed
            small
            class="success text-capitalize h7--xxsmall mr-2"
            @click="dialogProfile()"
            >{{
              profile.isCompleteProfile ? "Ubah Profile" : "Lengkapi Profile"
            }}</v-btn
          >
          <app-point v-if="!profile.isCompleteProfile" :points="400" />
        </div>
      </v-col>
    </v-row>

    <template v-if="!profile.isCompleteProfile">
      <div class="d-flex align-center dark lighten-3 justify-center pa-2 mt-10">
        <v-icon size="34" color="primary lighten-2"
          >mdi-lightbulb-on-outline</v-icon
        >
        <p class="h6--xsmall dark--text ml-4">
          lengkapi profil untuk bisa mendapatkan lebih banyak reward dari
          LetsbuyAsia
        </p>
      </div>
    </template>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <div
          class="dark lighten-3 rounded-lg pa-6 fill-height pointer"
          @click="goToReward()"
        >
          <p class="ml-5 h6--xsmall">Saldo Reward</p>
          <app-point :points="state.totalPoints" />
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div
          class="dark lighten-3 rounded-lg pa-6 d-flex align-center fill-height"
        >
          <v-img max-width="20" src="/images/medals/silver.png" />
          <p class="ml-3 h6--xsmall">Silver Member</p>
        </div>
      </v-col>
    </v-row>

    <div class="pa-2 dark lighten-3 mt-8">
      <p class="h5--small dark--text">My Referral Code</p>
    </div>

    <div class="d-flex align-center pa-2 border-thin rounded-xl mt-2">
      <p class="h6--xsmall dark--text mr-2">{{ profile.code }}</p>
      <v-btn x-small icon @click="copyLink(profile.code)">
        <v-icon> mdi-content-copy </v-icon>
      </v-btn>
    </div>
    <div
      class="d-flex mt-2 align-center pointer"
      @click="onShowHowToUserReferral()"
    >
      <v-icon small class="mr-2">mdi-help-circle-outline</v-icon>
      <p class="text--default dark--text text-decoration-underline">
        Cara Menggunakan Kode Referral
      </p>
    </div>

    <div class="pa-2 dark lighten-3 mt-8">
      <p class="h5--small dark--text">Akun</p>
    </div>

    <p class="h7--xxsmall mt-4">Email</p>
    <p class="text--default primary--text mb-2" v-if="!profile.emailVerified">
      Akun belum terverifikasi
    </p>
    <div
      class="border-thin pa-3 d-flex align-center justify-space-between rounded-lg"
    >
      <p>{{ profile.email }}</p>

      <v-btn
        v-if="!profile.emailVerified"
        @click="onEmailVerify()"
        depressed
        small
        :loading="loading.verifyEmail"
        class="success lighten-1 text-capitalize h7--xxsmall dark--text rounded-pill"
      >
        Verifikasi
      </v-btn>

      <div class="d-flex align-center" v-if="profile.emailVerified">
        <v-icon color="success">mdi-check-circle</v-icon>
        <p class="text--default dark--text ml-1">Terverifikasi</p>
      </div>
    </div>

    <div class="pa-2 dark lighten-3 my-4">
      <p class="h5--small dark--text">Lainnya</p>
    </div>

    <div v-for="(item, index) in items" :key="index" @click="onAction(item)">
      <div class="d-flex align-center mb-6">
        <v-icon size="20" class="mr-3 dark--text">{{ item.icon }}</v-icon>
        <p class="text-default hover-underline">{{ item.label }}</p>
      </div>
    </div>
    <div class="d-flex align-center mb-6 pointer" @click="onLogout()">
      <v-icon size="20" class="mr-3 error--text"> mdi-logout</v-icon>
      <p class="text-default error--text">Logout</p>
    </div>

    <app-dialog-how-to-use-referral-code
      @copy:referral="copyLink(profile.code)"
      @on:close="onShowHowToUserReferral"
      :isDialog="state.isDialogHowToUseReferral"
    />

    <app-profile-dialog
      :dialog="state.isDialog"
      :item="editProfile"
      @fetch:point="getTotalPoint()"
      @on:close="dialogProfile"
    />
  </div>
</template>

<script>
import utils from "@/mixins/utils";
import meta from "@/mixins/meta";

export default {
  layout: "app",
  middleware: "userAuthenticated",
  mixins: [utils, meta],
  data: () => ({
    meta: {
      title: "Profile",
    },
    hasSentEmail: false,
    editProfile: {},
    state: {
      isDialog: false,
      isDialogHowToUseReferral: false,
      totalPoints: 0,
    },
    loading: {
      verifyEmail: false,

      submit: false,
      point: false,
    },
    items: [
      {
        label: "Hubungi Help Center (WhatsApp)",
        key: "whatsapp",
        icon: "mdi-whatsapp",
        value: "https://wa.me/6285215845379",
      },
      {
        label: "Hubungi Help Center (Instagram)",
        key: "instagram",
        icon: "mdi-face-agent",
        value: "https://instagram.com/letsbuyasia",
      },
      {
        label: "Kebijakan Privasi",
        key: "whatsapp",
        icon: "mdi-security",
      },
      {
        label: "Syarat dan Ketentuan",
        key: "whatsapp",
        icon: "mdi-file-document-outline",
      },
    ],
  }),

  created() {
    this.getTotalPoint();
  },

  computed: {
    profile() {
      return this.$store.getters["auth/profile"];
    },
    seconds() {
      return this.$dayjs(this.timer).format("ss");
    },
  },

  methods: {
    onShowHowToUserReferral() {
      this.state.isDialogHowToUseReferral =
        !this.state.isDialogHowToUseReferral;
    },
    copyLink(code) {
      navigator.clipboard.writeText(code).then(
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
    onAction(val) {
      if (val.key === "whatsapp") {
        const phoneNumber = "6285215845379";
        const url = `https://wa.me/${phoneNumber}`;

        // First, try window.open for other browsers
        const newTab = window.open(url, "_blank");

        // If window.open is blocked, fallback to location.href
        if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
          window.location.href = url; // This will navigate the current tab
        }
      }

      if (val.key === "instagram") {
        const url = val.value;

        // First, try window.open for other browsers
        const newTab = window.open(url, "_blank");

        // If window.open is blocked, fallback to location.href
        if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
          window.location.href = url; // This will navigate the current tab
        }
      }
    },

    goToReward() {
      this.$router.push("/my-rewards");
    },
    onLogout() {
      this.$store.dispatch("auth/logout");
    },

    async getTotalPoint() {
      this.loading.point = false;
      const res = await this.$api.users.point.total();

      if (res.success) {
        this.state.totalPoints = res.data?.total;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
      this.loading.point = true;
    },

    async dialogProfile() {
      this.editProfile = await JSON.parse(JSON.stringify(this.profile));
      this.state.isDialog = !this.state.isDialog;
    },

    async onEmailVerify() {
      this.loading.verifyEmail = true;

      if (this.hasSentEmail) {
        this.setFailedAlert({ message: "Verifikasi Email Sudah Dikirim" });
        this.loading.verifyEmail = false;
        return;
      }

      const res = await this.$api.auth.sendVerifyEmail();

      if (!this.hasSentEmail) {
        if (res.success) {
          this.hasSentEmail = true;
          this.setSuccessAlert("Verifikasi Email Terkirim");
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      this.loading.verifyEmail = false;
    },
  },
};
</script>
