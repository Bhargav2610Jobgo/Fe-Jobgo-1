<template>
  <div
    :class="`hp-getting-started-step           ${
      completed && 'hp-getting-started-step--completed'
    }`"
  >
    <div class="hp-getting-started-step__big-o-container">
      <div :class="bigOClasses">
        <div
          v-if="!completed"
          class="hp-getting-started-step__big-o-container__question"
        >
          ?
        </div>
        <hp-icon
          class="hp-getting-started-step__big-o-container__checkmark"
          v-if="completed"
          name="check"
        ></hp-icon>
      </div>
    </div>
    <div class="hp-getting-started-step__accordian">
      <div
        @click="handleAccordianClick"
        :class="`hp-getting-started-step__container ${
          completed && 'hp-getting-started-step__container--completed'
        }`"
      >
        <div class="hp-getting-started-step__container__title">{{ title }}</div>
        <hp-icon
          :class="`hp-getting-started-step__container__icon ${
            isAccordianOpen && 'hp-getting-started-step__container__icon--open'
          }`"
          v-if="!completed"
          name="chevron-down"
        ></hp-icon>
      </div>
      <transition name="flyout-transition">
        <div
          v-if="isAccordianOpen && !completed"
          class="hp-getting-started-step__content"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { ref, computed } from "vue";

// Components
import HpIcon from "@/components/hp-icon.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  isNextStep: {
    type: Boolean,
    default: false,
  },
});

const isAccordianOpen = ref(props.isNextStep);

const handleAccordianClick = () => {
  if (props.completed) {
    return;
  }
  isAccordianOpen.value = !isAccordianOpen.value;
};

const bigOClasses = computed(() => {
  return {
    "hp-getting-started-step__big-o": true,
    "hp-getting-started-step__big-o--completed": props.completed,
    "hp-getting-started-step__big-o--next-action": props.isNextStep,
  };
});
</script>

<style lang="scss" scoped>
.hp-getting-started-step {
  border-bottom: 1px solid var(--color-border);
  display: flex;
  &__big-o {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    border: 2px solid var(--color-border);
    &--completed {
      border: 2px solid var(--blue--300);
    }
    &--next-action {
      border: 2px solid var(--blue--200);
      background-color: var(--blue--100);
      animation: pulse 1.2s infinite;
    }
  }
  &--completed {
    cursor: default;
  }
  &__content {
    font-size: 12px;
    padding: 0px 16px;
    padding-bottom: 16px;
  }
  &__accordian {
    width: 100%;
  }
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    cursor: pointer;
    width: 100%;
    height: 52px;
    &__title {
      margin-right: 8px;
      white-space: nowrap;
    }
    &__icon {
      transition: all 0.15s ease-in-out;
      &--open {
        transform: rotate(180deg);
      }
    }
    &--completed {
      cursor: default;
    }
  }
  &__big-o-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 13px;
    padding-left: 18px;
    &__checkmark {
      color: var(--blue--300);
    }
    &__question {
      height: 20px;
      width: 20px;
      display: flex;
      font-size: 14px;
      font-weight: 300;
      color: var(--blue--200);
      justify-content: center;
      align-items: center;
    }
  }
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(80, 129, 153, 0.4);
    box-shadow: 0 0 0 0 rgba(80, 129, 153, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 6px rgba(80, 129, 153, 0);
    box-shadow: 0 0 0 6px rgba(80, 129, 153, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(80, 129, 153, 0);
    box-shadow: 0 0 0 0 rgba(80, 129, 153, 0);
  }
}
</style>
