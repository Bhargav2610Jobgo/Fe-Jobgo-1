<template>
  <div>
    <hp-reports-header />
    <div class="evaluation__pageContainer">
      <div class="evaluation" v-if="!isLoading">
        <div class="evaluation__details">
          <router-link
            class="evaluation__details__back-link"
            :to="`/reports/${candidate.key}`"
          >
            <hp-icon size="16" name="chevron-left"></hp-icon>Back to candidate
            report
          </router-link>
          <h2 class="evaluation__details__interview-name">
            {{ evaluation.interview.template.name }}
          </h2>
          <div class="evaluation__details__stats">
            <div class="evaluation__details__stats__stat">
              <hp-icon
                class="evaluation__details__stats__stat__icon"
                name="user"
              ></hp-icon>
              {{ evaluation.interviewerName }}
            </div>
            <div class="evaluation__details__stats__stat">
              <hp-icon
                class="evaluation__details__stats__stat__icon"
                name="chronometer"
              ></hp-icon>
              {{ timeTaken }}
            </div>
            <div class="evaluation__details__stats__stat">
              <hp-icon
                class="evaluation__details__stats__stat__icon"
                name="calendar"
              ></hp-icon>
              {{ createdTime }}
            </div>
          </div>
          <div class="evaluation__details__grid">
            <div
              :class="`evaluation__details__score evaluation__details__score--${calculateColor(
                evaluation.statistics.candidateScore,
                evaluation.statistics.averageInterviewScore
              )}`"
            >
              <div class="evaluation__details__score-container">
                <div class="evaluation__details__score__average">
                  {{ evaluation.statistics.candidateScore || "~" }}
                </div>
                <div class="evaluation__details__score__current">Score</div>
                <div class="evaluation__details__score__average-score">
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
            <div :class="`evaluation__details__score`">
              <div class="evaluation__details__score-container">
                <div class="evaluation__details__score__average">
                  {{
                    (evaluation.statistics.candidateCompletion * 100).toFixed(
                      0
                    )
                  }}%
                </div>
                <div class="evaluation__details__score__current">
                  Completion rate
                </div>
                <div class="evaluation__details__score__average-score">
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
            <div class="evaluation__details__skill-container">
              <div class="evaluation__details__skills-title">
                Evaluated skills
              </div>
              <ol class="evaluation__details__skills">
                <hp-badge-tag
                  v-for="(skill, index) in evaluation.statistics
                    .candidateSkillScores"
                  :quantity="skill.score.value || '~'"
                  :label="skill.name"
                  :type="calculateSkillScoreColor(skill)"
                ></hp-badge-tag>
              </ol>
            </div>
          </div>
        </div>
        <div class="evaluation__questions">
          <div class="evaluation__questions__title">Questions</div>
          <ol class="evaluation__questions__list">
            <li
              v-for="(interaction, index) in interactionList"
              class="evaluation__questions__container"
            >
              <div class="evaluation__questions__question">
                <div class="evaluation__questions__container__header">
                  <hp-badge icon="questions" :content="index + 1" />
                  <div
                    v-if="interaction.interaction?.answer"
                    :class="`
                  evaluation__questions__container__header__little-badge
                  evaluation__questions__container__header__little-badge--${interaction.interaction.answer?.value}
                `"
                  >
                    {{ interaction.interaction.answer?.value }} / 5
                  </div>
                </div>
                <div class="evaluation__questions__container__content">
                  {{ interaction.question.content }}
                </div>
                <div class="hp-question-card-stats">
                  <div
                    v-if="interaction.interaction?.duration"
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
                  <div class="hp-question-card-stats__stats__stat">
                    <hp-icon
                      class="hp-question-card-stats__stats__stat__icon"
                      name="skills"
                    ></hp-icon>
                    {{ interaction.question.skill.name }}
                  </div>
                </div>
              </div>
              <div
                v-if="interaction.comment"
                class="evaluation__questions__notes"
              >
                <hp-icon
                  name="file"
                  class="evaluation__questions__notes__icon"
                ></hp-icon>
                {{ interaction.comment }}
              </div>
            </li>
          </ol>
        </div>
      </div>
      <hp-spinner :size="24" class="candidate-details__spinner" v-else />
    </div>
  </div>
</template>

<script setup>
//Vendor
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { format, formatDistanceStrict, formatDistance } from "date-fns";

//Components
import HpReportsHeader from "@/components/hp-reports-header.vue";
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

const route = useRoute();
const candidate = ref({});
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
.evaluation {
  display: flex;
  flex-direction: column;
  &__pageContainer {
    max-width: 1400px;
    margin: auto;
    padding: 0px 26px;
  }

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
      margin-bottom: 12px;
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
      margin-bottom: 12px;
    }
    &__back-link {
      margin-bottom: 8px;
      font-weight: 400;
      display: flex;
      align-items: center;
      &:hover {
        opacity: 0.75;
      }
    }
    &__stats {
      display: flex;
      margin-bottom: 16px;
      flex-direction: column;
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
      display: flex;
      flex-direction: column;
      gap: 12px;
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
    margin-bottom: 12px;
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
  .evaluation {
    flex-direction: row;
    &__details {
      flex-shrink: 0;
      width: 552px;
      &__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 16px;
      }
      &__stats {
        flex-direction: row;
      }
    }
  }
}
</swag>
