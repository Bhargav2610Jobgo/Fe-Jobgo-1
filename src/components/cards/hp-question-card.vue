<template>
  <li class="hp-question-card">
    <div class="hp-question-card__content">
      {{ question.content }}
    </div>
    <hp-question-card-stats :question="question" />
    <div class="hp-question-card__actions">
      <hp-button
        class="hp-question-card__actions__button"
        label="Add question"
        @handleClick="$emit('handleAddToInterview', question)"
      ></hp-button>
    </div>
  </li>
</template>

<script setup>
import HpButton from "@/components/hp-button.vue";
import HpQuestionCardStats from "@/components/cards/hp-question-card-stats.vue";
const props = defineProps({
  question: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["handleAddToInterview"]);
</script>

<style lang="scss">
.hp-question-card {
  width: 100%;
  list-style: none;
  border-radius: $border-radius-sm;
  border: $border;
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin-bottom: 6px;
  &__content {
    font-weight: 500;
    @include text-h5;
    margin-bottom: 16px;
  }
  &__stats {
    display: flex;
    margin-bottom: 16px;
    &__stat {
      margin-right: 16px;
      display: flex;
      align-items: center;
      &__icon {
        margin-right: 6px;
        color: var(--color-text-secondary);
      }
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    padding-top: 16px;
    &__button {
      margin-right: 6px;
    }
  }
}
</style>
