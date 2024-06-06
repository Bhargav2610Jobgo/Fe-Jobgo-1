<template>
  <div :class="containerClasses">
    <label v-if="label" class="hp-textarea__label" :htmlFor="name"
      >{{ label }}
    </label>
    <textarea
      :class="`hp-textarea__input`"
      :autofocus="autofocus"
      :name="name"
      ref="inputRef"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="isDisabled"
      v-on:input="handleInput"
      :rows="rows"
      :maxlength="maxlength"
    ></textarea>
    <transition name="hp-textarea__error-transition">
      <div class="hp-textarea__error" v-if="errorMessage">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  label: String,
  modelValue: String,
  name: String,
  type: String,
  maxlength: String,
  placeholder: {
    type: String,
    default: "",
  },
  autofocus: {
    type: Boolean,
    default:false,
  },
  isDisabled: {
    type: Boolean,
    value: false,
  },
  rows: {
    type: [Number, String],
    default: 3,
  },
});

const emits = defineEmits(["input"]);

const { value: modelValue, errorMessage } = useField(props.name);

const inputRef = ref(null);
defineExpose({ inputRef });

const handleInput = (e) => {
  modelValue.value = e.target.value;
  emits("input", modelValue);
};

const containerClasses = computed(() => {
  return {
    "hp-textarea": true,
    "hp-textarea--disabled": props.isDisabled,
    "hp-textarea--error": errorMessage.value,
  };
});
</script>

<style lang="scss">
.hp-textarea {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  margin-bottom: 24px;
  &--disabled {
    opacity: 0.4;
    .hp-input__input {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  &--error {
    .hp-textarea__input {
      border: 1px solid var(--color-error);
      &::placeholder {
        color: var(--color-text-secondary);
      }
      &:focus:not([disabled]),
      &:active:not([disabled]) {
        outline: 4px solid var(--color-focus);
        border: 1px solid var(--color-error);
      }
    }
  }
  &__input-container {
    position: relative;
    margin-bottom: 8px;
  }
  &__error {
    color: var(--color-error);
    font-weight: 500;
  }
  &__label {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  &__input {
    resize: none;
    background-color: inherit;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    padding: 12px 16px;
    width: 100%;
    transition: border-color 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    color: var(--color-text-primary);
    &::-webkit-scrollbar {
      display: none;
    }
    &::placeholder {
      color: var(--color-text-secondary);
    }
    &:focus:not([disabled]),
    &:active:not([disabled]) {
      outline: 4px solid var(--color-focus);
      border: 1px solid var(--color-accent-background);
    }
  }
}

.hp-textarea__error-transition {
  opacity: 1;
}
.hp-textarea__error-transition-enter-active,
.hp-textarea__error-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-textarea__error-transition-enter-from,
.hp-textarea__error-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
