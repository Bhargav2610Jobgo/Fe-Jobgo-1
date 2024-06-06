<template>
  <teleport to="body">
    <div v-if="isOpen">
      <div class="hp-modal__overlay" @click="emits('close')"></div>
    </div>
    <transition name="hp-modal__modal-transition">
      <div v-if="isOpen" class="hp-modal__modal">
        <div class="hp-modal__modal__content__close">
          <hp-icon name="cross" :size="24" @click="emits('close')" />
        </div>
        <div class="hp-modal__modal__content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
import { watch } from "vue";
import { onKeyStroke } from "@vueuse/core";

const emits = defineEmits(["close"]);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

onKeyStroke("Escape", (e) => {
  emits("close");
});

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  },
  { immediate: true }
);
</script>
<style lang="scss">
.modal-open {
  overflow: hidden;
}
.hp-modal {
  &__overlay {
    position: fixed;
    z-index: 1200;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__modal {
    z-index: 1201;
    border-radius: $border-radius-lg;
    position: fixed;
    top: 16px;
    left: 16px;
    right: 16px;
    background: var(--color-background);
    &__content {
      position: relative;
      &__close {
        position: absolute;
        z-index: $z-index-10;
        top: 10px;
        right: 10px;
        cursor: pointer;
        color: var(--color-text-secondary);
      }
    }
  }
  @media (min-width: $breakpoint-tablet) {
    &__modal {
      max-width: 580px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.hp-modal__overlay-transition {
  transform: translateY(0);
}
.hp-modal__overlay-transition-enter-active,
.hp-modal__overlay-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-modal__overlay-transition-leave-active {
  transition-delay: 0.15s;
}

.hp-modal__overlay-transition-enter-from,
.hp-modal__overlay-transition-leave-to {
  opacity: 0;
}

.hp-modal__modal-transition {
  opacity: 1;
}
.hp-modal__modal-transition-enter-active,
.hp-modal__modal-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-modal__modal-transition-enter-active {
  transition-delay: 0.15s;
}
.hp-modal__modal-transition-enter-from,
.hp-modal__modal-transition-leave-to {
  opacity: 0;
}
</style>
