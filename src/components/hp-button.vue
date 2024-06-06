<template>
  <div class="hp-button" :class="containerClasses">
    <component
      v-bind="$attrs"
      :is="computedTag"
      :to="to"
      :href="href"
      @click="handleInternalClick"
      class="hp-button__button"
      :class="buttonClasses"
      :type="type ? type : 'button'"
      :disabled="isDisabled"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <hp-icon
        :class="iconClasses"
        v-if="icon && !iconRight"
        :name="icon"
        :size="16"
      ></hp-icon>
      <div>{{ label }}</div>
      <hp-icon
        :class="iconClasses"
        v-if="icon && iconRight"
        :name="icon"
        :size="16"
      ></hp-icon>
      <hp-spinner
        class="hp-button__button__spinner"
        v-if="isLoading"
        :size="14"
        :mode="primary ? 'light' : 'dark'"
      ></hp-spinner>
    </component>
    <button
      @focus="handleFocus"
      @blur="isFocused = false"
      :class="addonClasses"
      :disabled="isDisabled"
      v-if="hasDropdown"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      <hp-icon :name="dropdownIcon" :size="14" />
    </button>
    <div
      v-if="hasDropdown && isDropdownOpen"
      class="hp-button__dropdown-content"
    >
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script setup>
//Vendor
import { computed, ref } from "vue";
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
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  hasDropdown: {
    type: Boolean,
    default: false,
  },
  dropdownIcon: {
    type: String,
    default: "chevron-down",
  },
  dropzone: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
  },
  href: {
    type: String,
  },
  iconRight: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  destructive: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
  },
});

const isDropdownOpen = ref(false);
const isFocused = ref(false);

const computedTag = computed(() => {
  if (props.to !== undefined && props.to !== null && !props.isDisabled) {
    return "router-link";
  }

  if (props.href !== undefined && props.href !== null && !props.isDisabled) {
    return "a";
  }

  return "button";
});

const handleFocus = () => {
  isFocused.value = true;
};

const handleInternalClick = () => {
  if (props.isDisabled) {
    return;
  }
  emit("handleClick");
};

const containerClasses = computed(() => {
  return {
    "hp-button": true,
    "hp-button--dropzone": props.dropzone,
    "hp-button--primary": props.primary,
    "hp-button--dropdown": props.hasDropdown,
    "hp-button--focused": isFocused.value,
    "hp-button--full-width": props.fullWidth,
  };
});

const buttonClasses = computed(() => {
  return {
    "hp-button__button": true,
    "hp-button__button--dropzone": props.dropzone,
    "hp-button__button--disabled": props.isDisabled,
    "hp-button__button--dropdown": props.hasDropdown,
    "hp-button__button--destructive": props.destructive,
    "hp-button__button--primary": props.primary,
    "hp-button__button--button-icon": props.icon && !props.label,
    "hp-button__button--full-width": props.fullWidth,
    [`hp-button__button--${props.variant}`]: props.variant,
  };
});

const addonClasses = computed(() => {
  return {
    "hp-button__button": true,
    "hp-button__button--disabled": props.isDisabled,
    "hp-button__button--addon": props.hasDropdown,
  };
});

const iconClasses = computed(() => {
  return {
    "hp-button__button__icon": true,
    "hp-button__button__icon--solo": !props.label,
    "hp-button__button__icon--right": props.iconRight,
    "hp-button__button__icon--danger": props.danger,
    "hp-button__button__icon--disabled": props.isDisabled,
  };
});

const emit = defineEmits(["handleClick"]);
</script>

<div lang="scss" scoped>
.hp-button {
  display: inline-flex;
  height: 32px;
  position: relative;
  z-index: $z-index-10;

  &--full-width {
    width: 100%;
  }

  &--dropzone {
    width: 100%;
    height: 40px;
  }

  &--focused {
    border-radius: $border-radius-sm;
    outline: var(--color-focus) solid 4px;
    border-color: var(--color-accent-background);
    filter: drop-shadow(0px 4px 8px rgba(33, 44, 51, 0.02))
      drop-shadow(0px 0px 1px rgba(33, 44, 51, 0.02));
  }

  &--primary .hp-button__button__icon--solo {
    color: var(--color-accent-forground);
  }

  &--primary .hp-button__button__icon--solo {
    color: var(--color-accent-forground);
  }

  // Default
  &__button {
    font-family: "Inter", sans-serif;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 16px;
    font-size: 14px;
    background-color: inherit;
    color: var(--color-text-primary);
    outline: none;
    white-space: nowrap;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    filter: drop-shadow(0px 4px 8px rgba(33, 44, 51, 0.02))
      drop-shadow(0px 0px 1px rgba(33, 44, 51, 0.02));

    -webkit-appearance: none !important;

    &--full-width {
      display: flex;
      width: 100%;
      justify-content: center;
    }

    &:active,
    &:hover {
      background-color: var(--color-panel);
      box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
        0px 0px 1px rgba(33, 44, 51, 0.02);
    }

    &:active {
      border-color: var(--color-border-subtle);
    }

    &__spinner {
      margin-left: 8px;
    }

    &__icon {
      color: var(--color-text-secondary);
      margin-right: 6px;
      margin-left: -10px;
      &--solo {
        margin-right: 0;
        margin-left: 0;
        color: var(--color-text-primary);
      }
      &--right {
        margin-left: 10px;
        margin-right: -6px;
        color: var(--color-accent-forground);
      }
      &--danger {
        color: var(--color-error);
      }
      &--disabled {
        opacity: 0.4;
        pointer-events: none;
      }
    }

    &--button-icon {
      padding: 6px;
      color: var(--color-text-primary);
    }

    &--destructive {
      color: var(--color-accent-forground);
      background-color: var(--color-error);
      &:active,
      &:hover {
        background-color: var(--color-error);
      }

      &:active {
        border-color: var(--color-border-subtle);
      }

      &.hp-button__button--disabled {
        opacity: 0.7;
        color: var(--color-accent-forground);
        background-color: var(--color-error);
        cursor: not-allowed;
        &:hover {
          background-color: var(--color-error);
        }
      }
    }

    &--disabled {
      color: var(--color-text-tertiary);
      cursor: not-allowed;
      &:active,
      &:hover {
        background-color: inherit;
        box-shadow: none;
      }

      &:active {
        border-color: var(--color-border-subtle);
      }
    }

    &--dropdown {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    &--addon {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-left: none;
      padding: 6px;
      color: var(--color-text-secondary);
    }

    &--dropzone {
      background-color: inherit;
      border: 1px dashed var(--color-text-tertiary);
      width: 100%;
      justify-content: center;
      &:active:not([disabled]),
      &:hover:not([disabled]),
      &:active:not([disabled]) {
        background-color: var(--color-background);
        border: 1px dashed var(--color-text-tertiary);
      }
    }
    &--plan {
      color: var(--color-accent-forground);
      background-color: var(--yellow--500);
      border-color: var(--yellow--500);
      > .hp-button__button__icon {
        color: var(--color-accent-forground);
      }
      &:hover {
        background-color: var(--yellow--400);
        border-color: var(--yellow--400);
      }
    }
  }
  &--primary > .hp-button__button {
    color: var(--color-accent-forground);
    background-color: var(--color-accent-background);
    border-color: var(--color-accent-background);
    &:active:not([disabled]),
    &:hover:not([disabled]) {
      background-color: var(--primary--400);
      border-color: var(--primary--400);
      box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
        0px 0px 1px rgba(33, 44, 51, 0.02);
    }

    &:active:not([disabled]) {
      border-color: var(--color-accent-background);
    }
    &--disabled {
      border-color: var(--color-border);
      background-color: var(--color-border);
    }
    &--addon {
      color: var(--color-accent-forground);
      opacity: 0.88;
    }
  }
  &__dropdown-content {
    background-color: white;
    position: absolute;
    @include flyout;
    top: calc(100% + 12px);
    right: 0;
  }
}
</div>
