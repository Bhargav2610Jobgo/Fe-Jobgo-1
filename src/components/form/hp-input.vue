<template>
  <div 
  :class="[containerClasses, {'hp-input__margin-bottom': marginBottom}]"
  >
    <label v-if="label" class="hp-input__label" :htmlFor="name"
      >{{ label }}
    </label>
    <div class="hp-input__input-container">
      <input
        ref="inputRef"
        :disabled="isDisabled"
        :class="[`hp-input__input hp-input__input--${variant}`,]"
        :name="name"
        :type="type"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :value="modelValue"
        v-on="validationListeners"
        v-bind="$attrs"
      />
      <hp-icon
        v-if="icon"
        class="hp-input__input-icon"
        :size="14"
        :name="icon"
      ></hp-icon>
      <hp-icon
        class="hp-input__input-icon hp-input__input-icon--password"
        v-if="isPassword"
        :name="passwordIcon"
        @click="isPasswordVisible = !isPasswordVisible"
        :size="16"
      ></hp-icon>
    </div>
    <transition name="hp-input__error-transition">
      <div v-if="errorMessage" class="hp-input__error">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
import { computed, ref } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    value: "normal",
  },
  standalone: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: "off",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  marginBottom:{
    type:Boolean,
    default:true
  }
});

const emits = defineEmits(["update:modelValue"]);

const {
  errorMessage,
  value: modelValue,
  handleChange,
} = useField(props.name, "", {
  standalone: props.standalone,
  validateOnValueUpdate: false,
  initialValue: props.modelValue,
});

const isPasswordVisible = ref(false);

const isPassword = props.type === "password";

const passwordIcon = computed(() =>
  isPasswordVisible.value ? "eye-closed" : "eye"
);

const type = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "text" : "password";
  } else if (props.type) {
    return props.type;
  } else {
    return "text";
  }
});

const inputRef = ref(null);
defineExpose({ inputRef });

const validationListeners = computed(() => {
  // If the field is valid or have not been validated yet
  // lazy
  if (!errorMessage.value) {
    return {
      change: handleChange,
      // disable `shouldValidate` to avoid validating on input
      input: (e) => {
        if (props.standalone) {
          modelValue.value = e.target.value;
          emits("update:modelValue", e.target.value);
        }
        handleChange(e, false);
      },
    };
  } else {
    return {
      change: handleChange,
      input: handleChange, // only switched this
    };
  }
});

const containerClasses = computed(() => {
  return {
    "hp-input": true,
    "hp-input--search": props.variant === "search",
    "hp-input--disabled": props.isDisabled,
    "hp-input--error": errorMessage.value,
    "hp-input--icon": props.icon || props.type === "password",
  };
});
</script>

<style lang="scss">
.hp-input {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  &__margin-bottom{
    margin-bottom: 24px;
  }
  &--search {
    margin-bottom: 0;
  }
  &--icon {
    .hp-input__input {
      padding-left: 30px;
    }
  }
  &--disabled {
    opacity: 0.4;
    .hp-input__input {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  &--error {
    .hp-input__input {
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
  &__input-icon {
    position: absolute;
    left: 0;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    &--password {
      cursor: pointer;
    }
  }
  &__error {
    color: var(--color-error);
    font-weight: 500;
  }


  &__input {
    color: var(--color-text-primary);
    background-color: inherit;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    padding: 8px 8px 8px 12px;
    line-height: 36px;
    max-height: 36px;
    width: 100%;
    transition: border-color 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    color: var(--color-text-primary);
    &--search {
      max-height: 32px;
      line-height: 32px;
    }
    &::placeholder {
      color: var(--color-text-secondary);
    }
    &:focus:not([disabled]),
    &:active:not([disabled]) {
      outline: 4px solid var(--color-focus) !important;
      border: 1px solid var(--color-accent-background);
    }
  }
}

.hp-input__error-transition {
  opacity: 1;
}
.hp-input__error-transition-enter-active,
.hp-input__error-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-input__error-transition-enter-from,
.hp-input__error-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
