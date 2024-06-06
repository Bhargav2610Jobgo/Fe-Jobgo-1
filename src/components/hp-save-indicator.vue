<template>
  <hp-tooltip class="hp-save-indicator__tooltip" :delay="500" position="bottom">
    <div class="hp-save-indicator">
      <transition name="hp-save-indicator-transition" mode="out-in">
        <hp-spinner v-if="showLoading"></hp-spinner>
        <div v-else>
          <hp-icon
            class="hp-save-indicator__error"
            v-if="!meta.valid"
            size="16"
            name="clean"
          ></hp-icon>
          <hp-icon size="16" v-else name="check-circle"></hp-icon>
        </div>
      </transition>
    </div>
    <template #content>{{
      showLoading ? "Saving" : "All changes saved"
    }}</template>
  </hp-tooltip>
</template>

<script setup>
import { watch, ref } from "vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpTooltip from "@/components/hp-tooltip.vue";

const startTime = ref(null);

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  meta: {
    type: Object,
  },
});

const showLoading = ref(false);

watch(
  () => props.isLoading,
  () => {
    if (props.isLoading) {
      showLoading.value = true;
      startTime.value = Date.now();
    } else {
      if (Date.now() - startTime.value > 300) {
        showLoading.value = false;
      } else {
        setTimeout(() => {
          showLoading.value = false;
        }, 300 - (Date.now() - startTime.value));
      }
    }
  }
);
</script>

<style lang="scss">
.hp-save-indicator {
  height: 32px;
  display: flex;
  padding: 6px;
  border: $border;
  border-radius: $border-radius-sm;
  align-items: center;
  &__tooltip {
    cursor: default;
  }
  &__error {
    color: var(--color-error);
  }
}
</style>
