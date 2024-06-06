<template>
  <div class="hp-tagger" ref="target">
    <div class="hp-tagger__target" @click="handleOpenFlyout">
      <button type="button" tabIndex="0" class="hp-tagger__target__button">
        <hp-icon
          :class="`
          hp-tagger__target__button__add-icon
            ${isValueEmpty && 'hp-tagger__target__button__icon'}
          `"
          name="plus"
          size="14"
        ></hp-icon>
        <div v-if="isValueEmpty">{{ label }}</div>
      </button>
      <transition name="flyout-transition">
        <div
          :style="{
            top: `${flyoutTop}px`,
          }"
          class="hp-tagger__flyout"
          v-if="isFlyoutOpen"
        >
          <div v-if="searchable" class="hp-tagger__flyout__search">
            <hp-input
              v-model="search"
              variant="search"
              icon="search"
              ref="searchInput"
              :name="name"
              standalone
              placeholder="Search..."
              @input="handleAsyncSearch"
            />
          </div>
          <ul class="hp-tagger__flyout__options">
            <div v-if="!isLoading">
              <button
                class="
                  hp-tagger__flyout__options__option
                  hp-tagger__flyout__options__option--add
                "
                v-if="
                  search.length > 2 &&
                  !options.some(
                    (e) => e.label.toLowerCase() === search.toLowerCase()
                  )
                "
                type="button"
                @click="addNewSkill"
              >
                <hp-icon
                  class="hp-tagger__flyout__options__option__add-icon"
                  name="plus"
                  size="14"
                ></hp-icon>
                {{ `Add "${search}"` }}
              </button>
              <button
                v-if="optionsList.length > 0"
                :class="`hp-tagger__flyout__options__option ${
                  isDisabled(option) &&
                  'hp-tagger__flyout__options__option--disabled'
                }`"
                v-for="option in optionsList"
                @click="handleChangeEmit(option)"
                type="button"
              >
                {{ option.label }}
                <hp-checkbox
                  class="hp-tagger__checkbox"
                  :checked="modelValue.find((v) => v.value === option.value)"
                  :tabindex="-1"
                />
              </button>
            </div>
            <div class="hp-tagger__spinner" v-else-if="isLoading">
              <hp-spinner />
            </div>
          </ul>
        </div>
      </transition>
    </div>
    <div class="hp-tagger__tagged-skills">
      <div v-for="item in modelValue" class="hp-tagger__tagged-skills__skill">
        <div class="hp-tagger__tagged-skills__skill__label">
          {{ item.label }}
        </div>
        <div
          class="hp-tagger__tagged-skills__skill__icon"
          @click="handleChangeEmit(item)"
        >
          <hp-icon name="cross" :size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { computed, ref, watch, watchEffect } from "vue";
import { useField } from "vee-validate";
import { useElementBounding } from "@vueuse/core";
import { onClickOutside } from "@vueuse/core";
import { usePost } from "@/composables/useHttp";

// Components
import HpCheckbox from "@/components/hp-checkbox.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpButton from "@/components/hp-button.vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  placeholder: {
    type: String,
  },
  options: {
    type: [Array, Function],
    default: () => [],
    required: true,
  },
  modelValue: {
    default: [],
  },
  name: {
    type: String,
  },
  onSearch: {
    type: Function,
    required: false,
    default: () => {},
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  selectedMessage: {
    type: String,
    default: null,
  },
  closeOnSelect: {
    type: Boolean,
    default: true,
  },
  searchable: {
    type: Boolean,
  },
  label: {
    type: String,
  },
  standalone: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
  },
});

const {
  value: inputValue,
  errorMessage,
  handleChange,
  handleInput,
} = useField(props.name, undefined, {
  initialValue: props.modelValue,
  validateOnValueUpdate: false,
  standalone: props.standalone,
});

const search = ref("");
const isLoading = ref(false);
const searchInput = ref(null);
const isFlyoutOpen = ref(false);
const target = ref(null);
const isAddingNewSkill = ref(false);

onClickOutside(target, (event) => {
  if (!isFlyoutOpen.value) {
    return;
  }
  isFlyoutOpen.value = false;
});

watchEffect(() => {
  if (searchInput.value) {
    searchInput.value.inputRef.focus();
  }
});

let timeout = null;

const handleAsyncSearch = async () => {
  if (!props.onSearch) {
    return;
  }
  clearTimeout(timeout);
  isLoading.value = true;
  timeout = setTimeout(async () => {
    await props.onSearch(search.value);
    isLoading.value = false;
  }, 500);
};

const validationListeners = computed(() => {
  if (!errorMessage.value) {
    return {
      blur: handleChange,
      change: handleChange,
      input: handleInput,
    };
  }

  return {
    blur: handleChange,
    change: handleChange,
    input: handleChange,
  };
});

const handleDropdownChange = (isOpen) => {
  //todo figure out ref
};

const optionsList = computed(() => {
  if (!props.onSearch && search.value !== "") {
    return props.options.filter((item) => {
      return item.toLowerCase().includes(search.value.toLowerCase());
    });
  } else {
    return props.options;
  }
});

const isValueEmpty = computed(() => {
  return props.modelValue.length === 0;
});

const handleChangeEmit = (change) => {
  let newValue = [...props.modelValue];
  if (newValue.find((v) => v.value === change.value)) {
    newValue = newValue.filter((item) => item.value !== change.value);
  } else {
    if (props.max && newValue.length >= props.max) {
      return;
    }
    newValue.push(change);
  }
  inputValue.value = newValue;
  emits("update:modelValue", newValue);
};

const magicNumber = 60;
const handleOpenFlyout = () => {
  isFlyoutOpen.value = true;
  flyoutTop.value = target.value?.getBoundingClientRect().top - magicNumber;
};
const flyoutTop = ref(0);
const { top } = useElementBounding(target);
watch(top, (newValue) => {
  flyoutTop.value = newValue - magicNumber;
});

const isDisabled = (option) => {
  const isIncluded = props.modelValue.find((v) => v.value === option.value);
  const isMax = props.max && props.modelValue.length >= props.max;
  return !isIncluded && isMax;
};

const addNewSkill = async () => {
  isAddingNewSkill.value = true;
  const postSkill = usePost("skills");
  await postSkill.post({
    skill: {
      name: search.value,
      type: "technical",
    },
  });
  const newSkill = {
    value: postSkill.data.value.skill.reference,
    label: postSkill.data.value.skill.name,
  };
  handleChangeEmit(newSkill);
  isAddingNewSkill.value = false;
  handleAsyncSearch();
  searchInput.value.inputRef.focus();
};
</script>

<style lang="scss">
.hp-tagger {
  display: flex;
  &__checkbox {
    pointer-events: none;
  }
  &__tagged-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    &__skill {
      background-color: var(--color-border-subtle);
      border: $border;
      border-radius: $border-radius-sm;
      display: flex;
      white-space: nowrap;
      &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        color: var(--color-text-secondary);
        border-left: 1px solid var(--color-border);
        cursor: pointer;
      }
      &__label {
        padding: 4px 8px;
        @include text-h6;
        font-weight: 500;
        color: var(--color-text-secondary);
      }
    }
  }
  &__target {
    &__button {
      display: flex;
      cursor: pointer;
      align-items: center;
      margin-right: 6px;
      border: 1px dashed var(--color-border);
      border-radius: $border-radius-sm;
      padding: 6px;
      color: var(--color-text-secondary);
      height: 28px;
      background-color: var(--color-background);
      &:focus {
        outline: 4px solid var(--color-focus);
      }
      &__icon {
        margin-right: 6px;
      }
      &:hover {
        background-color: var(--color-border-subtle);
      }
    }
  }
  &__spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  &__flyout {
    border-radius: $border-radius-md;
    border: $border;
    background-color: var(--color-background);
    padding: 0;
    z-index: $z-index-1000;
    position: absolute;
    right: calc(100% + 10px);
    transform: translate3d(0, 0, 0);
    &__search {
      padding: 8px 8px 0px 8px;
      border-bottom: 1px dashed var(--color-border);
    }
    &__options {
      min-width: 256px;
      padding: 8px;
      overflow-y: scroll;
      max-height: 300px;
      &::-webkit-scrollbar {
        display: none;
      }
      &__option {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-radius: $border-radius-sm;
        outline: 0;
        background-color: var(--color-background);
        border: 0;
        display: flex;
        text-align: left;
        color: var(--color-text-primary);
        width: 100%;
        &__add-icon {
          margin-right: 6px;
        }
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
        &--add {
          justify-content: flex-start;
        }
      }
    }
  }
  &__add-skill {
    display: flex;
    flex-direction: column;
    color: var(--color-text-secondary);
    padding: 12px;
    &__button {
      display: flex;
    }
    &__text {
      margin-bottom: 12px;
    }
  }
}
</style>
