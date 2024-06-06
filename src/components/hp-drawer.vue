<template>
  <teleport to="body">
    <transition name="hp-drawer-overlay-transition">
      <div
        v-if="isOpen"
        class="hp-drawer__overlay"
        @click="emits('close')"
      ></div>
    </transition>
    <transition name="hp-drawer-transition">
      <div v-if="isOpen" class="hp-drawer__drawer">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch } from "vue";
import { onKeyDown } from "@vueuse/core";

const emits = defineEmits(["close"]);
const props = defineProps({
  isOpen: {
    type: [Boolean, Object],
    default: false,
  },
});

// Corresponds to scroll disabling while overlay is open, found in app scss
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.drawer-open {
  overflow: hidden;
}
.hp-drawer {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: $z-index-600;
  }

  &__drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: $drawer-max-width;
    height: 100%;
    background-color: var(--color-background);
    z-index: $z-index-601;
  }
}

@media (min-width: $breakpoint-tablet) {
  .hp-drawer {
    &__drawer {
      width: 33%;
    }
  }
}

.hp-drawer-overlay-transition-enter-active,
.hp-drawer-overlay-transition-leave-active {
  transition: opacity 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-drawer-overlay-transition-enter-from,
.hp-drawer-overlay-transition-leave-to {
  opacity: 0;
}

.hp-drawer-transition {
  transform: translateX(0) translateY(0);
}
.hp-drawer-transition-enter-active,
.hp-drawer-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-drawer-transition-enter-from,
.hp-drawer-transition-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
