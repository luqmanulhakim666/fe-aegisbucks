<template>
  <v-dialog v-model="dialog" persistent width="300">
    <div class="white rounded-xl">
      <general-card-dialog-header
        name="Merchant Category"
        @close="onEmitClose()"
      />

      <div class="pa-6">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model="form.name"
            bold
            required
            label="Name"
            outlined
            :rules="[required]"
          />
        </v-form>

        <v-btn
          depressed
          block
          class="secondary text-capitalize h7--xxsmall"
          :loading="state.isLoading"
          @click="onSubmit()"
          >Submit</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    dialog: Boolean,
    form: Object,
  },

  data: () => ({
    state: {
      isValid: true,
      isLoading: false,
    },
  }),

  methods: {
    onEmitClose() {
      this.$refs.form.reset();
      this.$emit("on:close");
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (valid) {
        this.state.isLoading = true;

        const payload = {
          name: this.form.name,
        };

        let res = !this.form?.id
          ? await this.$api.merchants.category.create(payload)
          : await this.$api.merchants.category.update(this.form.id, payload);

        if (res.success) {
          this.setSuccessAlert("Data has been saved");
          this.$emit("on:fetch");
          this.onEmitClose();
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      this.state.isLoading = false;
    },
  },
};
</script>
