<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white">
      <general-card-dialog-header name="Buat Form" @close="onEmitClose()" />
      <div class="pa-6">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model="form.name"
            outlined
            bold
            required
            label="Nama Form"
            :rules="[required]"
          />

          <div>
            <p class="h6--xsmall dark--text">Target</p>
            <v-radio-group row v-model="form.type">
              <v-radio
                :ripple="false"
                v-for="(item, index) in items.target"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </v-radio-group>
          </div>
        </v-form>
        <div class="d-flex justify-end">
          <v-btn
            class="secondary lighten-5 text-capitalize h7--xxsmall"
            depressed
            :loading="state.isLoading"
            @click="onSubmit()"
          >
            Lanjut
            <v-icon small class="ml-2">mdi-arrow-right</v-icon>
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
    item: Object,
  },

  data: () => ({
    form: {
      name: "",
      type: "incubator_form",
    },
    items: {
      target: [
        { key: "incubator_form", label: "Form Inkubator" },
        { key: "tenant_form", label: "Form Tenant" },
      ],
    },
    state: {
      isValid: true,
      isLoading: false,
    },
  }),

  methods: {
    async onSubmit() {
      let valid = await this.validate(this.state.isValid);

      if (valid) {
        this.onSave();
      }
    },

    async onSave() {
      this.state.isLoading = true;
      let payload = {
        name: this.form.name,
        type: this.form.type,
        pages: [],
      };
      const res = await this.$api.dynamicForm.create(payload);

      if (res.success) {
        this.$router.push(`/admin/form-tools/${res?.data?.id}`);
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },
    onEmitClose() {
      this.$emit("on:close");
    },
  },
};
</script>
