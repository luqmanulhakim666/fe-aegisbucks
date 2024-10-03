<template>
  <div>
    <div class="d-flex align-center mb-2">
      <span
        class="text-capitalize label-text"
        v-if="label"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
          'white--text': labelWhite,
          'dark--text': !labelWhite,
        }"
      >
        {{ label }}
        <span
          class="text-capitalize label-text ml-1 error--text"
          v-if="required"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          *
        </span>
        <span
          class="text-capitalize label-text ml-1 info--text text--lighten-2"
          v-if="optional"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          (Opsional)
        </span>
      </span>
    </div>

    <client-only>
      <quill-editor
        ref="editor"
        v-bind="$attrs"
        v-on="$listeners"
        :options="editorOption"
      />
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Boolean,
      default: false,
    },
    label: String,
  },

  data: () => ({
    editorOption: {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          ["link"],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ],
        ],
      },
    },
  }),
};
</script>

<style lang="scss" scoped>
* {
  left: 0 !important;
}

.quill-editor {
  overflow-y: auto;
}

::v-deep .ql-toolbar.ql-snow {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

::v-deep .ql-container.ql-snow {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

::v-deep .ql-editor {
  height: 200px;
  max-height: 100%;
}

::v-deep .ql-tooltip {
  left: 5px !important;
}
</style>
