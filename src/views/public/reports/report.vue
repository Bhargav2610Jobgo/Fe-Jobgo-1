<template>
  <div>
    <hp-reports-header />
    <div v-if="!isPageLoading" class="report">
      <div class="report__header">
        <div class="report__info">
          <div class="report__info__name">
            {{ candidate.name }}
          </div>
          <div class="report__info__email">
            {{ candidate.email }}
          </div>
        </div>
      </div>
      <div class="report__interviews">
        <div class="report__interviews__header">
          <div>
            <h3 class="report__interviews__title">Report</h3>
            <p class="report__interviews__subtitle">
              This is a public but anonymized report of a candidate on
              <a
                class="report__interviews__link"
                target="_blank"
                href="https://hireproof.io/"
                >Jobgo</a
              >.
            </p>
          </div>
          <hp-circular-badge
            :upper="candidate.opening.templates.length"
            :lower="completedTemplates"
          ></hp-circular-badge>
        </div>
        <ul v-if="opening.templates.length > 0" class="report__interview-grid">
          <li
            :class="createClasses(interview)"
            v-for="(interview, index) in opening.templates"
          >
            <hp-candidate-interview-report-card
              :interview="interview"
              :index="index"
              :opening="opening"
              :candidate="candidate"
            />
          </li>
        </ul>
      </div>
      <div class="report__overview">
        <div
          :class="`report__overview__score report__overview__score--${calculateColor(
            candidate.opening.statistics.candidateScore,
            candidate.opening.statistics.averageOpeningScore
          )}`"
        >
          <div class="report__overview__score-container">
            <div class="report__overview__score__average">
              {{
                candidate.opening.statistics.candidateScore?.toFixed(2) || "~"
              }}
              <div v-if="candidate.opening.statistics.candidateScore">
                <hp-icon
                  class="report__arrow"
                  :size="24"
                  v-if="
                    candidate.opening.statistics.candidateScore >
                    candidate.opening.statistics.averageOpeningScore
                  "
                  name="arrow-top"
                ></hp-icon>
                <hp-icon
                  v-else
                  class="report__arrow"
                  :size="24"
                  name="arrow-down"
                ></hp-icon>
              </div>
            </div>
            <div class="report__overview__score__current">Current score</div>
            <div
              v-if="candidate.opening.statistics.averageOpeningScore"
              class="report__overview__score__average-score"
            >
              The average score is
              {{ candidate.opening.statistics.averageOpeningScore?.toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="report__overview__skill-container">
          <div class="report__overview__skills-title">
            Evaluated skills
            <hp-badge
              class="report__overview__skills-title__badge"
              icon="skills"
              :content="skillList ? skillList.length : 0"
            ></hp-badge>
          </div>
          <ol class="report__overview__skills">
            <hp-badge-tag
              v-for="skill in skillList"
              :label="skill.label"
              :quantity="skill.value"
              :type="calculateColor(skill.value, skill.average)"
            ></hp-badge-tag>
          </ol>
        </div>
      </div>
      <hp-spinner
        :size="24"
        class="report__spinner"
        v-if="isPageLoading"
      ></hp-spinner>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

// Components
import HpBadge from "@/components/hp-badge.vue";
import HpReportsHeader from "@/components/hp-reports-header.vue";
import HpBadgeTag from "@/components/hp-badge-tag.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpCircularBadge from "@/components/hp-circular-badge.vue";
import HpCandidateInterviewReportCard from "@/components/cards/hp-candidate-interview-report-card.vue";

const route = useRoute();
const isPageLoading = ref(true);
const opening = ref({});
const candidate = ref({});

onMounted(async () => {
  const { candidateKey } = route.params;
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/candidates/${candidateKey}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  opening.value = data.candidate.opening;
  candidate.value = data.candidate;
  isPageLoading.value = false;
});

const skillList = computed(() => {
  const skills = opening.value.statistics.averageOpeningSkillScores.map(
    (skill) => {
      return {
        name: skill.name,
        reference: skill.reference,
      };
    }
  );

  const isSkillsTheSameAsAverage = skills.every((skill) => {
    const candidateSkillScore =
      candidate.value?.opening?.statistics?.candidateSkillScores.find(
        (s) => s.reference === skill.reference
      )?.score?.value;

    const averageSkillScore =
      candidate.value?.opening?.statistics?.averageOpeningSkillScores.find(
        (s) => s.reference === skill.reference
      )?.score?.value;

    return candidateSkillScore === averageSkillScore;
  });

  const formattedSkills = skills.map((skill) => {
    const skillValue =
      candidate.value?.opening?.statistics?.candidateSkillScores.find(
        (s) => s.reference === skill.reference
      )?.score?.value;

    return {
      label: skill.name,
      value: skillValue?.toFixed(1) ?? "0.0",
      average: isSkillsTheSameAsAverage
        ? 3
        : candidate.value?.opening?.statistics?.averageOpeningSkillScores.find(
            (s) => s.reference === skill.reference
          )?.score?.value,
    };
  });

  const sortedSkills = formattedSkills.sort((a, b) => {
    return b.value - a.value;
  });

  return sortedSkills;
});

const createClasses = (interview) => {
  return {
    "report__interview-grid__item": true,
    "report__interview-grid__item--terminated": interview.interview.terminated,
    "report__interview-grid__item--in-progress":
      interview.interview.started && !interview.interview.terminated,
  };
};

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

const completedTemplates = computed(() => {
  return candidate.value.opening.templates.filter((t) =>
    t.interview.evaluations.some((e) => e.terminated)
  ).length;
});
</script>

<style lang="scss">
.report {
  @include pageContainer;
  height: 100%;
  &__spinner {
    margin-top: 64px;
    display: flex;
    justify-content: center;
  }
  &__header {
    display: flex;
    flex-direction: column;
    &__button-group {
      display: flex;
      align-items: center;
      gap: 6px;
      &__button {
        margin-right: 8px;
      }
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    &__name {
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      letter-spacing: -1.5%;
    }
    &__email {
      font-size: 24px;
      line-height: 32px;
      color: var(--color-text-secondary);
      letter-spacing: -0.015em;
    }
  }
  &__overview {
    margin-top: 40px;
    display: grid;
    grid-gap: 24px;
    padding-bottom: 24px;
    &--incomplete {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-items: center;
      margin-top: 24px;
      color: var(--color-text-secondary);
      padding: 12px;

      :first-child {
        margin-bottom: 12px;
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
        display: flex;
        align-items: center;
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
      gap: 6px;
    }
  }
  &__interviews {
    padding-top: 24px;
    &__empty {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &__image {
        height: 120px;
        margin-top: 12p;
        margin-bottom: 12px;
      }
      &__button {
        margin-top: 12px;
      }
    }
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__title {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
    }
    &__subtitle {
      font-size: 14px;
      line-height: 20px;
      color: var(--color-text-secondary);
    }
    &__link {
      color: var(--color-text-primary);
      &:hover {
        opacity: 0.8;
      }
    }
  }
  &__interview-grid {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 264px);
    grid-gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px dashed var(--color-border);
  }
  &__interview-grid__item {
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
}

@media (min-width: $breakpoint-tablet) {
  .report__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .report {
    &__overview {
      grid-template-columns: 264px auto;
    }
  }
}
</style>
