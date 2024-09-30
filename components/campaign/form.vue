<template>
  <div>
    <div v-for="(field, index) in fields" :key="index">
      <template v-if="field.type === 'text'">
        <general-form-text-field
          v-model="field.defaultValue"
          required
          bold
          outlined
          :label="field.label"
          :placeholder="field.placeholder"
          :rules="[required]"
        />
      </template>

      <template v-if="field.type === 'select'">
        <general-form-select
          v-model="field.defaultValue"
          required
          :label="field.label"
          bold
          class="text-capitalize"
          outlined
          item-text="key"
          item-value="value"
          :items="field.options"
          :rules="[required]"
        />
      </template>

      <template v-if="field.type === 'checkbox'">
        <div class="mb-6">
          <p class="h6--xsmall" v-bind:class="{ 'mt-n4': !field.label }">
            {{ field.label }}
          </p>

          <p class="text--small error--text" v-if="!field.options.length">
            *Not options yet
          </p>

          <div
            v-for="(option, i) in field.options"
            :key="i"
            class="d-flex align-start"
          >
            <template v-if="field.options.length > 1 && field.options.length">
              <v-checkbox
                v-model="field.defaultValue"
                multiple
                class="mb-0"
                cldense
                hide-details="auto"
                :ripple="false"
                :value="option['key']"
                :rules="[arrayRule]"
              >
              </v-checkbox>
            </template>

            <template v-if="field.options.length === 1 && field.options.length">
              <v-checkbox
                v-model="option['value']"
                multiple
                class="mb-0"
                cldense
                hide-details="auto"
                :ripple="false"
                :value="option['key']"
                :rules="[arrayRule]"
              >
              </v-checkbox>
            </template>

            <span
              style="margin-top: 24px"
              class="text--default"
              v-html="option.key"
            ></span>
          </div>
        </div>
      </template>

      <template v-if="field.type === 'text_area'">
        <general-form-text-area
          required
          v-model="field.defaultValue"
          bold
          :label="field.label"
          :rules="[required]"
          outlined
        />
      </template>

      <template v-if="field.type === 'number'">
        <general-form-text-field
          required
          v-model="field.defaultValue"
          bold
          :label="field.label"
          outlined
          :rules="[number, required]"
          @keypress="onDigits"
        />
      </template>
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
export default {
  mixins: [rules, utils],
  props: {
    fields: Array,
  },
};
</script>

<style lang="scss" scoped>
::v-deep a {
  color: var(--v-primary-base) !important;
}
</style>
