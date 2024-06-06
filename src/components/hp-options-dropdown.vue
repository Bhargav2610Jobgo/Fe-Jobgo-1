<template>
  <div
    class="hp-options-dropdown__flyout"
    ref="target"
    @click="isDropdownOpen = !isDropdownOpen"
  >
    <hp-icon name="options"></hp-icon>
    <transition name="flyout-transition">
      <div class="hp-options-dropdown__options" v-if="isDropdownOpen">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HpIcon from "@/components/hp-icon.vue";
import { onClickOutside } from "@vueuse/core";

const target = ref(null);
const isDropdownOpen = ref(false);

onClickOutside(target, (event) => {
  if (!isDropdownOpen.value) {
    return;
  }
  isDropdownOpen.value = false;
});
</script>

<style lang="scss">
.hp-options-dropdown {
  &__flyout {
    position: relative;
    display: flex;
    cursor: pointer;
  }
  &__options {
    @include flyout;
    top: 24px;
    right: 0;
    padding: 8px;
    position: absolute;
    border-bottom: 1px dashed var(--color-border);
    transition: 0.15s ease-in-out all;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
