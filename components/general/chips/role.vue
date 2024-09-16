<template>
  <v-card
    flat
    :color="colors.bgColor"
    :class="['rounded-xl text-center py-3 px-4', colors.txtColor]"
  >
    <p class="h6--xsmall">
      {{ humanizeRole }}
    </p>
  </v-card>
</template>

<script>
export default {
  props: {
    role: String
  },

  computed: {
    humanizeRole() {
      if (this.role === 'incubator') return 'Inkubator'
      if (this.role === 'tenant') return 'Tenant'
      return 'LPDB'
    },
    colors() {
      let item = {
        bgColor: 'accent lighten-1',
        txtColor: 'primary--text lighten-4'
      }

      if (this.role === 'incubator') {
        item.bgColor = 'primary lighten-4'
        item.txtColor = 'primary--text'
      }

      if (this.role === 'tenant') {
        item.bgColor = 'secondary lighten-4'
        item.txtColor = 'secondary--text'
      }

      return item
    }
  }
}
</script>
