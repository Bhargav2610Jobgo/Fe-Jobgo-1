<template>
  <div :class="containerClasses">
    <label v-if="label" class="hp-input__label" :htmlFor="name"
      >{{ label }}
    </label>
    <div style="display: flex !important">
      <div
        class="hp-input__input-container1"
        style="display: flex !important; min-width: 100%"
      >
        <div
          class="country-list__country-list__dropdown-target"
          @click="isTemplateFlyoutOpen = !isTemplateFlyoutOpen"
          ref="templateDropdownTarget"
        >
          <div class="country-list__country-list__dropdown-target__view">
            {{ selectedCountry.emoji }}
          </div>
          <div class="country-list__country-list__dropdown-target__tag">
            {{ selectedCountry.phoneCode }}
          </div>
          <hp-icon
            class="country-list__country-list__dropdown-target__icon"
            name="chevron-down"
          ></hp-icon>
        </div>
        <transition name="flyout-transition">
          <div
            v-if="isTemplateFlyoutOpen"
            class="country-list__flyout country-list__flyout--left"
          >
            <ol class="country-list__flyout__options">
              <li
                v-for="(template, index) in countryList"
                :key="index"
                class="country-list__flyout__options__option"
              >
                <button
                  class="country-list__flyout__options__button"
                  :class="{
                    'active-class': selectedCountry.name == template.name,
                  }"
                  type="button"
                  @click="handleTemplateFilterChange(template)"
                >
                 
                  {{ template.emoji }}

                  {{ template.name }}
                </button>
              </li>
            </ol>
          </div>
        </transition>
        <input
          ref="inputRef"
          :disabled="isDisabled"
          @keypress="onlyNumberKey"
          :class="`hp-input__input hp-input__input--${variant}`"
          :name="name"
          type="text"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :value="modelValue"
          v-on="validationListeners"
          v-bind="$attrs"
        />
      </div>
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
import countryList from "@/utils/countryList.js";
import { useField } from "vee-validate";
import { onClickOutside } from "@vueuse/core";
const isTemplateFlyoutOpen = ref(false);
const templateDropdownTarget = ref(null);
const inputRef = ref(null);
const selectedCountry = ref({
  name: "Finland",
  code: "FI",
  emoji: "🇫🇮",
  phoneCode: "+358",
  unicode: "U+1F1EB U+1F1EE",
  image:
    "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FI.svg",
});
const onlyNumberKey = (evt) => {
  // Only ASCII character in that range allowed
  let ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
    evt.preventDefault();
};

onClickOutside(templateDropdownTarget, (event) => {
  if (!isTemplateFlyoutOpen.value) {
    return;
  }
  if (event.target.className.includes("country-list__flyout")) {
    return;
  }
  isTemplateFlyoutOpen.value = false;
});
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

const handleTemplateFilterChange = (template) => {
  selectedCountry.value = template;
  isTemplateFlyoutOpen.value = false;
  
};



defineExpose({ inputRef,selectedCountry });

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

<style scoped lang="scss">
.hp-input__input-container1:focus-within {
  outline: 4px solid var(--color-focus) !important;
  border: 1px solid var(--color-accent-background) !important;
}
.hp-input {
  &--search {
    margin-bottom: 0;
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
  &__input-container1 {
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    margin-bottom: 8px;
  }
  &__input-container {
    position: relative;
    border: 0px solid var(--color-border);
    // border-radius: $border-radius-sm;
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
  &__label {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  &__input {
    color: var(--color-text-primary);
    background-color: inherit;
    border: none;
    border-radius: $border-radius-sm;
    padding: 8px 8px 8px 12px;
    line-height: 36px;
    max-height: 36px;
    width: 100%;
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
      outline: none !important;
      border: none;
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
.country-list {
  &__country-list {
    &__dropdown-target {
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      border-right: 1px solid var(--color-border) !important;
      :first-letter {
        text-transform: uppercase;
      }
      &__view {
        margin-right: 4px;
        margin-left: 8px;
        color: var(--color-text-secondary);
      }
      &__tag {
        margin-left: 12px;
      }
    }
  }

  &__flyout {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    position: absolute;
    max-height: 300px;
    overflow-y: scroll;
    width: 256px;
    padding: 8px;
    z-index: $z-index-1000;
    top: 38px;
    transition: all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &--left {
      left: 10px;
    }
    &__options {
      &__button {
        // white-space: ;
        cursor: pointer;
        padding: 8px;
        border-radius: $border-radius-sm;
        outline: 0;
        background-color: var(--color-background);
        color: var(--color-text);
        border: 0;
        display: flex;
        align-items: center;
        width: 100%;

        &:hover {
          background-color: var(--color-forground-floating);
        }
        &:focus {
          background-color: var(--color-forground-floating);
          outline: none;
        }
        &--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        & img {
          margin-right: 10px;
        }
      }
    }
  }
}
@media (min-width: $breakpoint-tablet) {
  .country-list {
    position: absolute;
    transition: transform 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67),
      right 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    transform: translateX(0);
    right: 16px;
    width: 400px;
    min-height: calc(100vh - 120px);
    z-index: $z-index-10;
    padding: 20px;
    padding-bottom: 0px;
    background-color: var(--color-panel);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    top: initial;
    bottom: initial;
    left: initial;
    &__image-container__link {
      display: none;
    }
    &--left {
      right: 100%;
      transform: translateX(100%);
      display: block;
    }
  }
}
.active-class {
  background-color: var(--color-forground-floating) !important;
}
</style>
