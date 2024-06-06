<template>
  <div class="hp-circular-badge">
    <div class="hp-circular-badge__circle-container">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <path
          class="hp-circular-badge__circle"
          stroke-dasharray="100, 100"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="hp-circular-badge__circle--inner"
          :stroke-dasharray="`${percentage}, 100`"
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
    </div>
    <div class="hp-circular-badge__content">
      <div class="hp-circular-badge__content__lower">{{ lower }}</div>
      <div>/</div>
      <div>{{ upper }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  upper: {
    type: Number,
    default: 0,
  },
  lower: {
    type: Number,
    default: 0,
  },
});

const percentage = computed(() => {
  const upper = props.upper;
  const lower = props.lower;
  const percentage = (lower / upper) * 100;
  return percentage;
});
</script>

<style lang="scss">
.hp-circular-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px 4px 4px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  &__circle-container {
    height: 16px;
    width: 16px;
    margin-right: 6px;
  }
  &__content {
    display: flex;
    align-items: baseline;
    color: var(--color-text-secondary);
    font-size: 12px;
    line-height: 16px;
    &__lower {
      font-size: 14px;
      line-height: 20px;
      color: var(--color-accent-background);
    }
  }
  &__circle {
    fill: none;
    stroke: var(--color-accent-background);
    stroke-width: 3;
    opacity: 0.4;
    &--inner {
      fill: none;
      stroke: var(--color-accent-background);
      stroke-width: 1.3;
      stroke-linecap: round;
    }
  }
}
</style>
