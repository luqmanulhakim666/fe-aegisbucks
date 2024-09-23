<template>
  <div>
    <div class="white rounded-xl pa-6">
      <v-form v-model="state.isValid" ref="form">
        <v-expansion-panels
          flat
          class="mb-4 border-thin rounded-lg"
          :mandatory="state.mandatory.template"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandTemplate()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Choose Template</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-img width="300" src="/templates/round.png" />

              <v-radio-group v-model="form.templateId">
                <v-radio :ripple="false" value="1">
                  <template v-slot:label>
                    <p class="text--default">Rounded Template</p>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          flat
          class="mb-4 border-thin rounded-lg"
          :mandatory="state.mandatory.color"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandColor()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Setting Color</p>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <div class="shadow-base d-inline mt-6 rounded-xl">
                <p class="text--default my-4">
                  <b>Primary Color:</b> {{ form.primaryColor }}
                </p>
                <v-color-picker
                  class="d-inline-block"
                  v-model="form.primaryColor"
                />
              </div>

              <div class="shadow-base d-inline mt-8 rounded-xl">
                <p class="text--default my-4">
                  <b>Secondary Color:</b> {{ form.secondaryColor }}
                </p>
                <v-color-picker
                  class="d-inline-block"
                  v-model="form.secondaryColor"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.background"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandBackground()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Background Template</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-background
                acceptFile=".pdf, image/png, image/jpg, image/jpeg"
                :form="form"
                class="mt-4"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.cover"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandCover()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Cover Section</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-cover
                acceptFile=".pdf, image/png, image/jpg, image/jpeg"
                :cropper="coverSections"
                class="mt-4"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.header"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandHeader()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Header Section</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-header
                acceptFile=".pdf, image/png, image/jpg, image/jpeg"
                :cropper="headerSections"
                class="mt-4"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.footer"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandFooter()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Footer Section</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-footer
                :items="footerSections"
                class="mt-8"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.thankYou"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="expandThankYou()"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Thank You Page</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <general-form-drop-file class="mt-4" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-form>
    </div>

    <div class="d-flex justify-end mt-8">
      <v-btn
        @click="goBack()"
        class="primary-create-btn text-capitalize h7--xxsmall"
        depressed
        outlined
        :disabled="state.isLoading"
      >
        Previous
      </v-btn>

      <v-btn
        :loading="state.isLoading"
        class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
        depressed
        @click="onSubmit()"
      >
        Save
        <v-icon small class="ml-2">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    form: Object,
  },
  data: () => ({
    state: {
      headerColor: "grey lighten-3",
      isLoading: false,
      isValid: true,
      mandatory: {
        template: true,
        color: true,
        background: true,
        cover: true,
        header: true,
        footer: true,
        thankYou: true,
      },
    },
    coverSections: {
      images: [],
      isEdited: false,
      media: {},
      isLoading: false,
      progress: 0,
      imageUrl: null,
      imageName: null,
      croppedImage: null,
      finalCroppedImage: null,
      dialog: false,
      hasImageId: false,
      indexFile: null,
    },
    headerSections: {
      images: [],
      isEdited: false,
      media: {},
      isLoading: false,
      progress: 0,
      imageUrl: null,
      imageName: null,
      croppedImage: null,
      finalCroppedImage: null,
      dialog: false,
      hasImageId: false,
      indexFile: null,
    },

    footerSections: [
      { icon: "mdi-facebook", value: "", placeholder: "Facebook" },
      { icon: "mdi-instagram", value: "", placeholder: "Instagram" },
      { icon: "mdi-youtube", value: "", placeholder: "Youtube" },
      { icon: "mdi-twitter", value: "", placeholder: "Twitter" },
      { icon: "mdi-web", value: "", placeholder: "Website" },
    ],
  }),

  created() {
    this.coverSections.images = this.form.coverSection;
    this.headerSections.images = this.form.headerSection;
    this.footerSections = this.form.footerSection;
  },

  methods: {
    goBack() {
      this.$router.push({
        path: `/admin/campaigns/${this.$route.params.slug}`,
        query: { tab: "vouchers" },
      });
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.state.isLoading = true;

      const payload = {
        templateId: "1",
        primaryColor: this.form.primaryColor,
        secondaryColor: this.form.secondaryColor,
        backgroundImageId: this.form.backgroundImageId?.id,
        footerSection: this.footerSections,
        coverSection: this.coverSections.images?.map((x) => {
          return {
            id: x.id,
            type: x.mimetype !== "text" ? "image" : "text",
            name: x.name,
          };
        }),
        headerSection: this.headerSections.images?.map((x) => {
          return {
            id: x.id,
            type: x.mimetype !== "text" ? "image" : "text",
            name: x.name,
          };
        }),
      };

      const res = await this.$api.campaigns.update(
        this.$route.params.slug,
        payload
      );

      if (res.success) {
        this.$router.push({
          path: `/admin/campaigns/${this.$route.params.slug}`,
          query: { tab: "preview" },
        });
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    expandTemplate() {
      this.state.mandatory.template = !this.state.mandatory.template;
    },

    expandColor() {
      this.state.mandatory.color = !this.state.mandatory.color;
    },

    expandBackground() {
      this.state.mandatory.background = !this.state.mandatory.background;
    },

    expandCover() {
      this.state.mandatory.cover = !this.state.mandatory.cover;
    },

    expandHeader() {
      this.state.mandatory.header = !this.state.mandatory.header;
    },

    expandFooter() {
      this.state.mandatory.footer = !this.state.mandatory.footer;
    },

    expandThankYou() {
      this.state.mandatory.thankYou = !this.state.mandatory.thankYou;
    },
  },
};
</script>
