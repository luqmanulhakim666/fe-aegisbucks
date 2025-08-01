<template>
  <div class="white pa-6 rounded-xl">
    <v-form v-model="state.isValid" ref="form">
      <general-form-autocomplete
        class="mb-6"
        :loading="state.isLoading"
        v-model="form.batch"
        label="Pilih Batch"
        hide-details="auto"
        :items="items.batch"
        item-text="title"
        item-value="id"
        outlined
        required
        bold
        :rules="[required]"
        @change="onSelectBatch"
      />
      <template v-if="state.isLoading">
        <v-progress-circular
          color="primary"
          class="d-flex mx-auto mt-10"
          indeterminate
        />
      </template>

      <v-card flat :loading="state.isLoading">
        <template v-if="form.batch && !state.isLoading">
          <draggable
            v-bind="dragOptions"
            v-model="items.form"
            @start="drag = true"
            @end="(drag = false), $emit('on:order');"
            group="people"
          >
            <v-row v-for="(item, index) in items.form" :key="index">
              <v-col cols="12">
                <v-divider class="" />

                <div class="d-flex align-center mt-6">
                  <v-icon class="pointer mr-1">mdi-dots-vertical</v-icon>
                  <p class="h6--xsmall mr-4">{{ index + 1 }}.</p>
                  <v-card flat :max-width="xs ? '70%' : '100%'">
                    <general-form-select
                      v-model="items.form[index]"
                      dense
                      outlined
                      hide-details="auto"
                      :items="items.labels"
                      item-value="id"
                      item-text="title"
                      return-object
                      hide-selected
                      placeholder="Pilih Aspek Penilaian"
                    />
                  </v-card>

                  <v-btn
                    depressed
                    small
                    icon
                    class="ml-2"
                    @click="onRemoveParameter(index)"
                    ><v-icon color="error" small>mdi-close</v-icon></v-btn
                  >
                </div>
              </v-col>

              <v-col cols="12" class="pl-16">
                <div
                  v-for="(child, i) in item.childs"
                  :key="i"
                  v-bind:class="{ 'mt-6': i > 0 }"
                >
                  <p class="h6--xsmall mb-1">
                    {{ index + 1 }}.{{ i + 1 }} {{ handleChildLabel(child) }}
                  </p>

                  <v-combobox
                    v-model="items.form[index].childs[i]['field']"
                    :items="items.files"
                    item-text="label"
                    item-value="_id"
                    return-object
                    class="text-field--small flex-grow-1"
                    placeholder="Pilih Dokumen"
                    hide-details
                    small-chips
                    multiple
                    deletable-chips
                    chips
                    outlined
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        class="tag"
                        :key="JSON.stringify(data.item)"
                        v-bind="data.attrs"
                        :model-value="data.selected"
                        :disabled="data.disabled"
                        size="small"
                        close
                        @click:close="data.parent.selectItem(data.item)"
                      >
                        {{ data.item.label }}
                      </v-chip>
                    </template>
                  </v-combobox>
                </div>
              </v-col>
            </v-row>
          </draggable>

          <div class="d-flex align-center justify-space-between my-6">
            <v-btn
              small
              class="primary lighten-5 text-capitalize h7--xxsmall"
              depressed
              @click="onAddParameter()"
              >+ Tambah Parameter</v-btn
            >

            <div>
              <h5 class="h5--small text-right">
                Total:
                {{ getTotalPercentage }} %
              </h5>
              <p class="p--small error--text" v-if="getTotalPercentage > 100">
                *Total harus lebih kecil atau sama dengan 100%
              </p>
            </div>
          </div>
        </template>
      </v-card>

      <v-divider class="my-6" />
      <div class="d-flex justify-end">
        <v-btn
          :disabled="state.isLoading"
          class="primary-create-btn text-capitalize h7--xxsmall"
          depressed
          @click="onBack()"
        >
          Batal
        </v-btn>
        <v-btn
          class="primary lighten-5 text-capitalize ml-2 h7--xxsmall"
          depressed
          :loading="state.isLoading"
          :disabled="getTotalPercentage > 100"
          @click="onSubmit()"
        >
          Simpan
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import alert from "@/mixins/alert";
import utils from "@/mixins/utils";
import rules from "@/mixins/rules";
import draggable from "vuedraggable";
import screen from "@/mixins/screen";

export default {
  components: {
    draggable,
  },
  mixins: [alert, utils, rules, screen],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: ["admin"],
    permission: ["super_admin"],
  },
  data: () => ({
    form: {
      batch: "",
      items: [],
    },
    state: {
      isValid: true,
      isLoading: false,
      id: null,
    },
    items: {
      batch: [],
      files: [],
      labels: [],
      selectedParameters: [],
      form: [""],
    },
    selectedChilds: [],
    selectedFields: [],
  }),

  created() {
    this.state.id = this.$route?.params?.slug;

    if (!this.isCreated) {
      // get detail
      this.fetchOne();
    }

    this.fetchBatch();
  },

  mounted() {
    let appBar = {
      title: "Parameter Batch",
      child: true,
    };

    this.$store.commit("SET_META", appBar);
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        ghostClass: "ghost",
      };
    },

    isCreated() {
      return this.$route?.params?.slug === "create";
    },

    getTotalPercentage() {
      let numbers = this.items.form?.map((x) => {
        return typeof x?.percentage === "number" ? x?.percentage : 0;
      });

      return numbers?.reduce((a, b) => a + b, 0) || 0;
    },
  },

  methods: {
    handleChildLabel(val) {
      if (val?.label?.id) {
        return val?.label?.title;
      }

      if (!val?.label?.id) {
        return val?.title;
      }

      return "";
    },

    onAddParameter() {
      this.items.form.push("");
    },

    onSelectBatch(id) {
      let index = this.items?.batch?.findIndex((x) => {
        return x?.id === id;
      });

      if (index >= 0) {
        this.fetchForm(this.items.batch[index]["dynamicForm"]);
      }
    },

    async fetchBatch() {
      let res = await this.$store.dispatch("general/fetchBatch");

      if (res.success) {
        this.items.batch = res.data.list;
        await this.fetchLabel();
        this.normalizeForm();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.isLoading = res?.loading;
    },

    async fetchForm(id) {
      this.state.isLoading = true;

      let res = await this.$api.dynamicForm.getOne(id);

      if (res.success) {
        let fields = this.mergeFields(res.data?.pages);
        this.items.files = fields
          ?.filter((x) => {
            return x?.type === "file";
          })
          ?.map((y) => {
            return { id: y?._id, ...y };
          })
          ?.sort((a, b) => {
            if (a?.label < b?.label) return -1;
            if (a?.label < b?.label) return 1;
            return 0;
          });
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    async fetchOne() {
      this.state.isLoading = true;

      let res = await this.$api.assessment.parameter.getOne(this.state.id);

      this.form.batch = res.data?.batch;

      this.onSelectBatch(res.data?.batch?.id);

      if (res?.data?.items?.length > 0) {
        this.selectedChilds = res?.data?.items?.map((x) => {
          return x?.label;
        });

        let childs = Array.from(
          new Set(this.selectedChilds.map(JSON.stringify))
        ).map(JSON.parse);

        this.selectedChilds = childs;

        this.selectedFields = res?.data?.items?.map((x) => {
          return { ...x?.field, childId: x?.field ? x?.label?.id : null };
        });

        for (let i in this.selectedFields) {
          let index = this.selectedChilds?.findIndex((x) => {
            return x?.id === this.selectedFields[i]["childId"];
          });
          this.selectedChilds[index] = {
            ...this.selectedChilds[index],
            field: this.selectedFields?.filter((y) => {
              return y?.childId === this.selectedChilds[index]?.id;
            }),
          };
        }
      }

      if (res.success) {
        this.fetchForm(res?.data?.batch?.dynamicForm);
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    normalizeForm() {
      let items = [];

      this.items?.labels?.map((x) => {
        let item = {
          ...x,
          title: `${x?.title} (${x?.percentage}%) -${x?.year}`,
          childs: this.selectedChilds
            ?.filter((y) => {
              return y?.parent === x?.id;
            })
            ?.map((z) => {
              return z;
            }),
        };

        if (item?.childs?.length > 0) {
          items.push(item);
        }
      });

      this.items.form = items;
    },

    async fetchLabel() {
      this.state.isLoading = true;

      let payload = {
        skip: 1,
        limit: 0,
      };

      let res = await this.$api.assessment.label.getList(payload);

      if (res.success) {
        let parent = res?.data?.list?.filter((x) => !x?.parent);

        let item = parent?.map((x) => {
          return {
            ...x,
            title: `${x?.title} (${x?.percentage}%) - ${x?.year}`,
            childs: res.data.list
              ?.filter((y) => {
                return y?.parent?.id === x?.id;
              })
              ?.sort((a, b) => {
                if (Date.parse(a.createdAt) < Date.parse(b.createdAt))
                  return -1;
                if (Date.parse(a.createdAt) > Date.parse(b.createdAt)) return 1;
                return 0;
              }),
          };
        });

        this.items.labels = item?.sort((a, b) => {
          if (a?.year < b?.year) return -1;
          if (a?.year > b?.year) return 1;
          return 0;
        });

        // for (let i in child) {
        //   let index = parent?.findIndex((x) => {
        //     return x?.id === child[i]['parent']['id']
        //   })

        //   // if (index >= 0) {
        //   //   parent[index] = { ...parent, child: child[index] }
        //   // }
        // }
        // this.onGroupingLabel(res.data?.list)
      }

      this.state.isLoading = false;
    },

    onGroupingLabel(val) {
      let parent = val
        ?.filter((x) => {
          return !x?.parent;
        })
        ?.map((y) => {
          return { ...y, childs: [] };
        });

      let sortAsc = parent?.sort((a, b) => {
        if (a?.title < b?.title) return -1;
        if (a?.title > b?.title) return 1;
        return 0;
      });

      let child = val?.filter((x) => {
        return x?.parent?.id;
      });

      for (let i in child) {
        let item = child?.filter((x) => {
          return x?.parent?.id === parent[i]?.id;
        });

        if (item?.length) {
          parent[i]["childs"] = item;
        }
      }

      let list = [];

      sortAsc?.forEach((d) => {
        list.push({
          header: `${d.title} (${d?.percentage}%) - Tahun ${d?.year}`,
        });
        list.push(...d.childs);
        list.push({ divider: true });
      });

      this.items.labels = list;
    },

    async onSubmit() {
      let valid = await this.validate(this.state.isValid);

      if (valid) {
        this.onSave();
      }
    },

    async onSave() {
      // this.state.isLoading = true
      let id = this.$route?.params?.slug;

      let mapForm = this.items.form?.map((x) => {
        return x?.childs?.map((y) => {
          if (!!y?.field?.length) {
            return y?.field?.map((f) => {
              return {
                field: f?._id || null,
                label: y?.label?._id ? y?.label?._id : y?.id,
              };
            });
          }

          if (!y?.field?.length) {
            return {
              field: y?.field?._id || null,
              label: y?.label?._id ? y?.label?._id : y?._id,
            };
          }
        });
      });

      let items = [].concat.apply([], mapForm);

      let payload = {
        batch: this.isCreated ? this.form.batch : this.form.batch?.id,
        items: [].concat.apply([], items),
      };

      let res = this.isCreated
        ? await this.$api.assessment.parameter.create(payload)
        : await this.$api.assessment.parameter.update(id, payload);

      let label = this.isCreated
        ? "Berhasil membuat data"
        : "Berhasil merubah data";

      if (res.success) {
        this.setSuccessAlert(label);
        this.$router.push("/admin/assessment/batch");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onRemoveParameter(index) {
      this.items.form?.splice(index, 1);
    },

    onBack() {
      this.$router.push("/admin/assessment/batch");
    },
  },

  watch: {
    "form.batch"(newVal, oldVal) {
      let old_val = oldVal?.id ? oldVal?.id : oldVal;
      let new_val = newVal?.id ? newVal?.id : newVal;

      if (old_val !== new_val) {
        this.items.form = [];
      }
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
