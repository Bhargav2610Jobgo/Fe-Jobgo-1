<template>
  <div class="hp-candidate-interview-report-card__item__header">
    <div
      class="hp-candidate-interview-report-card__item__header__badge-container"
    >
      <hp-badge icon="layers" :content="index + 1"></hp-badge>
      <hp-badge
        v-if="interview.statistics.candidateScore"
        :type="
          calculateColor(
            interview.statistics.candidateScore,
            interview.statistics.averageTemplateScore
          )
        "
        :content="interview.statistics.candidateScore.toFixed(2)"
      ></hp-badge>
    </div>
    <h3
      class="hp-candidate-interview-report-card__item__header__title"
      :title="interview.name"
    >
      {{ interview.name }}
    </h3>
  </div>
  <div
    v-if="inProgressInterview"
    class="hp-candidate-interview-report-card__item__progress-wrapper"
  >
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="user"
        :size="15"
      ></hp-icon>
      {{ inProgressInterviews.length }} interviewers
    </div>
    <div class="hp-candidate-interview-report-card__item__icon-text">
      In progress
    </div>
    <div class="hp-candidate-interview-report-card__item__actions">
      <hp-dropdown
        class="candidate-interview-card__dropdown"
        :label="'In progress'"
        left
      >
        <template v-slot:dropdown>
          <ul class="hp-multi-select__flyout__options">
            <li v-for="evaluation in inProgressInterviews">
              {{ evaluation.interviewerName }}
            </li>
          </ul>
        </template>
      </hp-dropdown>
    </div>
  </div>
  <div v-else-if="hasTerminatedInterview && completedEvaluations.length === 1">
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="user"
        :size="15"
      ></hp-icon>
      {{
        interview.interview.evaluations.find((e) => e.terminated)
          .interviewerName
      }}
    </div>
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="calendar"
        :size="15"
      ></hp-icon>

      {{
        formatDate(
          interview.interview.evaluations.find((e) => e.terminated).terminated
        )
      }}
    </div>
    <div class="hp-candidate-interview-report-card__item__actions">
      <hp-button
        label="View full results"
        :to="`/reports/${candidate.key}/evaluations/${interview.interview.evaluations[0].key}`"
      ></hp-button>
    </div>
  </div>
  <div v-else-if="hasTerminatedInterview && completedEvaluations.length > 1">
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="user"
        :size="15"
      ></hp-icon>
      {{ interview.interview.evaluations.length }} Interviewers
    </div>
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="calendar"
        :size="15"
      ></hp-icon>

      {{
        formatDate(
          interview.interview.evaluations.find((e) => e.terminated).terminated
        )
      }}
    </div>
    <div class="hp-candidate-interview-report-card__item__actions">
      <hp-dropdown :label="'View full results'" left>
        <template v-slot:dropdown>
          <ul class="hp-multi-select__flyout__options">
            <router-link
              v-for="evaluation in completedEvaluations"
              :to="`/reports/${candidate.key}/evaluations/${evaluation.key}`"
            >
              <li class="hp-multi-select__flyout__options__option">
                {{ evaluation.interviewerName }}
              </li>
            </router-link>
          </ul>
        </template>
      </hp-dropdown>
    </div>
  </div>
  <div v-else>
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="chronometer"
        :size="15"
      ></hp-icon>
      {{ secondsToMinutes(interview.statistics.duration) }} minutes
    </div>
    <div class="hp-candidate-interview-report-card__item__icon-text">
      <hp-icon
        class="hp-candidate-interview-report-card__item__icon-text__icon"
        name="questions"
        :size="15"
      ></hp-icon>

      {{ interview.statistics.questions }} questions
    </div>
    <div
      class="hp-candidate-interview-report-card__item__actions"
      v-if="isNextAction(interview, opening.templates)"
    ></div>
  </div>
</template>

<script setup>
//Vendor
import { computed } from "vue";
import { format } from "date-fns";

//Components
import HpBadge from "@/components/hp-badge.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpButton from "@/components/hp-button.vue";
import HpDropdown from "@/components/hp-dropdown.vue";

const props = defineProps({
  interview: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  opening: {
    type: Object,
    required: true,
  },
  candidate: {
    type: Object,
    required: true,
  },
  isReport: {
    type: Boolean,
    default: false,
  },
});

const inProgressInterview = computed(() => {
  return props.interview.interview.evaluations.find(
    (i) => i.started && !i.terminated
  );
});

const inProgressInterviews = computed(() => {
  return props.interview.interview.evaluations.filter(
    (i) => i.started && !i.terminated
  );
});

const hasTerminatedInterview = computed(() => {
  return props.interview.interview.evaluations.some((i) => i.terminated);
});

const completedEvaluations = computed(() => {
  return props.opening.templates
    .find((t) => props.interview.reference === t.reference)
    .interview.evaluations.filter((e) => e.terminated);
});

const calculateColor = (score, avgScore) => {
  if (!score || score === "0.0") {
    return "default";
  }
  if (score > avgScore) {
    return "positive";
  } else if (avgScore > score) {
    return "negative";
  } else {
    return "default";
  }
};

const formatDate = (date) => {
  return format(new Date(date), "dd MMMM, yyyy");
};

const secondsToMinutes = (seconds) => {
  return Math.floor(seconds / 60);
};

const isNextAction = (template, templates) => {
  const nextRef = templates.find((t) => {
    return !t.interview?.evaluations.some((e) => e.started);
  }).interview?.token;

  return template.interview.token === nextRef;
};
</script>

<style lang="scss" scoped>
.hp-candidate-interview-report-card__item {
  border-radius: $border-radius-lg;
  border: 1px solid var(--color-border);
  width: 264px;
  padding: 16px;
  &--terminated {
    background: var(--color-panel);
  }
  &__header {
    &__badge-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    &__title {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &__icon-text {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &__icon {
      margin-right: 4px;
      color: var(--color-text-secondary);
    }
  }
  &__actions {
    align-items: center;
    display: inline-flex;
    margin-top: 22px;
    &--icon {
      color: var(--color-text-primary);
      margin-left: 6px;
    }
  }
}
</style>
