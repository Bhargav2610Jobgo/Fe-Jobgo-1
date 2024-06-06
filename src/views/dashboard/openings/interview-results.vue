<template>
  <div v-if="!isLoading" class="results">
    <div class="results__details">
      <p class="results__details__candidate">{{ candidate.name }}</p>
      <h2 class="results__details__interview-name">
        {{ evaluation.interview.template.name }}
      </h2>
      <div class="results__details__stats">
        <div class="results__details__stats__stat">
          <hp-icon
            class="results__details__stats__stat__icon"
            name="user"
          ></hp-icon>
          {{ evaluation.interviewerName }}
        </div>
        <div class="results__details__stats__stat">
          <hp-icon
            class="results__details__stats__stat__icon"
            name="chronometer"
          ></hp-icon>
          {{ timeTaken }}
        </div>
        <div class="results__details__stats__stat">
          <hp-icon
            class="results__details__stats__stat__icon"
            name="calendar"
          ></hp-icon>
          {{ createdTime }}
        </div>
      </div>
      <div class="results__details__grid">
        <div
          :class="`results__details__score results__details__score--${calculateColor(
            evaluation.statistics.candidateScore,
            evaluation.statistics.averageInterviewScore
          )}`"
        >
          <div class="results__details__score-container">
            <div class="results__details__score__average">
              {{ evaluation.statistics.candidateScore || "~" }}
            </div>
            <div class="results__details__score__current">Score</div>
            <div class="results__details__score__average-score">
              The average score is
              {{ evaluation.statistics.averageInterviewScore }}
              <hp-icon
                :name="
                  calculateArrowDirection(
                    evaluation.statistics.candidateScore,
                    evaluation.statistics.averageInterviewScore
                  )
                "
              ></hp-icon>
            </div>
          </div>
        </div>
        <div :class="`results__details__score`">
          <div class="results__details__score-container">
            <div class="results__details__score__average">
              {{
                (evaluation.statistics.candidateCompletion * 100).toFixed(0)
              }}%
            </div>
            <div class="results__details__score__current">Completion rate</div>
            <div class="results__details__score__average-score">
              Average completion is
              {{
                (
                  evaluation.statistics.averageInterviewCompletion * 100
                ).toFixed(0)
              }}
              %
              <hp-icon
                :name="
                  calculateArrowDirection(
                    evaluation.statistics.candidateCompletion,
                    evaluation.statistics.averageInterviewCompletion
                  )
                "
              ></hp-icon>
            </div>
          </div>
        </div>
        <div class="results__details__skill-container">
          <div class="results__details__skills-title">Evaluated skills</div>
          <ol class="results__details__skills">
            <hp-badge-tag
              v-for="(skill, index) in evaluation.statistics
                .candidateSkillScores"
              :quantity="skill.score.value || '~'"
              :label="skill.name"
              :type="calculateSkillScoreColor(skill)"
            ></hp-badge-tag>
          </ol>
        </div>
        <div v-if="evaluation.comment" class="results__comments">
          <div class="results__questions__title">Notes</div>
          {{ evaluation.comment }}
        </div>
      </div>
    </div>
    <div class="results__container">
      <div class="results__questions">
        <div class="results__questions__title">Questions</div>
        <ol class="results__questions__list">
          <li
            v-for="(interaction, index) in interactionList"
            class="results__questions__container"
          >
            <div class="results__questions__question">
              <div class="results__questions__container__header">
                <div class="results__questions__container__time">
                  <hp-badge
                    icon="questions"
                    :tooltip="`Question #${index + 1}`"
                    :content="index + 1"
                  />
                </div>
                <div
                  v-if="interaction.interaction?.answer"
                  :class="`
                  results__questions__container__header__little-badge
                  results__questions__container__header__little-badge--${interaction.interaction.answer?.value}
                `"
                >
                  {{ interaction.interaction.answer?.value }} / 5
                </div>
              </div>
              <div class="results__questions__container__content">
                {{ interaction.question.content }}
              </div>
              <div class="hp-question-card-stats">
                <div
                  v-if="interaction.interaction?.answer"
                  class="hp-question-card-stats__stats__stat"
                >
                  <hp-icon
                    class="hp-question-card-stats__stats__stat__icon"
                    name="flag"
                  ></hp-icon>
                  <div>
                    {{ formatDistance(0, interaction.interaction?.duration) }}
                  </div>
                </div>
                <div class="hp-question-card-stats__stats__stat">
                  <hp-icon
                    class="hp-question-card-stats__stats__stat__icon"
                    name="chronometer"
                  ></hp-icon>
                  {{
                    formatDistance(0, interaction.question.duration * 1000, {
                      includeSeconds: true,
                    })
                  }}
                </div>
                <div
                  v-if="interaction.question.skill"
                  class="hp-question-card-stats__stats__stat"
                >
                  <hp-icon
                    class="hp-question-card-stats__stats__stat__icon"
                    name="skills"
                  ></hp-icon>
                  {{ interaction.question.skill?.name }}
                </div>
              </div>
            </div>
            <div v-if="interaction.comment" class="results__questions__notes">
              <hp-icon
                name="file"
                class="results__questions__notes__icon"
              ></hp-icon>
              {{ interaction.comment }}
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
  <hp-spinner :size="24" class="candidate-details__spinner" v-else />
</template>

<script setup>
//Vendor
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { format, formatDistanceStrict, formatDistance } from "date-fns";

//Components
import HpIcon from "@/components/hp-icon.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpBadgeTag from "@/components/hp-badge-tag.vue";
import HpInfoCircle from "@/components/hp-info-circle.vue";

// Composables
import { useGet } from "@/composables/useHttp";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";

const props = defineProps({
  opening: {
    type: Object,
    default: () => {},
  },
});

const { setBreadcrumbs } = useBreadcrumbs();
const router = useRouter();
const route = useRoute();
const candidate = ref({});
const interview = ref({});
const evaluation = ref({});
const isLoading = ref(true);

onMounted(async () => {
  const getEvaluation = useGet(
    `interview-evaluations/${route.params.evaluationRef}`
  );

  await getEvaluation.get();
  candidate.value =
    getEvaluation.data.value.interviewEvaluation.interview.candidate;
  evaluation.value = getEvaluation.data.value.interviewEvaluation;

  setBreadcrumbs([
    {
      label: "Openings",
      to: "/openings",
    },
    {
      label: props.opening.name,
      to: `/openings/${props.opening.reference}`,
    },
    {
      label: candidate.value.name,
      to: `/openings/${props.opening.reference}?candidate=${candidate.value.reference}`,
    },
    {
      label: evaluation.value.interview.template.name,
      to: ``,
    },
  ]);

  isLoading.value = false;
});

const createdTime = computed(() => {
  return format(new Date(evaluation.value.started), "HH:mm, dd MMMM, yyyy");
});

const timeTaken = computed(() => {
  return formatDistanceStrict(
    new Date(evaluation.value.terminated),
    new Date(evaluation.value.started),
    { roundingMethod: "ceil" }
  );
});

const handleArchiveInterview = async () => {
  const deleteInterview = useDelete(`interviews/${evaluation.value.token}`);
  await deleteInterview.remove();
  isInterviewArchiveConfirmOpen.value = false;
  router.push(`/candidates/${route.params.candidateRef}`);
};

const interactionList = computed(() => {
  return evaluation.value.interactions
    .filter((interaction) => {
      return interaction.type === "question";
    })
    .map((i) => i.value);
});

const calculateArrowDirection = (candidate, avg) => {
  if (candidate > avg) {
    return "arrow-top";
  } else if (candidate < avg) {
    return "arrow-down";
  } else {
    return "arrow-top";
  }
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

const calculateSkillScoreColor = (skill) => {
  const average = evaluation.value.statistics.averageInterviewSkillScores.find(
    (i) => i.reference === skill.reference
  );
  if (average) {
    return calculateColor(skill.score.value, average.score.value);
  }
};
</script>

<swag lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  padding: 26px;

  &__container {
    display: flex;
    flex-direction: column;
  }
  &__comments {
    padding: 24px;
    padding-top: 0px;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    overflow: auto;
    white-space: pre-wrap;
    margin-bottom: 26px;
    grid-column: 1/3;
  }
  &__details {
    flex-shrink: 0;
    width: 100%;
    margin-right: 16px;

    &__skill-container {
      border: 1px solid var(--color-border);
      border-radius: $border-radius-lg;
      padding: 16px;
      font-size: 12px;
      grid-column: 1 / 3;
    }
    &__skills-title {
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 16px;
      font-size: 16px;
      &__badge {
        margin-left: 8px;
      }
    }
    &__skills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    &__candidate {
      @include text-h4;
      color: var(--color-text-secondary);
      font-weight: 300;
    }
    &__interview-name {
      @include text-h2;
      color: var(--color-text-primary);
      font-weight: 500;
      margin-bottom: 26px;
    }
    &__stats {
      display: flex;
      margin-bottom: 16px;
      &__stat {
        display: flex;
        align-items: center;
        margin-right: 16px;
        &__icon {
          color: var(--color-text-secondary);
          margin-right: 6px;
        }
      }
    }
    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px;
      &__item {
        @include flyout;
      }
    }
    &__score-container {
      display: flex;
      flex-direction: column;
      padding: 16px;
      height: 100%;
    }
    &__score {
      border: 1px solid var(--color-border);
      border-radius: $border-radius-lg;
      height: 232px;
      font-size: 14px;
      line-height: 20px;
      &--default {
        color: var(--color-text-secondary);
        background: var(--color-panel);
        border: 1px solid var(--color-border);
      }
      &--positive {
        background: var(--color-background-positive);
        border: 1px solid var(--color-border-positive);
        color: var(--color-forground-positive);
      }
      &--negative {
        background: var(--color-background-negative);
        border: 1px solid var(--color-border-negative);
        color: var(--color-forground-negative);
      }
      &__average {
        font-weight: 600;
        font-size: 24px;
        line-height: 32px;
      }
      &__current {
        font-size: 12px;
        line-height: 16px;
        letter-spacing: -0.015em;
        flex: 1;
      }
      &__average-score {
        display: flex;
      }
    }
  }
  &__skill-container {
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    padding: 16px;
    font-size: 12px;
  }
  &__skills-title {
    display: flex;
    align-items: center;
    font-weight: 500;
    margin-bottom: 16px;
    font-size: 16px;
    &__badge {
      margin-left: 8px;
    }
  }
  &__skills {
    display: flex;
    flex-wrap: wrap;
    &__skill {
      border: 1px solid var(--color-border);
      background-color: var(--color-panel);
      padding: 6px;
      border-radius: $border-radius-sm;
      margin-right: 8px;
      margin-bottom: 8px;
      &__badge {
        margin-left: 12px;
      }
    }
  }

  &__questions {
    height: calc(100vh - 106px);
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 100%;
    background: var(--color-panel);
    border-radius: $border-radius-lg;
    border: $border;
    overflow: auto;
    &__notes {
      display: flex;
      padding: 16px;
      border-top: 1px dashed var(--color-border);
      white-space: pre-wrap;
      &__icon {
        color: var(--color-text-secondary);
        margin-right: 6px;
        font-weight: 300;
      }
    }
    &__title {
      @include text-h5;
      color: var(--color-text-primary);
      font-weight: 500;
      margin-top: 12px;
      margin-bottom: 16px;
    }

    &__question {
      padding: 26px;
    }

    &__container {
      border-radius: $border-radius-md;
      border: $border;
      margin-bottom: 16px;
      &__time {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &__little-badge {
          padding: 2px 6px;
          border: $border;
          border-radius: 6px;
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: -0.015em;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          &--1 {
            background: var(--color-background-negative);
            border-color: var(--color-border-negative);
            color: var(--color-forground-negative);
          }
          &--2 {
            background: var(--orange-background);
            border-color: var(--orange-border);
            color: var(--orange-forground);
          }
          &--3 {
            background: var(--yellow-background);
            border-color: var(--yellow-border);
            color: var(--yellow-forground);
          }
          &--4 {
            background: var(--blue-background);
            border-color: var(--blue-border);
            color: var(--blue-forground);
          }
          &--5 {
            background: var(--color-background-positive);
            border-color: var(--color-border-positive);
            color: var(--color-forground-positive);
          }
        }
      }
      &__content {
        @include text-h5;
        font-weight: 500;
        margin-bottom: 16px;
        margin-top: 16px;
      }
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .results {
    flex-direction: row;
    &__details {
      flex-shrink: 0;
      width: 552px;
    }
  }
}
</swag>
