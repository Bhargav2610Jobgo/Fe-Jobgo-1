<template>
  <component v-bind="linkProps" :to="to" :is="tag"> <slot></slot> </component>
</template>

<script setup>
// Vendor
import { RouterLink, useLink } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: String,
  to: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const linkProps = useLink(props);

const tag = computed(() => {
  if (props.isDisabled) {
    return "div";
  }
  return "router-link";
});
</script>
