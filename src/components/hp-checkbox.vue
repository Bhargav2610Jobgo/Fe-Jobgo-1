<template>
  <div class="hp-checkbox">
    <transition name="hp-checkbox__icon-transition">
      <hp-icon
        v-if="props.checked"
        class="hp-checkbox__icon"
        :size="18"
        name="check"
      />
    </transition>
    <input
      @input="(event) => $emit('update:checked', event.target.checked)"
      id="option1"
      type="checkbox"
      :checked="props.checked"
      value="option-1"
      checked
      :tabindex="tabindex"
    />
    <label class="hp-checkbox__label" for="option1"> </label>
  </div>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
const props = defineProps({
  checked: {
    type: [Boolean, Object],
  },
  tabindex: {
    type: Number,
    default: "1",
  },
});
</script>

<style lang="scss">
.hp-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 20px;
  height: 16px;
  &__icon {
    position: absolute;
    top: 0px;
    left: -1px;
    z-index: $z-index-100;
    color: var(--color-accent-forground);
    pointer-events: none;
  }
}
input[type="checkbox"] {
  position: absolute;
  left: -9999px;
  & + .hp-checkbox__label {
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 1px;
      width: 12px;
      height: 12px;
      border: 2px solid var(--color-text-tertiary);
      background: var(--color-background);
      border-radius: 4px;
      cursor: pointer;
      transition: border 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67),
        background-color 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }
    &.hp-checkbox__label:hover ::before {
      border-color: var(--color-accent-background);
    }
  }
  & + .hp-checkbox__label {
    &:focus {
      &::before {
        outline: 4px solid var(--color-focus);
      }
    }
    &:hover {
      &::before {
        border-color: var(--color-accent-background);
      }
    }
  }
  &:checked + .hp-checkbox__label::before {
    border-color: var(--color-accent-background);
    background-color: var(--color-accent-background);
  }
}
.hp-checkbox__icon-transition {
  transform: scale(1);
}
.hp-checkbox__icon-transition-enter-active,
.hp-checkbox__icon-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-checkbox__icon-transition-leave-active {
  transition-delay: 0.15s;
}
.hp-checkbox__icon-transition-enter-from,
.hp-checkbox__icon-transition-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
