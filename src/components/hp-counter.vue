<template>
  <div class="hp-counter">
    <label v-if="label" class="hp-counter__label" :htmlFor="name"
      >{{ label }}
    </label>
    <div :class="containerClasses">
      <div class="hp-counter__container">
        <hp-icon
          class="hp-counter__container__icon"
          :size="16"
          name="chronometer"
        ></hp-icon>
        <div class="hp-counter__container__count">
          <input
            type="number"
            v-model="modelValue"
            maxlength="2"
            :class="inputClasses"
            @input="handleInput"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          />
        </div>
        <hp-badge class="hp-counter__container__badge" content="min"></hp-badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
import HpBadge from "@/components/hp-badge.vue";

// Vendor
import { ref, computed } from "vue";
import { useField } from "vee-validate";

const emits = defineEmits(["update:modelValue", "input"]);
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
  },
  name: {
    type: String,
  },
  isDisabled: {
    type: String,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 60,
  },
});

const isInputFocused = ref(false);

const { errorMessage, value: modelValue } = useField(props.name);

const containerClasses = computed(() => {
  return {
    "hp-counter__input-container": true,
    "hp-counter__input-container--error": props.max < modelValue.value,
    "hp-counter__input-container--error": props.min > modelValue.value,
    "hp-counter__input-container--error": errorMessage.value,
    "hp-counter__input-container--error": !modelValue.value,
    "hp-counter__input-container--disabled": props.isDisabled,
    "hp-counter__input-container--focused": isInputFocused.value,
  };
});

const inputClasses = computed(() => {
  return {
    "hp-counter__container__input": true,
    "hp-counter__container__input--error": props.max < modelValue.value,
    "hp-counter__container__input--error": props.min > modelValue.value,
  };
});

const handleInput = (e) => {
  emits("update:modelValue", e.target.value);
  emits("input", modelValue);
};
</script>

<styles lang="scss">
.hp-counter {
  display: inline-flex;
  flex-direction: column;
  &__input-container {
    border-radius: $border-radius-sm;
    &--disabled {
      opacity: 0.4;
      cursor: not-allowed;
      .hp-counter__container {
        pointer-events: none;
      }
    }
    &--focused {
      outline: 4px solid var(--color-focus);
      .hp-counter__container {
        border: 1px solid var(--color-accent-background);
      }
    }
    &--error {
      border: 1px solid var(--color-error);
      outline: 4px solid var(--color-focus);
      .hp-counter__container {
        border: none;
      }
    }
  }
  &__label {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  &__container {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    padding: 8px;
    &__input {
      width: 100%;
      max-width: 22px;
      border: none;
      outline: none;
      background-color: var(--color-background);
      color: var(--color-text-primary);
      -moz-appearance: textfield;
      &:focus,
      &:active {
      }
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    &__count {
      display: flex;
      justify-content: center;
      margin-right: 8px;
      margin-left: 8px;
      color: var(--color-text-primary);
    }
    &__button {
      position: relative;
      height: 20px;
      width: 20px;
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      cursor: pointer;
      border-radius: 6px;
      box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
        0px 0px 1px rgba(33, 44, 51, 0.02);
      &:hover {
        border: 1px solid var(--color-accent-background);
      }
      &:active {
        background-color: var(--color-panel);
      }
    }
    &__icon {
      color: var(--color-text-secondary);
    }
  }
}
</styles>
