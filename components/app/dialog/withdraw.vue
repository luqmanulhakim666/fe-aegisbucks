<template>
  <v-dialog width="500" v-model="isDialog" persistent>
    <div class="white rounded-xl">
      <div class="d-flex success lighten-1 rounded-t-xl">
        <div class="d-flex align-center py-3 ml-10">
          <v-icon size="42" outline color="">mdi-bank-circle-outline</v-icon>
          <h5 class="text-center h5--small ml-3 dark--text text-lighten-4">
            Withdraw
          </h5>
        </div>
      </div>

      <div class="container">
        <v-form v-model="isValid" ref="form">
          <general-form-autocomplete
            v-model="form.bankCode"
            :items="banks"
            required
            bold
            outlined
            label="Bank Tujuan"
            item-text="name"
            item-value="code"
            :rules="[required]"
          />

          <general-form-text-field
            v-model="form.bankAccoutnNo"
            required
            bold
            outlined
            label="No. Rekening"
            @keypress="onDigits"
            :rules="[required, number]"
          />

          <general-form-text-field
            v-model="form.name"
            required
            bold
            outlined
            label="Nama Pemilik Rekening"
            :rules="[required]"
          />

          <general-form-text-field
            v-model="form.amount"
            required
            bold
            outlined
            label="Jumlah"
            :maxLength="10"
            @keypress="onDigits"
            :rules="[required, minimumAmount, numberOnly]"
          />

          <general-form-text-area
            v-model="form.note"
            required
            bold
            outlined
            label="Catatan"
            :rules="[required]"
          />
        </v-form>

        <v-row class="d-flex justify-space-between" dense>
          <v-col cols="12" sm="6" order="2">
            <v-btn
              @click="onEmitClose()"
              depressed
              :disabled="isLoading"
              outlined
              class="text-capitalize h7--xxsmall full-width"
              >Batal</v-btn
            >
          </v-col>

          <v-col cols="12" sm="6" order-sm="2">
            <v-btn
              @click="onSubmit()"
              depressed
              :loading="isLoading"
              class="success lighten-1 success--text text-capitalize h7--xxsmall full-width"
              >Submit</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import { BANKS } from "@/data/banks";
export default {
  mixins: [rules, utils],
  props: {
    isDialog: Boolean,
    form: Object,
    isLoading: Boolean,
  },

  data: () => ({
    isValid: true,
    banks: BANKS,
  }),

  computed: {
    numberOnly() {
      return (val) => {
        val = this.toInt(val);
        return /^[0-9]*$/.test(String(val)) || "Hanya menerima input angka";
      };
    },
    minimumAmount() {
      return (val) => {
        val = this.toInt(val);

        return val >= 50000 || "*Minimun Penarikan Rp 50.000";
      };
    },
  },

  methods: {
    onEmitClose() {
      this.$refs.form.reset();
      this.$emit("on:close");
    },

    async onSubmit() {
      const valid = await this.validate(this.isValid);

      if (!valid) {
        return;
      }

      this.form.amount = this.toInt(this.form.amount);
      await this.$emit("on:submit", this.form);
      this.onEmitClose();
    },
  },

  watch: {
    "form.amount"(val) {
      this.form.amount = this.decimal(val);
    },
  },
};
</script>
