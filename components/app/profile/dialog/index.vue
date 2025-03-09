<template>
  <v-dialog v-model="dialog" width="350" persistent>
    <div class="white rounded-xl">
      <input
        class="d-none"
        ref="input"
        type="file"
        accept="image/*"
        @change="onFilePicked"
      />

      <general-card-dialog-header name="Edit Profile" @close="onEmitClose()" />

      <div class="pa-6">
        <v-form v-model="state.isValid" ref="form">
          <general-avatar
            class="d-flex mx-auto justify-center"
            :progress="mixins.state.progress"
            :loading="mixins.state.isLoading"
            :image="form.image"
          />

          <v-btn
            class="d-flex mx-auto mb-6 text-capitalize h7--xxsmall mt-4"
            @click="onOpenFile"
            small
            outlined
          >
            <v-icon small class="mr-2">mdi-camera</v-icon>
            Ubah Foto</v-btn
          >
          <general-form-text-field
            required
            v-model="item.name"
            label="Nama Lengkap"
            outlined
            bold
            :rules="[required]"
          />

          <general-form-text-field
            required
            v-model="item.phone"
            label="Nomor Whatsapp"
            outlined
            bold
            :rules="[required]"
            @keypress="onDigits"
          />

          <general-form-date-picker
            v-if="dialog"
            v-model="item.birthDate"
            :dateValue="item.birthDate"
            class="mr-2 mb-8"
            outlined
            required
            bold
            :max="maxDate"
            label="Date"
            :rules="[required]"
          />

          <general-form-select
            label="Pekerjaan"
            v-model="item.profession"
            required
            bold
            outlined
            :items="items.professions"
            :rules="[required]"
          />

          <general-form-select
            label="Pendapatan"
            v-model="item.income"
            required
            bold
            outlined
            :items="items.incomes"
            item-value="name"
            item-text="name"
            :rules="[required]"
          />

          <general-form-select
            label="Jenis Kelamin"
            v-model="item.gender"
            required
            bold
            outlined
            item-text="name"
            item-value="key"
            :items="items.genders"
            :rules="[required]"
          />

          <general-form-autocomplete
            label="Kota"
            bold
            required
            v-model="item.city"
            className="text-capitalize"
            outlined
            hide-details
            :items="items.regencies"
            item-text="name"
            return-object
            :loading="state.loadingRegencies"
            @keydown="onFetchRegencies"
          />
        </v-form>

        <v-btn
          depressed
          block
          class="mt-8 text-capitalize h7--xxsmall success lighten-1 dark--text"
          :loading="state.isLoading"
          @click="onSubmit()"
          >Simpan</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";
import media from "@/mixins/media";
import { PROFESSIONS, GENDERS, INCOMES } from "@/data/general";
import debounce from "lodash/debounce";

export default {
  mixins: [rules, utils, pipe, media],
  props: {
    dialog: Boolean,
    item: Object,
  },

  data: () => ({
    items: {
      professions: PROFESSIONS,
      regencies: [],
      genders: GENDERS,
      incomes: INCOMES,
    },
    state: {
      isLoading: false,
      isValid: true,
      loadingRegencies: false,
      showUpload: false,
    },
    form: {
      fetchRegencies: "",
      image: null,
    },
  }),

  computed: {
    maxDate() {
      let date = new Date();

      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    handleShowUpload() {
      this.state.showUpload = !this.state.showUpload;
    },

    onFetchRegencies: debounce(function (val) {
      const keyword = val.target._value;
      this.getRegencies(keyword);
    }, 500),

    async getRegencies(val) {
      this.state.loadingRegencies = true;
      let payload = {
        keyword: val,
        limit: 10,
        sort: "name",
      };

      let res = await this.$api.general.regencies(payload);

      if (res.success) {
        this.items.regencies = res.data.list;
      }

      this.state.loadingRegencies = false;
    },
    onEmitClose() {
      this.$emit("on:close");
    },
    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.state.isLoading = true;

      const payload = {
        name: this.item.name,
        phone: this.item.phone,
        birthDate: this.toISOString(this.item?.birthDate),
        gender: this.item.gender,
        cityId: this.item.city?.id,
        profession: this.item.profession,
        imageUrl: this.form.image,
        income: this.item.income,
      };

      const res = await this.$api.users.updateUserProfile(payload);

      if (res.success) {
        await this.$store.dispatch("auth/fetchProfile");
        this.$emit("fetch:point");

        this.onEmitClose();
        this.setSuccessAlert("Profile anda berhasil di perbaharui");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },
  },

  watch: {
    dialog(val) {
      if (val) {
        this.form.image = this.item.imageUrl;
        this.getRegencies(this.item?.city?.name || "");
        this.form.fetchRegencies = this.item.city;
        if (this.item.birthDate) {
          this.item.birthDate = this.$dayjs(this.item.birthDate).format(
            "YYYY-MM-DD"
          );
        }
      }
    },

    "mixins.state.media"(val) {
      this.form.image = this.getImage(val);
    },
  },
};
</script>
