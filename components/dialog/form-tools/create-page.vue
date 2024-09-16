<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div class="white rounded-xl">
      <general-card-dialog-header
        name="Tambah Halaman Baru"
        @close="onEmitClose()"
      />
      <div class="pa-4">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model="form.pageName"
            label="Nama Halaman"
            outlined
            bold
            :rules="[required]"
          />
        </v-form>

        <div class="d-flex justify-end">
          <v-btn
            class="secondary lighten-5 text--large text-capitalize px-10"
            depressed
            :loading="loading"
            @click="onSave()"
          >
            Simpan
          </v-btn>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    loading: Boolean,
  },

  data: () => ({
    state: {
      isValid: true,
    },
    form: {
      pageName: "",
    },
  }),

  methods: {
    async onSave() {
      let valid = await this.validate(this.state.isValid);

      if (valid) {
        this.$emit("on:submit", this.form.pageName);
      }
    },

    onEmitClose() {
      this.$refs.form.reset();
      this.$emit("on:close");
      this.form.pageName = "";
    },
  },
};
</script>
