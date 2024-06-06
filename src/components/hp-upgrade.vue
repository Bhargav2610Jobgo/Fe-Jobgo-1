<template>
  <router-link class="hp-upgrade" to="/upgrade">
    <hp-icon size="14" name="diamond"></hp-icon
    ><span class="hp-upgrade__text">Upgrade</span>
  </router-link>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
</script>

<style lang="scss">
.hp-upgrade {
  background-color: var(--yellow--500);
  color: var(--color-accent-forground);
  display: flex;
  align-items: center;
  border-radius: $border-radius-sm;
  padding: 6px;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s ease-in-out;
  height: 28px;
  &:hover {
    background-color: var(--yellow--400);
  }
  &__text {
    margin-left: 2px;
  }
}
</style>
