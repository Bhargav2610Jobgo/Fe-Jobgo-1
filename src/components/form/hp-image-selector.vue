<template>
  <div ref="target" class="hp-image-selector">
    <div class="hp-image-selector__label">Cover</div>
    <div class="hp-image-selector__wrapper" @click="isFlyoutOpen = true">
      <div class="hp-image-selector__wrapper__overlay">
        <hp-icon name="image" :size="20" />
      </div>
      <component
        :is="CoverDict[modelValue]"
        class="hp-image-selector__wrapper__image"
        role="img"
        :alt="`abstract cover #${modelValue}`"
      />
    </div>
    <transition name="hp-image-selector-transition">
      <div v-if="isFlyoutOpen" class="hp-image-selector__flyout">
        <div class="hp-image-selector__flyout__flyout-label">Select cover</div>
        <div class="hp-image-selector__flyout__flyout-container">
          <button
            v-for="(image, index) in Object.keys(CoverDict)"
            @click.prevent="handleImageSelect(index)"
            :class="`hp-image-selector__flyout__image-wrapper ${
              modelValue == index &&
              'hp-image-selector__flyout__image-wrapper--selected'
            }`"
          >
            <component
              :is="CoverDict[index]"
              class="hp-image-selector__flyout__image"
              role="img"
              :alt="`abstract cover #${modelValue}`"
            />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useField } from "vee-validate";
import HpIcon from "@/components/hp-icon.vue";
import { onClickOutside } from "@vueuse/core";

// Assets
import Cover0 from "@/assets/abstracts/covers/cover_0.svg";
import Cover1 from "@/assets/abstracts/covers/cover_1.svg";
import Cover2 from "@/assets/abstracts/covers/cover_2.svg";
import Cover3 from "@/assets/abstracts/covers/cover_3.svg";
import Cover4 from "@/assets/abstracts/covers/cover_4.svg";
import Cover5 from "@/assets/abstracts/covers/cover_5.svg";
import Cover6 from "@/assets/abstracts/covers/cover_6.svg";
import Cover7 from "@/assets/abstracts/covers/cover_7.svg";
import Cover8 from "@/assets/abstracts/covers/cover_8.svg";
import Cover9 from "@/assets/abstracts/covers/cover_9.svg";

const CoverDict = {
  0: Cover0,
  1: Cover1,
  2: Cover2,
  3: Cover3,
  4: Cover4,
  5: Cover5,
  6: Cover6,
  7: Cover7,
  8: Cover8,
  9: Cover9,
};

const props = defineProps({
  name: {
    type: String,
  },
  modelValue: {
    type: Number,
    default: 9,
  },
});

const { errorMessage, value: modelValue } = useField(props.name);

const emits = defineEmits(["update:modelValue", "input"]);

const target = ref(null);
const isFlyoutOpen = ref(false);

const initialValue = ref(props.modelValue);

onClickOutside(target, (event) => {
  if (!isFlyoutOpen.value) {
    return;
  }

  isFlyoutOpen.value = false;
});

const handleImageSelect = (index) => {
  modelValue.value = index;
  isFlyoutOpen.value = false;
  emits("input");
};
</script>

<style lang="scss">
.hp-image-selector {
  position: relative;

  &__label {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  &__flyout {
    @include flyout;
    position: absolute;
    left: 105%;
    top: -50%;
    transform: translate(0px, 50%);
    padding: 16px;
    box-shadow: 0px 16px 24px rgba(45, 51, 54, 0.06),
      0px 2px 6px rgba(33, 44, 51, 0.04), 0px 0px 1px rgba(33, 44, 51, 0.04);

    &__image-wrapper {
      border: $border;
      border-radius: $border-radius-sm;
      padding: 4px;
      width: 154px;
      cursor: pointer;
      background: transparent;
      &:hover {
        border-color: var(--color-accent-background);
      }
      &:focus {
        outline: 4px solid var(--color-focus);
      }
      &--selected {
        border-color: var(--color-accent-background);
      }
    }

    &__flyout-label {
      @include text-h5;
      margin-bottom: 12px;
    }
    &__flyout-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    &__image {
      display: flex;
      align-content: center;
      justify-content: center;
      height: 100%;
      overflow: hidden;
      border-radius: 6px;
      pointer-events: none;
    }
  }
  &__wrapper {
    cursor: pointer;
    background-color: var(--color-panel);
    position: relative;
    border: $border;
    border-radius: $border-radius-md;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    min-height: 90px;
    box-shadow: inset 0px 0px 4px rgba(33, 44, 51, 0.01),
      inset 0px 0px 48px rgba(33, 44, 51, 0.03);
    &__image {
      border-radius: $border-radius-sm;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    &__overlay {
      color: var(--color-background);
      position: absolute;
      top: 12px;
      right: 12px;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.12);
      color: var(--color-accent-forground);
      backdrop-filter: blur(24px);
      border-radius: $border-radius-sm;
    }
  }
}

.hp-image-selector-transition {
  transform: translateY(0);
}
.hp-image-selector-transition-enter-active,
.hp-image-selector-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-image-selector-transition-enter-from,
.hp-image-selector-transition-leave-to {
  opacity: 0;
  transform: translateY(calc(50% - 10px));
}
</style>
