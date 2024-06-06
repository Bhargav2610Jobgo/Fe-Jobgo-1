<template>
  <div
    :class="`hp-dropdown-list__dropdown-target  ${
      isDisabled && `hp-dropdown-list__disabled`
    }`"
    ref="dropdownTarget"
    @click="isFlyoutOpen = !isFlyoutOpen"
  >
    <div
      :class="`hp-dropdown-list__dropdown-target  ${
        isDisabled && `hp-dropdown-list__disabled`
      }`"
    >
      {{ label }}
    </div>
    <hp-icon
      v-if="!isDisabled && options.length !== 0"
      class="hp-dropdown-list__dropdown-target__icon"
      name="chevron-down"
    ></hp-icon>
    <transition name="flyout-transition">
      <div
        v-if="isFlyoutOpen && options.length !== 0"
        class="hp-dropdown-list__flyout"
      >
        <ol class="hp-dropdown-list__flyout__options">
          <li
            v-for="(option, index) in options"
            class="hp-dropdown-list__flyout__options__option"
            @click="emits('handleChange', option.value)"
          >
            <button
              class="hp-dropdown-list__flyout__options__button"
              type="button"
            >
              <div class="hp-dropdown-list__flyout__options__option__title">
                {{ option.value }}
              </div>
              <div class="hp-dropdown-list__flyout__options__option__desc">
                {{ option.description }}
              </div>
            </button>
          </li>
        </ol>
      </div>
    </transition>
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";

// Components
import HpIcon from "@/components/hp-icon.vue";

// Composables
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
  },
  isDisabled: {
    type: Boolean,
  },
});

const emits = defineEmits(["handleChange", "handleRemovalRequest"]);

const dropdownTarget = ref(null);
const isFlyoutOpen = ref(false);

onClickOutside(dropdownTarget, (event) => {
  if (!isFlyoutOpen.value) {
    return;
  }
  isFlyoutOpen.value = false;
});
</script>

<styles lang="scss">
.hp-dropdown-list {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  &__disabled {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &__name {
    display: flex;
    flex-direction: column;
    @include text-h5;
  }
  &__email {
    color: var(--color-text-secondary);
    @include text-h6;
  }
  &__role {
    margin-right: 12px;
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
  }
  &__dropdown-target {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    text-transform: capitalize;
    padding-right: 6px;
    &__view {
      margin-right: 4px;
      color: var(--color-text-secondary);
    }
    &--no-dropdown {
      opacity: 0.6;
      cursor: default;
    }
  }
  &__flyout {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    position: absolute;
    padding: 8px;
    right: 0;
    z-index: $z-index-1000;
    top: 30px;
    transition: all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &__items {
      display: flex;
      flex-direction: column;
      &__divider {
        width: 100%;
        border-top: 1px dashed var(--color-border);
        margin-top: 8px;
        margin-bottom: 8px;
      }
      &__item {
        padding: 8px 12px;
      }
    }
    &__options {
      display: flex;
      flex-direction: column;
      width: 100%;
      &__button {
        cursor: pointer;
        padding: 8px;
        border-radius: $border-radius-sm;
        outline: 0;
        background-color: var(--color-background);
        color: var(--color-text);
        border: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        display: flex;
        flex-direction: column;
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
      }
      &__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        color: var(--color-text-primary);
        width: 100%;
        flex-direction: column;
        &__title {
          font-size: 14px;
          font-weight: 500;
          text-transform: capitalize;
        }
        &__desc {
          font-size: 12px;
          color: var(--color-text-secondary);
          min-width: 230px;
          text-align: left;
        }
      }
    }
  }
}
</styles>
