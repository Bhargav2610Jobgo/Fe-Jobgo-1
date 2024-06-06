<template>
  <div :class="`hp-avatar hp-avatar--${props.size}`">
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md",
  },
  user: {
    type: Object,
    default: () => {},
  },
});

const initials = computed(() => {
  const letters = props.user.name.split(" ").map((word) => word[0]);
  return letters.length > 1
    ? letters[0] + letters[letters.length - 1]
    : letters[0];
});
</script>

<style lang="scss">
.hp-avatar {
  display: inline-flex;
  background-color: var(--color-panel);
  font-weight: 500;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
    0px 0px 1px rgba(33, 44, 51, 0.02);
  border-radius: $border-radius-lg;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  font-size: 14px;
  line-height: 20px;
  &--sm {
    font-size: 10px;
    line-height: 16px;
    height: 24px;
    width: 24px;
    border-radius: $border-radius-sm;
  }
  &--lg {
    height: 64px;
    width: 64px;
    border-radius: $border-radius-lg;
  }
}
</style>
