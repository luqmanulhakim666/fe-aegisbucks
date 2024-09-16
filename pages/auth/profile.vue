<template>
  <div>
    <general-profile-admin v-if="isAdmin" />
    <general-profile-user v-if="!isAdmin" />
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      //log here
      return this.$store.getters['auth/role'] === 'admin'
    }
  }
}
</script>

<style lang="scss" scoped>
.conainer {
  padding: 0 !important;
}
</style>
