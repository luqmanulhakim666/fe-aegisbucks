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
              @click="handleExpand('template')"
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
              @click="handleExpand('color')"
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
                  hide-mode-switch
                  mode="hexa"
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
                  hide-mode-switch
                  mode="hexa"
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
              @click="handleExpand('background')"
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
              @click="handleExpand('cover')"
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
              @click="handleExpand('header')"
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
              @click="handleExpand('footer')"
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
              @click="handleExpand('thankyou')"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Thank You Page</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-thank-you
                :form="form"
                acceptFile=".pdf, image/png, image/jpg, image/jpeg"
                :cropper="thankYouPageSections"
                :primaryColor="form.primaryColor"
                :secondaryColor="form.secondaryColor"
                class="mt-4"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          :mandatory="state.mandatory.emailHeaderImage"
          flat
          class="mb-4 border-thin rounded-lg"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              @click="handleExpand('emailHeaderImage')"
              :color="state.headerColor"
            >
              <p class="h6--xsmall">Email Header Image</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <form-campaign-templates-email-header
                acceptFile=".pdf, image/png, image/jpg, image/jpeg"
                :form="form"
                class="mt-4"
              />
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
        class="primary lighten-5 text-capitalize ml-2 h7--xxsmall"
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
        emailHeaderImage: true,
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
    thankYouPageSections: {
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
    this.coverSections.images =
      this.form.coverSection?.length > 0 ? this.form.coverSection : [];
    this.headerSections.images =
      this.form.headerSection?.length > 0 ? this.form.headerSection : [];

    this.thankYouPageSections.images =
      this.form.thanksSection?.length > 0 ? this.form.thanksSection : [];

    if (this.form.footerSection?.length > 0) {
      this.footerSections = this.form.footerSection;
    }
  },

  methods: {
    updatePrimaryColor(color) {
      // if(typeof color === 'string')
      // Extract the hex value from the color picker and assign it to the form
      this.form.primaryColor = color.hex;
    },

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
        ctaItems: this.form.ctaItems,
        backgroundImageId: this.form.backgroundImage?.id
          ? this.form.backgroundImage?.id
          : null,
        emailHeaderImageId: this.form.emailHeaderImageId?.id
          ? this.form.emailHeaderImageId?.id
          : null,
        footerSection: this.footerSections,
        coverSection: this.coverSections.images?.map((x) => {
          return {
            id: x.id,
            type: x.type,
            name: x.name,
          };
        }),
        headerSection: this.headerSections.images?.map((x) => {
          return {
            id: x.id,
            type: x.type,
            name: x.name,
          };
        }),

        thanksSection: this.thankYouPageSections.images?.map((x) => {
          const {
            finalCroppedImage,
            createdAt,
            fileName,
            mimetype,
            size,
            updatedAt,
            ...data
          } = x;
          return {
            ...data,
            id: x.id,
            type: x.type,
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

    handleExpand(key) {
      this.state.mandatory[key] = !this.state.mandatory[key];
    },
  },
};
</script>
