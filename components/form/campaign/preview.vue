<template>
  <iphone
    :brandSlug="brandSlug"
    :campaignSlug="campaignSlug"
    :isPublished="isPublished"
  />
</template>

<script>
export default {
  props: {
    brandSlug: String,
    campaignSlug: String,
    isPublished: Boolean,
  },
};
</script>
