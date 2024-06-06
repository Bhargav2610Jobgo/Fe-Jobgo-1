<template>
  <li class="hp-badge-tag__skill">
    {{ label }}
    <hp-badge
      class="hp-badge-tag__badge"
      :type="type"
      :content="quantity"
      size="sm"
    ></hp-badge>
  </li>
</template>

<script setup>
import HpBadge from "@/components/hp-badge.vue";

const props = defineProps({
  label: {
    type: String,
  },
  quantity: {
    type: [String, Number],
  },
  type: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss">
.hp-badge-tag {
  &__skill {
    @include text-h7;
    border: 1px solid var(--color-border);
    background-color: var(--color-panel);
    padding: 4px;
    border-radius: $border-radius-sm;
    white-space: nowrap;
    list-style: none;
    &__badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
    }
  }
}
</style>
