<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      :loading="isLoading"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 mb-6"
    >
      <template v-slot:[`item.status`]="{ item }">
        <div class="d-flex align-center pa-4">
          <v-switch
            :disabled="!preventDelete(item.id)"
            color="success lighten-2"
            inset
            :ripple="false"
            v-model="item.active"
            @click="emitUpdateStatus(item)"
          />
          <!-- <general-chips-status
            :label="item.active ? 'Active' : 'Inactive'"
            :color="item.active ? 'success lighten-2' : 'error lighten-2'"
            textColor="white--text"
            width="100"
          /> -->
        </div>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-menu offset-y rounded="lg">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              text
              rounded
              fab
              x-small
              v-bind="attrs"
              v-on="on"
              v-if="preventDelete(item.id)"
            >
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(menu, i) in actions"
                :key="i"
                @click="emitAction(menu.key, item.id)"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon
                    size="14"
                    :color="menu.key === 'edit' ? 'dark ' : 'error'"
                    >{{ menu.icon }}</v-icon
                  >
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    :class="[
                      menu.key === 'edit' ? 'dark--text ' : 'error--text',
                      'h8--supersmall',
                    ]"
                    >{{ menu.text }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
    data: Array,
    actions: Array,
    preventDelete: Function,
  },

  data: () => ({
    headers: [
      {
        text: "Nama",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Email",
        value: "email",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Status",
        value: "status",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Aksi",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
    ],
  }),

  methods: {
    emitAction(val, id) {
      this.$emit("on:actions", val, id);
    },
    emitUpdateStatus(val) {
      this.$emit("update:status", val);
    },
  },
};
</script>
