<template>
  <label :class="containerClasses">
    <input
      :class="switchClasses"
      type="checkbox"
      :disabled="isDisabled"
      :checked="modelValue"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span :class="switchLabel"></span>
    <span class="label">{{ label }}</span>
  </label>
</template>

<script setup>
import { watch, computed } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  label: {
    type: String,
  },
  standalone: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    value: false,
  },
  name: {
    type: String,
  },
  modelValue: Boolean,
});

const emits = defineEmits(["input"]);

const { value: modelValue, errorMessage } = useField(props.name, "", {
  standalone: props.standalone,
  initialValue: props.modelValue,
  validateOnValueUpdate: false,
});

const handleInput = (e) => {
  modelValue.value = e.target.checked;
  emits("input", modelValue);
};

watch(
  () => props.modelValue,
  (value) => {
    if (!props.standalone) {
      return;
    }
    modelValue.value = props.modelValue;
  }
);

const switchClasses = computed(() => {
  return {
    "hp-switch__input": true,
    "hp-switch__input--disabled": props.isDisabled,
  };
});

const switchLabel = computed(() => {
  return {
    "hp-switch__switch": true,
    "hp-switch__switch--disabled": props.isDisabled,
  };
});

const containerClasses = computed(() => {
  return {
    "hp-switch": true,
    "hp-switch--disabled": props.isDisabled,
  };
});
</script>

<style lang="scss">
.hp-switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  &--disabled {
    pointer-events: none;
  }
}

.hp-switch {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &--disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.hp-switch__switch {
  --switch-container-width: 34px;
  --switch-size: 24px;

  display: flex;
  align-items: center;
  position: relative;
  height: var(--switch-size);
  width: 36px;
  flex-basis: var(--switch-container-width);
  border-radius: var(--switch-size);
  background-color: var(--color-text-tertiary);
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);

  &--disabled {
    pointer-events: none;
    cursor: not-allowed;
  }
}

.hp-switch__input:focus + .hp-switch__switch {
  outline: var(--color-focus) solid 4px;
}

.hp-switch__input:active + .hp-switch__switch {
  outline: var(--color-focus) solid 4px;
}

.hp-switch__input--disabled,
.hp-switch--disabled,
.hp-switch__switch--disabled {
  outline: none !important;
}

.hp-switch__switch::before {
  content: "";
  position: absolute;
  transition: all 0.15s linear;
  left: 2px;
  height: calc(var(--switch-size) - 4px);
  width: calc(var(--switch-size) - 4px);
  /* Make the inner circle fully rounded */
  border-radius: 9999px;
  background-color: white;
}

.hp-switch__input:checked + .hp-switch__switch {
  background-color: var(--color-accent-background);
}

.hp-switch__input:checked + .hp-switch__switch::before {
  /* Move the inner circle to the right */
  transform: translateX(
    calc(var(--switch-container-width) - var(--switch-size))
  );
}
</style>
