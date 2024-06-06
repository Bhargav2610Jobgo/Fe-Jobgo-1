<template>
  <div class="hp-tabs">
    <div
      class="hp-tabs__background"
      :style="{
        ...styles,
      }"
    ></div>
    <button
      v-for="(item, index) in props.options"
      @click="emits('update:modelValue', item.value)"
      :class="`hp-tabs__option hp-tabs__option--${index}`"
      :ref="
        (el) => {
          if (el) optionRefs[index] = el;
        }
      "
    >
      <hp-icon v-if="item.icon" :name="item.icon"></hp-icon>
      <div v-if="item.label">
        {{ item.label }}
      </div>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import HpIcon from "@/components/hp-icon.vue";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => {
      return { label: "", value: "", icon: "" };
    },
  },
});

const optionRefs = ref([]);

const styles = computed(() => {
  const correctIndex = props.options.findIndex((item) => {
    return item.value.toLowerCase() === props.modelValue.toLowerCase();
  });
  const width = optionRefs.value[correctIndex]?.clientWidth;
  const left = optionRefs.value[correctIndex]?.offsetLeft;
  return {
    width: `${width}px`,
    left: `${left}px`,
  };
});
</script>

<styles lang="scss" scoped>
.hp-tabs {
  position: relative;
  display: inline-flex;
  justify-content: space-evenly;
  background-color: var(--color-border);
  z-index: 2;
  padding: 4px;
  border-radius: 12px / 10px;
  &__option {
    background-color: transparent;
    cursor: pointer;
    border: none;
    line-height: 20px;
    transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    padding: 6px 16px;
    color: var(--color-text-secondary);
    border-radius: 10px / 12px;
    text-transform: capitalize;
    display: flex;
    &--selected {
      color: var(--color-text-primary);
      background-color: white;
    }
  }
  &__background {
    border-radius: 8px;
    top: 4px;
    z-index: $z-index-negative;
    height: 32px;
    position: absolute;
    background-color: var(--color-background);
    transition: left 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
      0px 0px 1px rgba(33, 44, 51, 0.02);
  }
}
</styles>
