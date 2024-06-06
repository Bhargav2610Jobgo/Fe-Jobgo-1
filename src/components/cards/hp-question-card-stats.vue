<template>
  <div class="hp-question-card-stats">
    <div class="hp-question-card-stats__stats__stat">
      <hp-icon
        class="hp-question-card-stats__stats__stat__icon"
        name="chronometer"
      ></hp-icon>
      {{ question.duration / 60 }}
      Minutes
    </div>
    <div
      v-if="question.skill?.name"
      class="hp-question-card-stats__stats__stat"
    >
      <hp-icon
        class="hp-question-card-stats__stats__stat__icon"
        name="skills"
      ></hp-icon>
      {{ question.skill.name }}
    </div>
  </div>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  hasTooltips: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.hp-question-card-stats {
  display: flex;
  flex-direction: column;
  &__stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--color-border);
    margin-top: 16px;
    padding-bottom: 24px;
    &__stat {
      display: flex;
      align-items: center;
      color: var(--color-text-primary);
      margin-right: 12px;
      &__number {
        font-weight: 600;
        margin-right: 2px;
      }
      &__icon {
        color: var(--color-text-secondary);
        margin-right: 4px;
      }
      &__info-circle {
        margin-left: 6px;
      }
    }
  }
}
@media (min-width: $breakpoint-tablet) {
  .hp-question-card-stats {
    flex-direction: row;
  }
}
</style>
