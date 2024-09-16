<template>
  <v-expansion-panels flat class="rounded-lg">
    <v-expansion-panel class="rounded-lg">
      <v-expansion-panel-header
        @mouseenter="handleDeleteIcon()"
        @mouseleave="handleDeleteIcon()"
      >
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <template v-if="!state.isRename">
              <h4 class="h4--default primary--text">{{ item.name }}</h4>
              <v-btn depressed plain @click.prevent.stop="onRename()"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
            </template>

            <template v-if="state.isRename">
              <div class="d-flex align-center">
                <general-form-text-field
                  v-model="item.name"
                  class="mr-2"
                  className="transparent"
                  @click.stop
                  @keyup.prevent
                />
                <v-btn
                  color="error"
                  depressed
                  icon
                  @click.prevent.stop="onCancelRename()"
                  ><v-icon small>mdi-close</v-icon></v-btn
                >
                <v-btn
                  depressed
                  color="success"
                  icon
                  @click.prevent.stop="onSubmitRename()"
                  ><v-icon small>mdi-check</v-icon></v-btn
                >
              </div>
            </template>
          </div>

          <span
            @click.prevent.stop="onEmitDeletePage()"
            v-if="state.isShowDelete || iSDialogDeleteOpened"
          >
            <v-icon class="mr-4" color="error lighten-1">mdi-delete</v-icon>
          </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <draggable
          v-bind="dragOptions"
          v-model="item.fields"
          @start="drag = true"
          @end=";(drag = false), $emit('on:order')"
          group="people"
        >
          <v-row
            no-gutters
            class="mb-2"
            v-for="(field, index) in item.fields"
            :key="index"
          >
            <v-col cols="12" sm="5" xl="4" align-self="center">
              <h6 class="h6--xsmall dark--text">{{ field.label }}</h6>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              <div class="d-flex justify-space-between">
                <div>
                  <form-tools-chip
                    :label="field.type"
                    class="ma-1 text-capitalize"
                  />
                  <form-tools-chip
                    class="ma-1"
                    :label="field.required ? 'Wajib' : 'Tidak Wajib'"
                  />
                </div>

                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small icon v-bind="attrs" v-on="on">
                      <v-icon> mdi-dots-vertical </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn text x-small @click="onEdit(field, index)">
                          <v-icon x-small class="mr-4">mdi-pencil</v-icon> Ubah
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          class="error--text"
                          text
                          x-small
                          @click="handleDialogDelete(index)"
                        >
                          <v-icon x-small class="mr-4">mdi-delete</v-icon> Hapus
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </draggable>
        <v-btn
          class="primary-create-btn mt-4"
          block
          depressed
          @click="onEmitAddField(item)"
        >
          <v-icon small>mdi-plus</v-icon> Tambah Field
        </v-btn>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <dialog-form-tools-field
      :item="state.selected"
      :dialog="state.isDialog"
      @on:edit="onEmitHandleActionField"
      @on:close="onEdit"
    />

    <general-dialog-delete
      :dialog="state.isDeleteDialog"
      @on:close="handleDialogDelete"
      @on:delete="onDelete"
    />
  </v-expansion-panels>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    item: Object,
    iSDialogDeleteOpened: Boolean,
    indexPage: [String, Number]
  },

  data: () => ({
    state: {
      isShowDelete: false,
      isDialog: false,
      isDeleteDialog: false,
      selected: {},
      indexField: '',
      isRename: '',
      oldName: {}
    }
  }),

  computed: {
    dragOptions() {
      return {
        animation: 200,
        ghostClass: 'ghost'
      }
    }
  },

  methods: {
    onEmitHandleActionField(form) {
      this.$emit(
        'on:submit',
        'edit',
        form,
        this.indexPage,
        this.state.indexField
      )
    },

    onRename() {
      let oldName = JSON.parse(JSON.stringify(this.item))
      this.state.oldName = oldName['name']
      this.state.isRename = true
    },

    onCancelRename() {
      this.item['name'] = this.state.oldName
      this.state.isRename = false
    },

    onSubmitRename() {
      this.$emit('on:order')
      this.state.isRename = false
    },

    onEdit(item, index) {
      this.state.selected = item
      this.state.indexField = index
      this.state.isDialog = !this.state.isDialog
    },

    handleDialogDelete(index) {
      this.state.indexField = index
      this.state.isDeleteDialog = !this.state.isDeleteDialog
    },

    onDelete() {
      this.$emit('on:delete', this.indexPage, this.state.indexField)
      this.state.isDeleteDialog = false
    },

    onEmitAddField(item) {
      this.$emit('on:add', item)
    },

    onEmitDeletePage() {
      this.$emit('delete:page', this.indexPage)
    },

    handleDeleteIcon() {
      this.state.isShowDelete = !this.state.isShowDelete
    },

    getIndex(index) {
      index += 1
      return `Field ${index}`
    }
  }
}
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
