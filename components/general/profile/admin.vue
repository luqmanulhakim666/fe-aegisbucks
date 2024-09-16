<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      accept="image/*"
      @change="onFilePicked"
    />

    <v-row>
      <v-col cols="12" sm="12">
        <div
          class="pa-6 white rounded-xl d-sm-flex flex-sm-row justify-sm-start d-flex flex-column align-center justify-center"
        >
          <general-avatar :image="getAvatar" />

          <div class="ml-6">
            <h1 class="h1--xxlarge text-center text-sm-left">
              {{ profile.name }}
            </h1>
            <h4
              class="h4--default dark--text text--lighten-5 my-4 text-center text-sm-left"
            >
              {{ profile.email }}
            </h4>
            <h4
              class="h4--default dark--text text--lighten-5 text-center text-sm-left"
            >
              {{ humanizeRole(role) }}
            </h4>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="pa-6 white rounded-xl">
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="h3--large">Informasi Pribadi</h3>
            <v-btn
              class="text-capitalize text--default primary-create-btn"
              depressed
              x-small
              @click="handleDialog()"
            >
              <v-icon x-small class="mr-2">mdi-pencil</v-icon>
              Ubah</v-btn
            >
          </div>

          <v-row>
            <v-col cols="12" sm="3">
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Nama</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.name }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Email</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.email }}
                </p>
              </div>

              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">NRK / NIP</p>
                <p class="h6--xsmall dark--text">
                  {{ profile.nip }}
                </p>
              </div>
            </v-col>

            <v-col cols="12" sm="3" offset="1">
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Nomor Handphone
                </p>
                <p class="h6--xsmall dark--text">
                  {{ profile.phone }}
                </p>
              </div>
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">Role</p>
                <p class="h6--xsmall dark--text">
                  {{ humanizeRole(role) }}
                </p>
              </div>
            </v-col>

            <v-col cols="12" sm="3" offset="1">
              <div class="mb-4">
                <p class="h6--xsmall dark--text text--lighten-5">
                  Tanda Tangan
                </p>
                <v-img max-width="150" :src="getSignature" />
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="pa-6 white rounded-xl">
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="h3--large">Ubah Kata Sandi</h3>
            <v-btn
              class="text-capitalize text--default primary-create-btn"
              depressed
              x-small
              @click="handleDialogChangePassword()"
            >
              <v-icon x-small class="mr-2">mdi-pencil</v-icon>
              Ubah</v-btn
            >
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">
              Kata Sandi Sekarang
            </p>
            <p class="h6--xsmall dark--text">********</p>
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">Kata Sandi Baru</p>
            <p class="h6--xsmall dark--text">********</p>
          </div>

          <div class="mb-4">
            <p class="h6--xsmall dark--text text--lighten-5">
              Konfirmasi Kata Sandi
            </p>
            <p class="h6--xsmall dark--text">********</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <general-dialog-profile-admin
      :form="form"
      :role="role"
      :dialog="state.isDialog"
      :loading="state.isLoading"
      :progress="mixins.state.progress"
      :uploadLoading="mixins.state.isLoading"
      :avatarUrl="getAvatar"
      @on:upload="onOpenFile"
      @on:close="handleDialog"
      @on:submit="onSubmit"
    />

    <general-dialog-change-password
      :form="auth"
      :dialog="state.isDialogPassword"
      :loading="state.isLoading"
      @on:close="handleDialogChangePassword"
      @on:submit="onChangePassword"
    />
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  data: () => ({
    meta: {
      title: "Profile",
    },
    state: {
      isLoading: false,
      isDialog: false,
      isDialogPassword: false,
    },
    form: {
      name: "",
      email: "",
      phone: "",
      password: "",
      permission: "",
      nip: "",
      image: {},
      signature: {},
    },
    auth: {
      oldPassword: "",
      newPassword: "",
      confirm_password: " ",
    },
  }),

  created() {
    this.setMeta(this.meta.title, false);
    this.form = { ...this.profile };
  },

  computed: {
    getSignature() {
      return this.profile?.signature?.url || "";
    },

    profile() {
      return this.$store.getters["auth/profile"];
    },

    role() {
      let permission = this.$store.getters["auth/permission"]?.toLowerCase();

      if (permission) {
        return permission?.charAt(0)?.toUpperCase() + permission?.slice(1);
      }
    },

    getAvatar() {
      return this.mixins.state?.media?.id
        ? this.mixins.state?.media
        : this.profile?.image;
    },
  },

  methods: {
    async onSubmit() {
      this.state.isLoading = true;

      let payload = {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        permission: this.form.permission,
        nip: this.form.nip || null,
        image: this.mixins.state?.media?.id
          ? this.mixins.state?.media?.id
          : this.profile?.image?.id,
        signature: this.form?.signature?.id,
      };

      let res = await this.$api.auth.updateProfile.admin(payload);

      if (res.success) {
        this.$store.dispatch("auth/fetchProfile");
        // let item = {
        //   ...this.profile,
        //   name: this.form.name,
        //   email: this.form.email,
        //   phone: this.form.phone,
        //   permission: this.form.permission,
        //   nip: this.form.nip,
        //   image: this.mixins.state?.media?.url
        //     ? this.mixins.state?.media?.url
        //     : this.profile?.image?.url,
        //   signature: this.form?.signature?.url
        // }

        // this.$store.commit('auth/SET_PROFILE', item)
        this.setSuccessAlert("Berhasil memperbaharui profile");
        this.state.isDialog = false;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
      this.state.isLoading = false;
    },

    async onChangePassword() {
      this.state.isLoading = true;

      let payload = {
        ...this.auth,
      };
      delete payload.confirm_password;
      let res = await this.$api.auth.changePassword(payload);

      if (res.success) {
        this.setSuccessAlert("Berhasil merubah password");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
      this.handleDialogChangePassword();
    },

    handleDialog() {
      this.mixins.state.media = [];
      this.state.isDialog = !this.state.isDialog;
    },

    handleDialogChangePassword() {
      this.state.isDialogPassword = !this.state.isDialogPassword;
      this.auth.newPassword = "";
      this.auth.oldPassword = "";
      this.auth.confirm_password = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.conainer {
  padding: 0 !important;
}
</style>
