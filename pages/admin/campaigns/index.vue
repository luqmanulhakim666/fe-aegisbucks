<template>
  <div>
    <h1 class="mb-6">Campaigns</h1>

    <v-row>
      <v-col cols="12" md="3" lg="3" xl="2">
        <div class="white rounded-xl">
          <h5 class="h4--default pa-4 dark--text text--lighten-5">Fields</h5>
          <v-divider />
          <draggable
            class="dragArea list-group"
            :list="items.fields"
            :option="dragOptions"
            :group="{ name: 'people', pull: 'clone', put: false }"
          >
            <div
              v-for="(item, index) in items.fields"
              :key="index"
              class="pointer"
              @click="onAddField(item)"
            >
              <v-divider v-if="index > 0" />
              <div class="d-flex pa-4">
                <v-icon class="mr-2">{{ item.icon }}</v-icon>
                <p class="text--default">{{ item.name }}</p>
              </div>
            </div>
          </draggable>
        </div>
      </v-col>
      <v-col cols="12" md="6" lg="7" xl="6">
        <div class="white rounded-xl form fill-height">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4 class="h4--default pa-4 dark--text text--lighten-5">Form</h4>
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

          <div class="pa-6">
            <template v-if="tab === 0">
              <draggable
                class="dragArea list-group"
                :list="items.selectedFields"
                group="people"
                :animation="500"
                tag="transition-group"
                handle=".handle"
                @change="log"
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
                          {{ element.name }}
                        </p>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <general-form-text-field
                          v-model="element.name"
                          :rules="[required]"
                          class="mt-6"
                          label="Field Name"
                          outlined
                        />
                        <general-form-text-field
                          v-model="element.placeholder"
                          label="Placeholder"
                          outlined
                        />

                        <template
                          v-if="
                            element.component === 'checkbox' ||
                            element.component === 'radio' ||
                            element.component === 'select'
                          "
                        >
                          <p class="h6--xsmall mb-2">Options</p>
                          <v-divider class="mb-4" />
                          <div
                            v-for="(option, i) in element.options"
                            :key="i"
                            class="d-flex justify-space-between mb-4 align-center"
                          >
                            <div class="d-flex full-width align-center">
                              <p class="text--default">{{ i + 1 }}.</p>
                              <general-form-text-field
                                class="full-width ml-2 mr-4"
                                v-model="element.options[i]['name']"
                                outlined
                                hide-details="auto"
                              />
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

            <template v-if="tab === 1">
              <div
                v-for="(element, index) in items.selectedFields"
                :key="index"
                @click="selectField(element, index)"
              >
                <template v-if="element.component === 'text-field'">
                  <general-form-text-field
                    bold
                    outlined
                    :label="element.name"
                    :placeholder="element.placeholder"
                  />
                </template>

                <template v-if="element.component === 'select'">
                  <general-form-select
                    :label="element.name"
                    bold
                    className="text-capitalize"
                    outlined
                    item-text="name"
                    item-value="value"
                    :items="element['options']"
                  />
                </template>

                <template v-if="element.component === 'checkbox'">
                  <div class="mb-6">
                    <p class="h6--xsmall">
                      {{ element.name }}
                    </p>
                    <div v-for="(option, i) in element.options" :key="i">
                      <v-checkbox
                        dense
                        multiple
                        hide-details
                        :label="option.name"
                        :ripple="false"
                      />
                    </div>
                  </div>
                </template>

                <template v-if="element.component === 'text-area'">
                  <general-form-text-area bold :label="element.name" outlined />
                </template>

                <template v-if="element.component === 'number'">
                  <general-form-text-field
                    bold
                    :label="element.name"
                    outlined
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

export default {
  mixins: [rules],
  components: {
    draggable,
  },

  data: () => ({
    tab: 0,
    selectedItemIndex: 0,
    items: {
      fields: [
        {
          name: "Checkbox Group",
          icon: "mdi-check",
          component: "checkbox",
          placeholder: "",
          options: [],
        },
        {
          name: "Number",
          icon: "mdi-numeric",
          component: "number",
          placeholder: "",
          options: [],
        },
        {
          name: "Select",
          icon: "mdi-form-dropdown",
          component: "select",
          placeholder: "",
          options: [],
        },
        {
          name: "Text Field",
          icon: "mdi-form-textbox",
          component: "text-field",
          placeholder: "",
          options: [],
        },
        {
          name: "Text Area",
          icon: "mdi-form-textarea",
          component: "text-area",
          placeholder: "",
          options: [],
        },
        {
          name: "Radio Button",
          icon: "mdi-radiobox-marked",
          component: "radio",
          placeholder: "",
          options: [],
        },
      ],
      selectedFields: [
        {
          name: "Checkbox Group",
          icon: "mdi-check",
          component: "checkbox",
          placeholder: "",
          options: [],
        },
        {
          name: "Number",
          icon: "mdi-numeric",
          component: "number",
          placeholder: "",
          options: [],
        },
        {
          name: "Select",
          icon: "mdi-form-dropdown",
          component: "select",
          placeholder: "",
          options: [],
        },
        {
          name: "Text Field",
          icon: "mdi-form-textbox",
          component: "text-field",
          placeholder: "",
          options: [],
        },
        {
          name: "Text Area",
          icon: "mdi-form-textarea",
          component: "text-area",
          placeholder: "",
          options: [],
        },
      ],
    },
  }),

  computed: {
    dragOptions() {
      return {
        animation: 200,
        ghostClass: "ghost",
      };
    },
  },

  methods: {
    onAddField(val) {
      this.items.selectedFields.push(val);
    },
    onRemoveItem(index) {
      this.items.selectedFields.splice(index, 1);
    },
    selectField(val, index) {
      console.log("index", index);
      this.selectedItemIndex = index;
    },
    onAddNewOption(parentIndex) {
      let item = { name: "", value: "" };
      this.items.selectedFields[parentIndex].options.push(item);
    },

    onRemoveOption(parentIndex, childIndex) {
      this.items.selectedFields[parentIndex].options?.splice(childIndex, 1);
    },
    log: function (evt) {
      window.console.log(evt);
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
</style>
