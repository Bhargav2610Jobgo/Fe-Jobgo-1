<template>
  <div class="hp-reports-header">
    <div class="hp-reports-header__left">
      <a
        v-if="!isLoggedIn"
        class="hp-reports-header__logo"
        target="_blank"
        href="https://hireproof.io/"
        ><Logo></Logo
      ></a>
      <router-link
        v-else
        class="hp-reports-header__logo"
        to="/"
        href="https://hireproof.io/"
        ><Logo></Logo
      ></router-link>
    </div>
  </div>
</template>

<script setup>
import Logo from "@/assets/logo.svg";

import useAuth from "@/composables/useAuth";
const { user } = useAuth();
const isLoggedIn = user;
</script>

<style lang="scss" scoped>
.hp-reports-header {
  width: 100%;
  display: flex;
  padding: 24px;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background);
  height: 90px;
  &__logo {
    display: flex;
    width: 32px;
  }
}
</style>
