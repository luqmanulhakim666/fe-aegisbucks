<template>
  <div>
    <general-breadcrumbs :lists="items.breadcrumbs" class="mb-9" />

    <v-form v-model="state.isValid" ref="form">
      <form-users :form="form" :roles="items.roles" :isCreated="isCreated" />
    </v-form>

    <div class="d-flex justify-end mt-8">
      <v-btn
        class="primary-create-btn text-capitalize h7--xxsmall"
        depressed
        :loading="state.isLoading.cancel"
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
import { ROLES } from "@/data/general";
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },
  data: () => ({
    meta: {
      title: "",
    },

    form: {
      name: "",
      email: "",
      password: "",
      active: true,
      role: "",
    },

    items: {
      breadcrumbs: [
        { text: "Users", slug: "/admin/users" },
        { text: "Create New User", slug: "" },
      ],
      roles: ROLES,
    },

    state: {
      isValid: true,
      isLoading: {
        submit: false,
        cancel: false,
      },
    },
  }),

  created() {
    this.meta.title = this.isCreated ? "Create New User" : "Edit user";

    if (!this.isCreated) {
      this.getOne();
    }
  },

  mounted() {
    this.$store.commit("SET_META", { title: "User", child: true });
  },

  methods: {
    async getOne() {
      this.items.breadcrumbs[1].text = "Edit User";
      const id = this.$route?.params?.slug;

      const res = await this.$api.users.getOne(id);

      if (res.success) {
        this.form = res.data;
        this.form["phone"] = res.data?.phone?.replace("+62", "0");
      }
    },

    async onSubmit() {
      const valid = await this.state.isValid;
      await this.$refs.form.validate();

      if (valid) {
        this.state.isLoading.submit = true;

        let payload = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          active: true,
          role: this.form.role,
        };

        const res = this.isCreated
          ? await this.$api.users.create(payload)
          : await this.$api.users.update(this.form.id, payload);

        if (res.success) {
          this.setSuccessAlert("Data has been saved");
          this.$router.push("/admin/users");
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }

        this.state.isLoading.submit = false;
      }
    },

    goBack() {
      this.state.isLoading.cancel = true;

      this.$router.push("/admin/users");
    },
  },

  computed: {
    isCreated() {
      return this.$route?.params?.slug === "create";
    },
  },
};
</script>
