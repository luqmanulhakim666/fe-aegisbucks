<template>
  <div>
    <input
      class="d-none"
      ref="input"
      type="file"
      :accept="handleAcceptFiles(field['acceptFiles'])"
      @change="onFilePicked"
    />

    <div class="d-flex align-center mb-2">
      <span
        class="text-capitalize label-text"
        v-if="label"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        {{ label }}
        <span
          class="text-capitalize label-text ml-1 error--text"
          v-if="required"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          *
        </span>
        <span
          class="text-capitalize label-text ml-1 info--text text--lighten-2"
          v-if="optional"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          (Opsional)
        </span>
      </span>
    </div>

    <template v-if="field.type === 'text'">
      <general-form-text-area
        v-model="field['value']"
        outlined
        hide-details="auto"
        auto-grow
        :rules="[field.required ? required : true]"
        :readonly="readonly"
        :disabled="readonly"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'number'">
      <general-form-text-area
        v-model="field['value']"
        outlined
        hide-details="auto"
        auto-grow
        @keypress="onDigits"
        :rules="[field.required ? required : true, number]"
        :readonly="readonly"
        :maxLength="13"
        :disabled="readonly"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'currency'">
      <general-form-text-area
        v-model="field['value']"
        outlined
        hide-details="auto"
        auto-grow
        @keypress="onDigits"
        :rules="[field.required ? required : true]"
        :readonly="readonly"
        :maxLength="14"
        :disabled="readonly"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'email'">
      <general-form-text-area
        v-model="field['value']"
        outlined
        hide-details="auto"
        auto-grow
        :rules="[field.required ? required : true, email]"
        :readonly="readonly"
        :disabled="readonly"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'dropdown'">
      <general-form-select
        v-model="field['value']"
        className="text-capitalize"
        outlined
        item-text="name"
        item-value="value"
        hide-details="auto"
        :items="field['options']"
        :rules="[field.required ? required : true]"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'province'">
      <general-form-autocomplete
        v-model="field['value']"
        className="text-capitalize"
        outlined
        hide-details="auto"
        :items="items.provincies"
        item-text="name"
        item-value="key"
        :rules="[field.required ? required : true]"
        @keydown="onUpdateProvincies"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'city'">
      <general-form-autocomplete
        v-model="field['value']"
        className="text-capitalize"
        outlined
        hide-details="auto"
        :items="items.cities"
        item-text="name"
        item-value="key"
        :rules="[field.required ? required : true]"
        :disabled="isProvinceField ? !selectedProvince : false"
        @keydown="onUpdateCities"
      />

      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>

    <template v-if="field.type === 'radio'">
      <v-radio-group
        class="mt-0"
        hide-details="auto"
        v-model="field['value']"
        :rules="[field.required ? required : true]"
        :readonly="readonly"
        :disabled="readonly"
      >
        <v-radio
          v-for="(option, index) in field.options"
          :key="index"
          :ripple="false"
          :label="option.name"
          :value="option.value"
        />
      </v-radio-group>
    </template>

    <template v-if="field.type === 'checkbox'">
      <div v-for="(option, index) in field.options" :key="index">
        <v-checkbox
          class="mt-0"
          multiple
          v-model="field['value']"
          hide-details
          :ripple="false"
          :label="option.name"
          :value="option.value"
          :rules="[field.required ? arrayRule(field['value']) : true]"
          :readonly="readonly"
          :disabled="readonly"
        />
      </div>
      <general-form-text-field
        hide-details="auto"
        dense
        class="hide-input"
        v-model="field['value']"
        :rules="[field.required ? arrayRule(field['value']) : true]"
      />
    </template>

    <template v-if="field.type === 'file'">
      <div
        v-if="getMediaName(field)"
        class="grey lighten-3 secondary--text text--lighten-5 d-flex justify-space-between align-center py-1 px-2 rounded-lg"
      >
        <p
          class="text--default"
          v-bind:class="{ 'hover-underline py-2': readonly }"
          @click="onPreview()"
        >
          {{ getMediaName(field) }}
        </p>
        <v-btn
          v-if="!readonly"
          @click="onRemove()"
          x-small
          color="secondary lighten-5"
          icon
          ><v-icon small>mdi-close</v-icon></v-btn
        >
      </div>

      <template v-if="!mixins.state.isLoading">
        <v-btn
          v-if="!getMediaName(field) && !readonly"
          class="grey lighten-3 secondary--text text--lighten-5 text-capitalize text--default"
          depressed
          :disabled="mixins.state.isLoading"
          @click="onOpenFile"
        >
          <p>Pilih Berkas</p>
        </v-btn>
      </template>
      <template v-else>
        <v-progress-circular
          :rotate="360"
          :size="60"
          :width="8"
          :value="mixins.state.progress"
          color="primary"
        >
          {{ mixins.state.progress }}%
        </v-progress-circular>
      </template>
      <general-form-text-field
        v-if="!readonly"
        class="hide-input"
        hide-details="auto"
        dense
        v-model="field['value']"
        :rules="[field.required ? required : true]"
      />
      <template v-if="field['note']">
        <p class="p--large dark--text mt-4" v-html="field['note']"></p>
      </template>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import rules from "@/mixins/rules";
import debounce from "lodash/debounce";
import utils from "@/mixins/utils";

export default {
  mixins: [rules, media, utils],
  props: {
    field: Object,
    selectedProvince: [Number, String, Object],
    isProvinceField: Boolean,
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    state: {
      loading: {
        province: false,
        city: false,
      },
    },
    items: {
      provincies: [],
      cities: [],
    },
  }),

  created() {
    if (this.field?.type === "province") {
      this.getProvincies(this.field?.value?.name);
    }

    if (this.field?.type === "city") {
      this.getCities(this.field?.value?.name, this.selectedProvince);
    }
  },

  methods: {
    onUpdateProvincies: debounce(function (e) {
      let keyword = e?.target?.value;
      this.getProvincies(keyword);
    }, 500),

    async getProvincies(val) {
      this.state.loading.province = true;
      let payload = {
        // keyword: val,
        limit: 0,
      };

      let res = await this.$api.general.provincies(payload);

      if (res.success) {
        let asc = res?.data?.list?.sort((a, b) => {
          if (a?.name < b?.name) return -1;
          if (a?.name > b?.name) return 1;
          return 0;
        });
        this.items.provincies = asc;
      }

      this.state.loading.province = false;
    },

    onUpdateCities: debounce(function (e) {
      const keyword = e?.target?.value;
      this.getCities(keyword, this.selectedProvince);
    }, 500),

    async getCities(val, key) {
      this.state.loading.city = true;

      let payload = {
        keyword: val,
        province: key?.id ? key?.key : key,
        limit: this.selectedProvince ? 0 : 10,
      };

      if (this.isProvinceField) {
        delete payload["keyword"];
      }

      let res = await this.$api.general.cities(payload);

      if (res.success) {
        let asc = res?.data?.list?.sort((a, b) => {
          if (a?.name < b?.name) return -1;
          if (a?.name > b?.name) return 1;
          return 0;
        });
        this.items.cities = asc;
      }

      this.state.loading.city = false;

      this.$forceUpdate();
    },

    onPreview() {
      if (this.readonly) {
        let url = this.field["value"]["url"];
        window.open(url);
      }
    },

    onRemove() {
      this.mixins.state.media = "";
      this.field["value"] = "";
      this.$forceUpdate();
    },

    getMediaName(val) {
      return val?.value?.name || null;
    },
  },

  watch: {
    "field.value": {
      handler(val) {
        if (!!val && this.field?.type === "currency") {
          this.field["value"] = val
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      },
    },

    "mixins.state.media"(val) {
      this.field["value"] = val;
    },
    selectedProvince(newVal, oldVal) {
      if (this.field?.type === "city") {
        this.getCities(this.field?.value?.name, newVal);

        if (newVal !== oldVal) {
          this.field["value"] = "";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}

::v-deep ul {
  margin-left: 20px !important;
}
::v-deep ol {
  margin-left: 20px !important;
}
</style>
