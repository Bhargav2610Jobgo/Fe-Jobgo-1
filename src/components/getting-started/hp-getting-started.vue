<template>
  <div ref="target" class="hp-getting-started">
    <div
      @click="isDropdownOpen = !isDropdownOpen"
      ref="target"
      class="hp-getting-started__dropdown"
    >
      <div class="hp-getting-started__dropdown__content">
        <div>
          Getting started
          {{ ((completedSteps / stepOrder.length) * 100).toFixed() }}%
        </div>
        <ol class="hp-getting-started__squares">
          <li
            :class="`hp-getting-started__squares__square ${
              checklist[step] && 'hp-getting-started__squares__square--complete'
            }`"
            v-for="step in stepOrder"
          ></li>
        </ol>
      </div>
      <hp-icon name="chevron-down"></hp-icon>
    </div>
    <transition name="flyout-transition">
      <div v-if="isDropdownOpen" class="hp-getting-started__flyout">
        <ol class="hp-getting-started__flyout__steps">
          <hp-getting-started-step
            title="Create account"
            :completed="checklist['account']"
          >
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Create opening"
            :isNextStep="nextStep === 'opening'"
            :completed="checklist['opening']"
          >
            <div class="hp-getting-started__flyout__step__description">
              Create a new opening for your new position
              <hp-button
                class="hp-getting-started__flyout__step__cta"
                label="Create opening"
                :primary="nextStep === 'opening'"
                @click="handleCreateOpening"
              ></hp-button>
            </div>
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Create interview template"
            :isNextStep="nextStep === 'template'"
            :completed="checklist['template']"
          >
            <div class="hp-getting-started__flyout__step__description">
              Select an opening, and create a new interview template.
              <router-link
                :to="`/opening/${opening.reference}/edit/add-interview`"
              >
                <hp-button
                  class="hp-getting-started__flyout__step__cta"
                  label="Create template"
                  :isDisabled="!opening.reference"
                  :primary="nextStep === 'template'"
                ></hp-button>
              </router-link>
            </div>
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Create question"
            :isNextStep="nextStep === 'question'"
            :completed="checklist['question']"
          >
            <div class="hp-getting-started__flyout__step__description">
              Select an opening, select an interview, and create a new question
              template.
            </div>
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Add a candidate"
            :isNextStep="nextStep === 'candidate'"
            :completed="checklist['candidate']"
          >
            <div class="hp-getting-started__flyout__step__description">
              Select an opening and add a candidate.
            </div>
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Run an interview"
            :isNextStep="nextStep === 'interviewed'"
            :completed="checklist['interviewed']"
          >
            <div class="hp-getting-started__flyout__step__description">
              Complete an interview
            </div>
          </hp-getting-started-step>
          <hp-getting-started-step
            title="Invite a team member"
            :isNextStep="nextStep === 'invited'"
            :completed="checklist['invited']"
            v-if="organization?.role === 'owner'"
          >
            <div class="hp-getting-started__flyout__step__description">
              Invite a new team member
              <router-link to="/organization">
                <hp-button
                  class="hp-getting-started__flyout__step__cta"
                  label="Invite members"
                  primary
                ></hp-button
              ></router-link>
            </div>
          </hp-getting-started-step>
        </ol>
        <div class="hp-getting-started__header">
          <div
            @click="dismissGettingStarted"
            class="hp-getting-started__header__dismissal"
          >
            Don't show this again
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// Vendor
import { ref, onMounted, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
// Components
import HpIcon from "@/components/hp-icon.vue";
import HpButton from "@/components/hp-button.vue";
import HpGettingStartedStep from "@/components/getting-started/hp-getting-started-step.vue";
// Composables
import { useGettingStarted } from "@/composables/useGettingStarted";
import useOpenings from "@/composables/useOpenings";
import useAuth from "@/composables/useAuth";

const isDropdownOpen = ref(false);
const target = ref(null);

const { organization } = useAuth();

const stepOrder = [
  "account",
  "opening",
  "template",
  "question",
  "candidate",
  "interviewed",
];

if (organization.role === "owner") {
  stepOrder.push("invited");
}

const { checklist, fetchChecklist, dismissGettingStarted } =
  useGettingStarted();
const { createOpening, opening } = useOpenings();

const router = useRouter();

const handleCreateOpening = async () => {
  const newOpeningRef = await createOpening();
  fetchChecklist();
  router.push(`/opening/${newOpeningRef}/edit`);
};

onMounted(async () => {
  await fetchChecklist();
});

onClickOutside(target, (event) => {
  if (!isDropdownOpen.value) {
    return;
  }
  isDropdownOpen.value = false;
});

const completedSteps = computed(() => {
  return stepOrder.filter((key) => checklist.value[key]).length;
});

const nextStep = computed(() => {
  return stepOrder.find((step) => !checklist.value[step]);
});
</script>

<style lang="scss" scoped>
.hp-getting-started {
  position: relative;
  display: none;
  &__content {
    display: flex;
    margin-right: 12px;
  }
  &__squares {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 2px;
    &__square {
      background-color: var(--color-border);
      width: 16px;
      height: 8px;
      border-radius: 2px;
      &--complete {
        background-color: var(--blue--500);
      }
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 12px;
    &__title {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-primary);
      margin: 4px 0;
    }
    &__dismissal {
      font-size: 12px;
      text-decoration: underline;
      text-align: center;
      color: var(--color-text-secondary);
      cursor: pointer;
    }
  }
  &__dropdown {
    cursor: pointer;
    font-size: 10px;
    border-radius: $border-radius-lg;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border: 1px solid var(--color-background);
    &__content {
      margin-right: 8px;
    }
    &:hover {
      background-color: var(--color-panel);
      border: 1px solid var(--color-border);
    }
  }
  &__flyout {
    @include flyout;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    position: absolute;
    z-index: $z-index-1000;
    right: 0;
    top: 50px;
    transition: all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &__step {
      &__description {
        display: flex;
        flex-direction: column;
      }
      &__cta {
        margin-top: 12px;
      }
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .hp-getting-started {
    display: block;
  }
}
</style>
