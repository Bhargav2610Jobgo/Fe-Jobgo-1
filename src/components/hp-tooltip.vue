<template>
  <div :class="`hp-tooltip__container hp-tooltip__container--${position}`">
    <div @mouseleave="handleHoverOut" @mouseenter="handleHoverEnter">
      <slot />
    </div>
    <transition :name="`hp-tooltip-${position}-transition`">
      <div
        v-if="isHovered && !isDisabled"
        :class="`hp-tooltip hp-tooltip--${position}`"
      >
        <div :class="`hp__tooltip-arrow hp__tooltip-arrow--${position}`"></div>
        <div v-if="isHovered" class="hp-tooltip__content">
          <slot name="content" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  delay: {
    type: Number,
    default: 150,
  },
  position: {
    type: String,
    default: "top",
  },
});

const isHovered = ref(false);

let timeout = null;
const handleHoverOut = () => {
  if (props.isDisabled) {
    return;
  }
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isHovered.value = false;
  }, 150);
};
const handleHoverEnter = () => {
  if (props.isDisabled) {
    return;
  }
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isHovered.value = true;
  }, props.delay);
};
</script>

<style lang="scss">
.hp-tooltip {
  position: absolute;
  padding: 12px 12px;
  border-radius: $border-radius-lg;
  left: 50%;
  z-index: $z-index-1000;
  background-color: var(--color-tooltip);
  color: var(--color-accent-forground);
  filter: drop-shadow(0px 4px 8px rgba(33, 44, 51, 0.02))
    drop-shadow(0px 0px 1px rgba(33, 44, 51, 0.02));
  max-width: 300px;

  &__container {
    position: relative;
    display: inline-flex;
    cursor: pointer;
  }
  &__content {
    width: max-content;
    max-width: 240px;
  }
  &--top {
    top: -10px;
    transform: translateX(-50%) translateY(-100%);
  }

  &--bottom {
    top: 100%;
    transform: translateX(-50%) translateY(10px);
  }
}

.hp__tooltip-arrow {
  display: block;
  height: 12px;
  width: 12px;
  background-color: inherit;
  border: inherit;
  position: absolute;
  left: calc(50% - 6px);
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  border-radius: 0 0 0 4px;
  &--bottom {
    transform: rotate(135deg);
    top: -6px;
  }
  &--top {
    transform: rotate(315deg);
    bottom: -6px;
  }
}

.hp-tooltip-top-transition {
  transform: translateX(-50%);
}
.hp-tooltip-top-transition-enter-active,
.hp-tooltip-top-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-tooltip-top-transition-enter-from,
.hp-tooltip-top-transition-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-110%) scale(0.9);
}

.hp-tooltip-bottom-transition {
  transform: translateX(-50%);
}
.hp-tooltip-bottom-transition-enter-active,
.hp-tooltip-bottom-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-tooltip-bottom-transition-enter-from,
.hp-tooltip-bottom-transition-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(15px) scale(0.9);
}
</style>
