<template>
  <div class="hp-info-circle__container">
    <hp-tooltip>
      <div class="hp-info-circle">?</div>
      <template #content> {{ content }} </template>
    </hp-tooltip>
  </div>
</template>

<script setup>
import HpTooltip from "@/components/hp-tooltip.vue";
const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss">
.hp-info-circle {
  &__container {
    display: inline-flex;
  }
  height: 14px;
  width: 14px;
  display: flex;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-accent-forground);
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: var(--color-text-tertiary);
}
</style>
