<template>
  <div>
    <h1>Campaigns</h1>

    <v-row>
      <v-col cols="12" md="2">
        <div class="white">
          <draggable
            class="dragArea list-group"
            :list="items.fields"
            :group="{ name: 'people', pull: 'clone', put: false }"
          >
            <div v-for="(item, index) in items.fields" :key="index">
              <div class="d-flex pa-4">
                <v-icon class="mr-2">{{ item.icon }}</v-icon>
                <p class="h7--xxsmall">{{ item.name }}</p>
              </div>
              <v-divider></v-divider>
            </div>
          </draggable>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <div class="white pa-6 form fill-height">
          drag here

          <draggable
            class="dragArea list-group"
            :list="items.selectedFields"
            group="people"
            @change="log"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in items.selectedFields"
              :key="index"
              @click="selectField(element, index)"
            >
              {{ element.type }}
              <general-form-text-field
                outlined
                v-if="element.type === 'text-field'"
              />
            </div>
          </draggable>
        </div>
      </v-col>
      <v-col cols="12" md="5"> <div class="white">Properties</div> </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },

  data: () => ({
    items: {
      fields: [
        {
          name: "Checkbox Group",
          icon: "mdi-check",
          type: "check-box",
          properties: {},
        },
        { name: "Number", icon: "mdi-numeric", type: "number", properties: {} },
        {
          name: "Select",
          icon: "mdi-form-dropdown",
          type: "select",
          properties: {},
        },
        {
          name: "Text Field",
          icon: "mdi-form-textbox",
          type: "text-field",
          properties: {},
        },
        {
          name: "Text Area",
          icon: "mdi-form-textarea",
          type: "text-area",
          properties: {},
        },
      ],
      selectedFields: [],
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
    selectField(val, index) {
      console.log(val);
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
