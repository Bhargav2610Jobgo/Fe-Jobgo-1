<template>
  <div class="hp-multi-select">
    <hp-dropdown
      @onChange="handleDropdownChange"
      :isDisabled="isDisabled"
      :label="computedLabel"
    >
      <template v-slot:dropdown>
        <div v-if="searchable" class="hp-multi-select__flyout__search">
          <hp-input
            v-model="search"
            variant="search"
            icon="search"
            ref="searchInput"
            :name="name"
            placeholder="Search..."
            @input="handleAsyncSearch"
            standalone
          />
        </div>
        <ul class="hp-multi-select__flyout__options">
          <button
            v-if="optionsList.length > 0 && !isLoading"
            :class="`hp-multi-select__flyout__options__option ${
              isDisabledAndNotIncludedInModelValue(option) &&
              'hp-multi-select__flyout__options__option--disabled'
            }`"
            v-for="option in optionsList"
            @click="handleChangeEmit(option)"
            :tabindex="1"
          >
            {{ option.label }}
            <hp-checkbox
              class="hp-multi-select__checkbox"
              :checked="modelValue.find((o) => o.value === option.value)"
              :tabindex="-1"
            />
          </button>
          <div class="hp-multi-select__spinner" v-else-if="isLoading">
            <hp-spinner />
          </div>
          <div v-else>No options</div>
        </ul>
      </template>
    </hp-dropdown>
    <transition name="fade">
      <div v-if="errorMessage" class="">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { computed, ref, watchEffect } from "vue";
import HpDropdown from "@/components/hp-dropdown.vue";
import HpCheckbox from "@/components/hp-checkbox.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpSpinner from "@/components/hp-spinner.vue";

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
    default: null,
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
  maxItemsSelected: {
    type: Number,
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

watchEffect(() => {
  if (searchInput.value) {
    searchInput.value.inputRef.focus();
  }
});

const computedLabel = computed(() => {
  return props.selectedMessage
    ? `${props.modelValue.length} ${props.selectedMessage}`
    : props.label;
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

const isDisabledAndNotIncludedInModelValue = (option) => {
  if (!props.maxItemsSelected) {
    return false;
  }
  const isInModelValue = props.modelValue.some((item) => {
    return item.value === option.value;
  });
  return props.modelValue.length >= props.maxItemsSelected && !isInModelValue;
};

const handleChangeEmit = (change) => {
  if (isDisabledAndNotIncludedInModelValue(change)) {
    return;
  }

  let newValue = [...props.modelValue];
  if (newValue.find((v) => v.value === change.value)) {
    newValue = newValue.filter((item) => item.value !== change.value);
  } else {
    newValue.push(change);
  }
  emits("update:modelValue", newValue);
};
</script>

<style lang="scss">
.hp-multi-select {
  width: 100%;
  display: flex;
  &__checkbox {
    pointer-events: none;
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
    background-color: var(--color-background);
    padding: 0;
    z-index: $z-index-1000;
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
        color: var(--color-text);
        background-color: var(--color-background);
        border: 0;
        display: flex;
        text-align: left;
        width: 100%;
        transition: 0.15s ease-in-out opacity;
        &--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        &:hover {
          background-color: var(--color-forground-floating);
        }
        &:focus {
          background-color: var(--color-forground-floating);
          outline: none;
        }
      }
    }
  }
}
</style>
