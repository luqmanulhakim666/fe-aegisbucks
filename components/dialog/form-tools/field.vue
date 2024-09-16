<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div class="white rounded-xl">
      <general-card-dialog-header
        :name="isCreated ? 'Field Baru' : 'Ubah Field'"
        @close="onEmitClose()"
      />
      <div class="pa-4">
        <v-form v-model="state.isValid" ref="form">
          <general-form-text-field
            v-model="form.label"
            label="Label Field"
            outlined
            bold
            :rules="[required]"
          />
          <general-form-select
            v-model="form.type"
            :items="items"
            item-text="name"
            label="Tipe Field"
            item-value="key"
            outlined
            bold
            :rules="[required]"
          />
          <template v-if="isOption">
            <p class="h6--xsmall mb-2">Opsi</p>
            <v-divider class="mb-4" />
            <div
              v-for="(item, index) in form.options"
              :key="index"
              class="d-flex justify-space-between mb-4 align-center"
            >
              <div class="d-flex full-width align-center">
                <p class="text--default">{{ index + 1 }}.</p>
                <general-form-text-field
                  class="full-width ml-2 mr-4"
                  v-model="form.options[index]['name']"
                  outlined
                  hide-details="auto"
                />
              </div>
              <v-btn icon x-small color="error" @click="onRemoveOption(index)">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-btn
              x-small
              depressed
              class="text-capitalize primary-create-btn h8--supersmall mb-6"
              @click="onAddNewOption()"
            >
              <v-icon small>mdi-plus</v-icon> Tambah Opsi
            </v-btn>
          </template>

          <template v-if="form.type === 'file'">
            <div>
              <p class="h6--xsmall dark--text mb-4">Format Dokumen</p>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-row>
                    <v-col
                      cols="6"
                      v-for="(item, index) in format_documents"
                      :key="index"
                    >
                      <v-checkbox
                        class="mt-0"
                        multiple
                        v-model="form.acceptFiles"
                        hide-details
                        :ripple="false"
                        :label="item.name"
                        :value="item.key"
                        :rules="[arrayRule(form.acceptFiles)]"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <general-form-text-field
                hide-details="auto"
                dense
                class="hide-input"
                v-model="form.acceptFiles"
                :rules="[arrayRule(form.acceptFiles)]"
              />
            </div>

            <div class="mt-4">
              <p class="h6--xsmall dark--text mb-n3">
                Apakah perlu mengunggah berkas asli/ fotokopi ?
              </p>

              <v-radio-group mandatory row v-model="form.isCopyDocument">
                <v-radio
                  :ripple="false"
                  v-for="i in 2"
                  :key="i"
                  :label="i === 1 ? 'Fotokopi' : 'Asli'"
                  :value="i === 1"
                />
              </v-radio-group>
            </div>
          </template>

          <template v-if="form.type === 'text'">
            <p class="secondary--text h7--xxsmall">
              *Centang label ini untuk di cantumkan pada dokumen Tim SS
            </p>
            <div class="mb-8">
              <v-checkbox
                v-model="form.isName"
                hide-details
                dense
                @change="handleInputIsName"
              >
                <template v-slot:label>
                  <p class="text--default">Nama Inkubator</p>
                </template>
              </v-checkbox>

              <v-checkbox
                v-model="form.isAddress"
                hide-details
                dense
                @change="handleInputIsAddress"
              >
                <template v-slot:label>
                  <p class="text--default">Alamat Inkubator</p>
                </template>
              </v-checkbox>
            </div>
          </template>

          <template v-if="!isOption && form.type">
            <general-form-rich-editor
              class="mb-8"
              v-model="form.note"
              label="Deskripsi "
              optional
              bold
            />
          </template>

          <div>
            <p class="h6--xsmall dark--text">Apakah Field ini Wajib diisi ?</p>
            <v-radio-group row v-model="form.required">
              <v-radio
                :ripple="false"
                v-for="i in 2"
                :key="i"
                :label="i === 1 ? 'Ya' : 'Tidak'"
                :value="i === 1"
              />
            </v-radio-group>
          </div>
        </v-form>

        <div class="d-flex justify-end">
          <v-btn
            class="secondary lighten-5 text--large text-capitalize px-10"
            depressed
            @click="onSave()"
          >
            Simpan
          </v-btn>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    indexPage: [String, Number],
    indexField: Number,
    item: Object,
  },

  data: () => ({
    items: [],
    format_documents: [],
    form: {
      label: "",
      type: "",
      required: true,
      isCopyDocument: true,
      options: [],
      note: "",
      acceptFiles: [],
      isName: null,
      isAddress: null,
    },
    state: {
      isValid: true,
    },
  }),

  computed: {
    isCreated() {
      return !this.item?._id;
    },

    isOption() {
      let items = ["radio", "checkbox", "dropdown"];
      return items?.includes(this.form.type);
    },
  },

  methods: {
    async onSave() {
      let valid = await this.validate(this.state.isValid);

      if (valid) {
        await this.handleForm();

        this.isCreated ? this.onAdd() : this.onEdit();

        await this.$refs.form.resetValidation();
        this.onEmitClose();
      }
    },

    handleForm() {
      let options = ["radio", "checkbox", "dropdown"];
      let type = this.form.type;
      if (!options?.includes(type)) {
        delete this.form["options"];
      }

      if (options?.includes(type)) {
        this.form["options"] = this.form?.options?.map((x) => {
          return {
            name: x.name,
            value: x.name?.replace(/-|\s/g, "_")?.toLowerCase(),
            id: x?._id,
          };
        });
      }
    },

    onAdd() {
      this.$emit("on:submit", "create", this.form, this.indexPage);
    },

    onEdit() {
      this.$emit("on:edit", this.form);
    },

    onEmitClose() {
      this.$emit("on:close");
      this.form = {
        label: "",
        type: "",
        required: true,
        options: [],
      };
    },

    onAddNewOption() {
      let item = { name: "", value: "" };
      this.form.options.push(item);
    },

    onRemoveOption(index) {
      this.form?.options?.splice(index, 1);
    },

    handleInputIsName(e) {
      if (this.form?.isName) {
        this.form.isAddress = false;
      }
    },

    handleInputIsAddress(e) {
      if (this.form?.isAddress) {
        this.form.isName = false;
      }
    },
  },

  watch: {
    async item(val) {
      await val;
      if (val) {
        this.form = JSON.parse(JSON.stringify(val));
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
</style>
