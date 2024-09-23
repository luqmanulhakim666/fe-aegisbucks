<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <general-form-text-field
        v-model="item.value"
        :placeholder="item.placeholder"
        :prepend-icon="item.icon"
        :rules="[link]"
        outlined
        dense
      />
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    items: Array,
  },
};
</script>
