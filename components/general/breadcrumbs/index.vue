<template>
  <div class="d-flex align-center">
    <div
      v-for="(item, index) in lists"
      :key="index"
      class="d-flex align-center"
      @click="onPath(item.slug, index)"
    >
      <p
        class="text--small mb-0 text-capitalize"
        v-bind:class="{
          'dark--text text--lighten-5 pointer hover-underline ':
            !getLastIndex(index),
          'primary--text text--lighten-2': getLastIndex(index),
        }"
      >
        {{ item.text }}
      </p>

      <p
        class="h8--supersmall dark--text text--lighten-4 mx-2 mb-0 text-capitalize"
        v-if="!getLastIndex(index)"
      >
        <v-icon
          :color="
            !getLastIndex(index + 2) ? 'primary lighten-2' : 'dark lighten-5'
          "
          >mdi-chevron-right</v-icon
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lists: Array,
  },

  methods: {
    getLastIndex(index) {
      return this.lists?.length === index + 1;
    },

    onPath(val, index) {
      if (!this.getLastIndex(index)) {
        this.$router.push(val);
      }
    },
  },
};
</script>
