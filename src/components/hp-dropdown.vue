<template>
  <div ref="target" :class="containerClasses">
    <button
      @click="handleButtonClick"
      class="hp-dropdown__button"
      :class="buttonClasses"
      :type="type ? type : 'button'"
      :disabled="isDisabled"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <hp-icon
        :class="iconClasses"
        v-if="icon"
        :name="icon"
        :size="16"
      ></hp-icon>
      <div class="hp-dropdown__label">{{ label }}</div>
      <hp-spinner
        class="hp-dropdown__button__spinner"
        v-if="isLoading"
        :size="14"
        :mode="primary ? 'light' : 'dark'"
      ></hp-spinner>
      <hp-icon
        :class="`hp-dropdown__button__chevron ${
          isDropdownOpen && 'hp-dropdown__button__chevron--open'
        }`"
        v-else
        name="chevron-down"
        :size="16"
      ></hp-icon>
    </button>
    <transition name="flyout-transition">
      <div
        ref="flyoutRef"
        tabindex="1"
        :class="flyoutClasses"
        v-if="isDropdownOpen"
      >
        <slot name="dropdown"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
//Vendor
import { computed, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

// Components
import HpIcon from "@/components/hp-icon.vue";
import HpSpinner from "@/components/hp-spinner.vue";

const props = defineProps({
  label: {
    type: String,
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
    default: "button",
  },
  left: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
const flyoutRef = ref(null);
const emits = defineEmits(["onChange"]);

const isDropdownOpen = ref(false);
const target = ref(null);
const isFocused = ref(false);

const handleButtonClick = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  emits("onChange", isDropdownOpen.value);
};

watch(
  () => flyoutRef.value,
  () => {
    if (flyoutRef.value) {
      flyoutRef.value.focus();
    }
  }
);

onClickOutside(target, (event) => {
  if (!isDropdownOpen.value) {
    return;
  }
  isDropdownOpen.value = false;
});

const containerClasses = computed(() => {
  return {
    "hp-dropdown": true,
    "hp-dropdown--focused": isFocused.value,
  };
});

const buttonClasses = computed(() => {
  return {
    "hp-dropdown__button": true,
    "hp-dropdown__button--disabled": props.isDisabled,
    "hp-dropdown__button--button-icon": props.icon && !props.label,
  };
});

const addonClasses = computed(() => {
  return {
    "hp-dropdown__button": true,
    "hp-dropdown__button--disabled": props.isDisabled,
  };
});

const iconClasses = computed(() => {
  return {
    "hp-dropdown__button__icon": true,
    "hp-dropdown__button__icon--solo": !props.label,
  };
});

const flyoutClasses = computed(() => {
  return {
    "hp-dropdown__flyout": true,
    "hp-dropdown__flyout--left": props.left,
  };
});
</script>

<div lang="scss" scoped>
.hp-dropdown {
  display: flex;
  height: 32px;
  position: relative;
  width: 100%;

  &--focused {
    border-radius: $border-radius-sm;
    outline: var(--color-focus) solid 4px;
    border-color: var(--color-accent-background);
    filter: drop-shadow(0px 4px 8px rgba(33, 44, 51, 0.02))
      drop-shadow(0px 0px 1px rgba(33, 44, 51, 0.02));

    // Button primary
    &:active:not([disabled]),
    &:hover:not([disabled]) {
      background-color: var(--color-accent-background);
      box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
        0px 0px 1px rgba(33, 44, 51, 0.02);
    }

    &:active:not([disabled]) {
      border-color: var(--color-accent-background);
    }
  }

  &--primary .hp-dropdown__button__icon--solo {
    color: var(--color-accent-forground);
  }

  &__flyout {
    @include flyout;
    position: absolute;
    padding: 4px 8px;
    right: 0;
    top: calc(100% + 6px);
    z-index: $z-index-1000;
    &--left {
      left: 0;
      right: unset;
    }
  }

  &__label {
    padding-right: 6px;
  }

  // Default
  &__button {
    font-family: "Inter", sans-serif;
    display: flex;
    width: 100%;
    align-items: center;
    cursor: pointer;
    padding: 6px 12px;
    white-space: nowrap;
    font-size: 14px;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    outline: none;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    transition: border-color 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    filter: drop-shadow(0px 4px 8px rgba(33, 44, 51, 0.02))
      drop-shadow(0px 0px 1px rgba(33, 44, 51, 0.02));

    &__spinner {
      margin-left: 8px;
    }

    &__chevron {
      margin-left: auto;
      transition: transform 0.15s linear;
      &--open {
        transform: rotate(-180deg);
      }
    }

    &__icon {
      color: var(--color-text-secondary);
      margin-right: 6px;
      &--solo {
        margin-right: 0;
        margin-left: 0;
        color: var(--color-text-primary);
      }
    }

    &--button-icon {
      color: var(--color-text-primary);
    }

    &--disabled {
      color: var(--color-text-tertiary);
      cursor: not-allowed;
    }

    &:active:not([disabled]),
    &:hover:not([disabled]) {
      background-color: var(--color-panel);
      box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
        0px 0px 1px rgba(33, 44, 51, 0.02);
    }

    &:active:not([disabled]) {
      border-color: var(--color-border-subtle);
    }
  }
  &__dropdown-content {
    position: absolute;
    @include flyout;
    padding: 8px;
    top: calc(100% + 12px);
    right: 0;
  }
}
</div>
