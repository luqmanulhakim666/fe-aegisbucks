<template>
  <div v-if="isRevised">
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

    <template v-if="field.type === 'radio'">
      <v-radio-group
        hide-details="auto"
        row
        v-model="field['value']"
        :rules="[field.required ? required : true]"
        :readonly="readonly"
        :disabled="readonly"
      >
        <v-radio
          class="mt-n4"
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

      <v-btn
        v-if="!getMediaName(field) && !readonly"
        class="grey lighten-3 secondary--text text--lighten-5 text-capitalize text--default"
        depressed
        :loading="mixins.state.isLoading"
        @click="onOpenFile"
      >
        Pilih Berkas
      </v-btn>
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

      <template v-if="getRevisedComment">
        <v-divider class="my-4" />
        <h6 class="h6--xsmall mb-4">Catatan: <br /></h6>
        <p class="h7--xxsmall dark--text">
          {{ getValidateUserName }}
        </p>
        <p class="text--small mb-4">
          {{ dateMonthYear(getCommentDate) }}
        </p>
        <div class="comment_box pa-4 dark lighten-3 rounded-xl">
          <p class="p--default dark--text">
            {{ getRevisedComment }}
          </p>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import rules from "@/mixins/rules";
import pipe from "@/mixins/pipe";
export default {
  mixins: [rules, media, pipe],
  props: {
    field: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isRevised() {
      return this.field?.status === "revision";
    },

    getValidateUserName() {
      return this.field?.validatedBy?.name || "-";
    },

    getCommentDate(val) {
      return this.field?.validatedAt;
    },

    getRevisedComment() {
      return this.field?.validatedDescription;
    },
  },

  methods: {
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
    "mixins.state.media"(val) {
      this.field["value"] = val;
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
</style>
