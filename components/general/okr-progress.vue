<template>
  <div>
    <h3 class="primary--text">{{ progress || 0 }}%</h3>
    <v-progress-linear
      :value="progress"
      color="success lighten-5"
      height="10"
      class="rounded-pill mb-2"
    />
  </div>
</template>
<script>
export default {
  props: {
    progress: [Number, String]
  }
}
</script>
