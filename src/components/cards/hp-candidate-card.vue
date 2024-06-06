<template>
  <router-link
    :class="candidateCardClasses"
    :to="`/openings/${route.params.openingRef}?candidate=${candidate.reference}`"
  >
    <div class="hp-candidate-card__container">
      <div class="hp-candidate-card__info">
        <div class="hp-candidate-card__info__details">
          <div class="hp-candidate-card__info__details__detail">
            {{ candidate.name }}
          </div>
          <div class="hp-candidate-card__info__details__detail--email">
            {{ candidate.email }}
          </div>
        </div>
        <hp-badge
          v-if="candidate?.statistics?.candidateScore"
          :type="
            calculateColor(
              candidate.statistics.candidateScore,
              candidate.statistics.averageOpeningScore
            )
          "
          :content="candidate.statistics.candidateScore.toFixed(2)"
        ></hp-badge>
      </div>
      <div v-if="opening.templates" class="hp-candidate-card__interview-ticks">
        <div
          :class="[
            `hp-candidate-card__interview-tick`,
            isNextAction(index) && 'hp-candidate-card__interview-tick--next',
            candidate.statistics.interviewProgress[index] === 'terminated' &&
              'hp-candidate-card__interview-tick--completed',
          ]"
          v-for="(template, index) in opening.templates"
          :key="template"
        ></div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import HpBadge from "@/components/hp-badge.vue";
import useOpenings from "@/composables/useOpenings";

const props = defineProps({
  candidate: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const { opening } = useOpenings();

const route = useRoute();

const isNextAction = (index) => {
  const firstNonTerminated =
    props.candidate.statistics.interviewProgress.findIndex((progress) => {
      return progress !== "terminated";
    });
  return firstNonTerminated === index;
};

const calculateColor = (candidate, avg) => {
  if (candidate > avg) {
    return "positive";
  } else if (candidate < avg) {
    return "negative";
  } else {
    return "neutral";
  }
};

const candidateCardClasses = computed(() => {
  return {
    "hp-candidate-card": true,
    "hp-candidate-card--selected":
      route.query.candidate === props.candidate.reference,
    "hp-candidate-card--disabled": props.isDisabled,
  };
});
</script>

<style lang="scss">
.hp-candidate-card {
  border: 1px solid var(--color-border);
  background-color: var(--color-panel);
  border-radius: $border-radius-md;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  display: flex;
  &:hover {
    box-shadow: inset 0px 0px 4px rgba(33, 44, 51, 0.01),
      inset 0px 0px 48px rgba(33, 44, 51, 0.03);
  }
  &--disabled {
    opacity: 0.4;
  }
  &--selected {
    background-color: var(--color-background);
    &:hover {
      box-shadow: none;
    }
  }
  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  &__info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    &__details__detail {
      font-weight: 500;
      color: var(--color-text-primary);
      &--email {
        font-weight: 400;
        color: var(--color-text-secondary);
      }
    }
  }
  &__interview-ticks {
    margin-top: 8px;
    display: flex;
  }
  &__interview-tick {
    width: 100%;
    height: 4px;
    background-color: var(--color-border);
    margin-right: 2px;
    border-radius: $border-radius-sm;
    &--next {
      background: repeating-linear-gradient(
        45deg,
        var(--color-text-tertiary),
        var(--color-text-tertiary) 2px,
        var(--color-border) 2px,
        var(--color-border) 4px
      );
    }
    &--completed {
      background-color: var(--color-accent-background);
    }
    &:last-child {
      margin-right: 0;
    }
  }
  &:focus {
    outline: 4px solid var(--color-focus);
  }
}
</style>
