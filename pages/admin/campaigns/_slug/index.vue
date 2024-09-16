<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      accept="image/*"
      @change="onFilePicked"
    />
    <general-breadcrumbs :lists="items.breadcrumbs" class="mb-9" />

    <v-form v-model="state.isValid" ref="form">
      <form-users
        :form="form"
        :roles="items.roles"
        :progress="mixins.state.progress"
        :uploadLoading="mixins.state.isLoading"
        :avatarUrl="getAvatar"
        :isCreated="isCreated"
        @on:upload="onOpenFile"
      />
    </v-form>

    <div class="d-flex justify-end mt-8">
      <v-btn
        class="primary-create-btn text-capitalize h7--xxsmall"
        depressed
        :loading="state.isLoading.cancle"
        @click="goBack()"
      >
        Batal
      </v-btn>
      <v-btn
        class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
        depressed
        :loading="state.isLoading.submit"
        @click="onSubmit()"
      >
        Simpan
      </v-btn>
    </div>
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import alert from "@/mixins/alert";
import media from "@/mixins/media";

export default {
  mixins: [meta, alert, media],
  // middleware: ["authenticated", "authorized"],
  // meta: {
  //   page: ["admin"],
  //   permission: ["super_admin"],
  // },
  data: () => ({
    meta: {
      title: "",
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

    items: {
      breadcrumbs: [
        { text: "Pengguna", slug: "/admin/users" },
        { text: "Buat Pengguna Baru", slug: "" },
      ],
    },

    state: {
      isValid: true,
      isLoading: {
        submit: false,
        cancle: false,
      },
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Buat Pengguna Baru" : "Edit Pengguna";

    if (!this.isCreated) {
      // this.getOne();
    }
  },

  mounted() {
    this.$store.commit("SET_META", { title: "Pengguna", child: true });
  },

  methods: {
    async getOne() {
      this.items.breadcrumbs[1].text = "Edit Pengguna";
      const id = this.$route?.params?.slug;

      const res = await this.$api.users.getOne(id);

      if (res.success) {
        this.form = res.data;
        this.form["phone"] = res.data?.phone?.replace("+62", "0");
      }
    },

    async onSubmit() {
      await this.$refs.form.validate();
      if (!this.state.isValid) {
        this.$vuetify.goTo(`.v-messages__message`, { offset: 100 });
        return;
      }

      this.onSave();
    },

    async onSave() {
      this.state.isLoading.submit = true;
      this.form.image = this.form?.image?.id;
      this.form.signature = this.form?.signature?.id;
      this.form.nip = this.form.nip || null;

      let payload = {
        ...this.form,
      };

      if (!this.isCreated) {
        delete payload["password"];
      }

      let res = "";

      if (this.isCreated) {
        res = await this.$api.users.create(payload);
      }

      if (!this.isCreated) {
        res = await this.$api.users.update(this.form.id, payload);
      }

      if (res.success) {
        this.setSuccessAlert(
          `Berhasil ${this.isCreated ? "membuat" : "mengubah"} user`
        );
        this.goBack();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading.submit = false;
    },

    goBack() {
      this.state.isLoading.cancle = true;

      this.$router.go(-1);
    },
  },

  computed: {
    isCreated() {
      return this.$route?.params?.slug === "add-user";
    },
    getAvatar() {
      return this.mixins.state?.media?.id
        ? this.mixins.state?.media?.url
        : this.form?.image?.url;
    },
  },
  watch: {
    "mixins.state.media"(val) {
      this.form.image = val;
    },
  },
};
</script>
