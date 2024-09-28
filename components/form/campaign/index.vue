<template>
  <div>
    <p class="h4--default mb-6">{{ item.productId.name }}</p>
    <v-row>
      <v-col cols="12" md="3" lg="3" xl="2">
        <div class="white rounded-xl">
          <h5 class="h5--small pa-4 dark--text text--lighten-5">Fields</h5>
          <v-divider />
          <div v-for="(item, index) in items.fields" :key="index">
            <v-divider v-if="index > 0" />
            <div class="d-flex align-center pa-4">
              <v-icon class="mr-2">{{ item.icon }}</v-icon>
              <p class="text--default">{{ item.label }}</p>
              <v-spacer />
              <v-btn
                color="success lighten-2"
                @click="onAddField(item)"
                x-small
                icon
                ><v-icon>mdi-plus-circle</v-icon></v-btn
              >
            </div>
          </div>
        </div>
        <v-btn
          block
          depressed
          class="text-capitalize h7--xxsmall primary lighten-1 my-4"
          @click="onSave()"
        >
          <v-icon size="14" class="mr-2">mdi-file</v-icon>
          Save</v-btn
        >
        <v-btn
          @click="onEmitGoBack()"
          block
          outlined
          color="error lighten-1"
          class="text-capitalize h7--xxsmall"
        >
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" lg="7" xl="6">
        <div class="white rounded-xl form fill-height">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4 class="h5--small pa-4 dark--text text--lighten-5">Form</h4>
            </div>

            <div>
              <v-tabs v-model="tab">
                <v-tab>
                  <v-icon size="22">mdi-file-cog</v-icon>
                  <!-- <p class="text--small text-capitalize ml-2">Setting</p> -->
                </v-tab>
                <v-tab>
                  <v-icon size="22">mdi-file-eye</v-icon>
                  <!-- <p class="text--small text-capitalize ml-2">Preview</p> -->
                </v-tab>
              </v-tabs>
            </div>
          </div>

          <v-divider />

          <div class="pa-6 fill-height">
            <template v-if="tab === 0">
              <div
                v-if="isEmptyForm"
                class="d-flex flex-column fill-height justify-center align-center"
              >
                <v-icon size="100">mdi-form-select</v-icon>
                <h2 class="h3--xlarge">Add Fields</h2>
              </div>

              <template v-if="!isEmptyForm">
                <draggable
                  class="dragArea list-group"
                  :list="items.selectedFields"
                  group="people"
                  :animation="500"
                  tag="transition-group"
                  handle=".handle"
                >
                  <div
                    class="list-group-item d-flex align-start"
                    v-for="(element, index) in items.selectedFields"
                    :key="index"
                    @click="selectField(element, index)"
                  >
                    <v-icon class="mr-2 mt-6 handle" size="24"
                      >mdi-drag-horizontal-variant</v-icon
                    >
                    <v-expansion-panels
                      flat
                      class="mb-4 border-thin rounded-lg"
                      focusable
                    >
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <p class="h6--xsmall">
                            {{ element.label }}
                          </p>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <general-form-text-field
                            v-model="element.label"
                            class="mt-6"
                            label="Field Name"
                            outlined
                          />
                          <general-form-text-field
                            v-model="element.placeholder"
                            label="Placeholder"
                            outlined
                          />

                          <template v-if="element.type === 'checkbox'">
                            <p class="h6--xsmall mb-2">Options</p>
                            <v-divider class="mb-4" />
                            <v-btn
                              @click="copyTermAndConditionsLink()"
                              depressed
                              plain
                              class="text-capitalize h8--supersmall primary--text"
                              x-small
                              v-if="element.type === 'checkbox'"
                              ><v-icon small class="mr-2">mdi-link</v-icon>Copy
                              Link S&K</v-btn
                            >
                            <div
                              v-for="(option, i) in element.options"
                              :key="i"
                              class="d-flex justify-space-between mb-4 align-start"
                            >
                              <div class="d-flex full-width align-start">
                                <p class="text--default mt-3">{{ i + 1 }}.</p>
                                <div>
                                  <general-form-rich-editor
                                    class="full-width ml-2 mr-4"
                                    v-model="element.options[i]['key']"
                                    outlined
                                    hide-details="auto"
                                  />
                                </div>
                              </div>
                              <v-btn
                                icon
                                x-small
                                color="error"
                                @click="onRemoveOption(index, i)"
                              >
                                <v-icon small>mdi-close</v-icon>
                              </v-btn>
                            </div>
                            <v-btn
                              x-small
                              depressed
                              class="text-capitalize primary-create-btn h8--supersmall mb-6"
                              @click="onAddNewOption(index)"
                            >
                              <v-icon small>mdi-plus</v-icon> Add
                            </v-btn>
                          </template>

                          <template v-if="element.type === 'select'">
                            <p class="h6--xsmall mb-2">Options</p>
                            <v-divider class="mb-4" />

                            <div
                              v-for="(option, i) in element.options"
                              :key="i"
                              class="d-flex justify-space-between mb-4 align-start"
                            >
                              <div class="d-flex full-width align-start">
                                <p class="text--default mt-3">{{ i + 1 }}.</p>
                                <div>
                                  <general-form-text-field
                                    class="full-width ml-2 mr-4"
                                    v-model="element.options[i]['key']"
                                    outlined
                                    hide-details="auto"
                                  />
                                </div>
                              </div>
                              <v-btn
                                icon
                                x-small
                                color="error"
                                @click="onRemoveOption(index, i)"
                              >
                                <v-icon small>mdi-close</v-icon>
                              </v-btn>
                            </div>
                            <v-btn
                              x-small
                              depressed
                              class="text-capitalize primary-create-btn h8--supersmall mb-6"
                              @click="onAddNewOption(index)"
                            >
                              <v-icon small>mdi-plus</v-icon> Add
                            </v-btn>
                          </template>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-btn
                      icon
                      x-small
                      class="ml-2 mt-2"
                      @click="onRemoveItem(index)"
                      ><v-icon color="error">mdi-close-circle</v-icon></v-btn
                    >
                  </div>
                </draggable>
              </template>
            </template>

            <template v-if="tab === 1">
              <div
                v-if="isEmptyForm"
                class="d-flex flex-column fill-height justify-center align-center"
              >
                <v-icon size="100">mdi-form-select</v-icon>
                <h2 class="h3--xlarge">Add Fields</h2>
              </div>
              <div
                v-for="(element, index) in items.selectedFields"
                :key="index"
                @click="selectField(element, index)"
              >
                <template v-if="element.type === 'text'">
                  <general-form-text-field
                    bold
                    outlined
                    :label="element.label"
                    :placeholder="element.placeholder"
                  />
                </template>

                <template v-if="element.type === 'select'">
                  <general-form-select
                    :label="element.label"
                    bold
                    className="text-capitalize"
                    outlined
                    item-text="key"
                    item-value="value"
                    :items="element.options"
                  />
                </template>

                <template v-if="element.type === 'checkbox'">
                  <div class="mb-6">
                    <p class="h6--xsmall">
                      {{ element.label }}
                    </p>

                    <p
                      class="text--small error--text"
                      v-if="!element.options.length"
                    >
                      *Not options yet
                    </p>
                    <div
                      v-for="(option, i) in element.options"
                      :key="i"
                      class="d-flex align-start"
                    >
                      <v-checkbox
                        class="mb-0"
                        cldense
                        multiple
                        hide-details
                        :ripple="false"
                      >
                      </v-checkbox>

                      <p class="text--default mt-5" v-html="option.key"></p>
                    </div>
                  </div>
                </template>

                <template v-if="element.type === 'text_area'">
                  <general-form-text-area
                    bold
                    :label="element.label"
                    outlined
                  />
                </template>

                <template v-if="element.type === 'number'">
                  <general-form-text-field
                    bold
                    :label="element.label"
                    outlined
                    :rules="[number]"
                    @keypress="onDigits"
                  />
                </template>
              </div>
            </template>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";

export default {
  mixins: [rules, utils],
  props: {
    item: Object,
    inputs: Array,
    brandSlug: String,
    campaignSlug: String,
  },
  components: {
    draggable,
  },

  data: () => ({
    tab: 0,
    selectedItemIndex: 0,
    items: {
      fields: [
        {
          label: "Checkbox Group",
          icon: "mdi-check",
          type: "checkbox",
          defaultValue: "",
          placeholder: "",
          options: [],
        },
        {
          label: "Number",
          icon: "mdi-numeric",
          type: "number",
          defaultValue: "",
          placeholder: "",
          options: [],
        },
        {
          label: "Select",
          icon: "mdi-form-dropdown",
          type: "select",
          defaultValue: "",
          placeholder: "",
          options: [],
        },
        {
          label: "Text Field",
          icon: "mdi-form-textbox",
          type: "text",
          defaultValue: "",
          placeholder: "",
          options: [],
        },
        {
          label: "Text Area",
          icon: "mdi-form-textarea",
          type: "text_area",
          defaultValue: "",
          placeholder: "",
          options: [],
        },
      ],
      selectedFields: [],
      oldFields: [],
    },
  }),

  computed: {
    isEmptyForm() {
      return this.items.selectedFields?.length === 0;
    },
    dragOptions() {
      return {
        animation: 200,
        ghostClass: "ghost",
      };
    },
  },

  created() {
    this.items.selectedFields = this.item.inputs;
    this.items.oldFields = JSON.parse(JSON.stringify(this.item.inputs));
  },

  methods: {
    onAddField(val) {
      this.items.selectedFields.push(JSON.parse(JSON.stringify(val)));
    },
    onRemoveItem(index) {
      this.items.selectedFields.splice(index, 1);
    },
    selectField(val, index) {
      this.selectedItemIndex = index;
    },
    onAddNewOption(parentIndex) {
      let item = { key: "", value: "" };
      this.items.selectedFields[parentIndex].options.push(item);
    },

    onRemoveOption(parentIndex, childIndex) {
      this.items.selectedFields[parentIndex].options?.splice(childIndex, 1);
    },

    copyTermAndConditionsLink() {
      const host = this.$config.API_URL.replace("/api", "");

      const url = `${host}/campaign/${this.brandSlug}/${this.campaignSlug}/term-and-conditions`;

      navigator.clipboard.writeText(url).then(
        () => {
          this.$store.dispatch("snack", [
            "Link copied to clipboard!",
            "success lighten-2",
            "mdi-check-circle",
          ]);
        },
        (err) => {
          this.$store.dispatch("snack", [
            "Failed to copy link",
            "error",
            "mdi-close-circle",
          ]);
        }
      );
    },

    onSave() {
      const handleField = this.items.selectedFields?.map((field) => {
        // Only modify the options for 'checkbox' or 'select' types
        if (
          field.type === "select" ||
          (field.type === "checkbox" && field.options?.length > 1)
        ) {
          field.options = field.options.map((option) => {
            const transformedValue = option.key
              .toLowerCase()
              .replace(/\s+/g, "_");
            return {
              ...option,
              value: transformedValue,
            };
          });
        }

        return field;
      });

      this.$emit("save:form", handleField);
      this.setSuccessAlert("Fields have been updated");
      this.$emit("go:back");

      this.items.selectedFields = [];
    },

    onEmitGoBack() {
      this.$emit("save:form", this.items.oldFields);
      this.$emit("go:back");
      this.items.selectedFields = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #00557c15;
}

.list-group-item {
  cursor: move;
}

::v-deep a {
  color: var(--v-primary-base) !important;
}
</style>
