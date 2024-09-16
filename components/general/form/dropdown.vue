<template>
  <div class="d-sm-flex align-center">
    <p class="text--small mr-sm-3 mb-2 mb-sm-0 text-capitalize dark--text">
      {{ label }}
    </p>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="text-capitalize gray lighten-2"
          depressed
          v-bind="attrs"
          v-on="on"
        >
          <span class="mr-4 dark--text">{{ isActive }} </span>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list class="form-dropdown">
        <v-list-item v-for="(item, index) in list" :key="index">
          <v-list-item-title
            class="text-capitalize pointer"
            @click="onSetActive(item)"
          >
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    defaultLabel: String,
    active: [String, Number],
    label: String,
    list: Array
  },

  methods: {
    onSetActive(val) {
      this.$emit('set:active', val)
    }
  },

  computed: {
    isActive() {
      let name = this.defaultLabel
      let list = this.list.find((x) => x.key === this.active)

      if (list && list.name) {
        name = list.name
      }

      return name
    }
  }
}
</script>
