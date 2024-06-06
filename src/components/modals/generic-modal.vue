<template>
  <div class="generic-modal">
    <div class="generic-modal__header">
      <h3 class="generic-modal__header__title">{{ title }}</h3>
      <p class="generic-modal__header__subtitle">
        {{ subtitle }}
      </p>
    </div>
    <div class="generic-modal__content">
      <slot></slot>
    </div>
    <div class="generic-modal__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
});
</script>

<style lang="scss">
.generic-modal {
  &__header {
    padding: 24px 16px;
    border-bottom: 1px dashed var(--color-border);
    &__title {
      font-size: 16px;
      line-height: 24px;
      letter-spacing: -0.015em;
    }
    &__subtitle {
      color: var(--color-text-secondary);
      &__link {
        cursor: pointer;
        text-decoration: underline;
        color: var(--color-text-primary);
      }
    }
  }
  &__content {
    padding: 24px 16px;
    border-bottom: 1px dashed var(--color-border);
    width: 100%;
    @include text-h5;
  }
  &__actions {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    &--two-button {
      justify-content: space-between;
    }
  }
}
</style>
