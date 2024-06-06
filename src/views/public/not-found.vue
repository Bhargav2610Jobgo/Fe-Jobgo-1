<template>
  <div>
    <router-link to="/" class="not-found__logo">
      <Logo />
    </router-link>
    <div class="not-found">
      <div class="not-found__container">
        <empty-state class="not-found__image"></empty-state>
        <div class="not-found__text">
          <span class="not-found__404">404</span>
          <div class="not-found__text-1">
            What you are looking for doesn't exist
          </div>
          <div>
            we recommend you head on over to
            <router-link class="not-found__link" to="/"
              >your dashboard</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EmptyState from "@/assets/abstracts/empty-state.svg";
import Logo from "@/assets/logo.svg";
</script>

<style lang="scss">
.not-found {
  @include pageContainer;
  display: flex;
  align-items: center;
  justify-content: center;
  &__container {
    display: flex;
    align-items: top;
    width: 552px;
  }
  &__logo {
    position: absolute;
    top: 16px;
    left: 50%;
    height: 48px;
    width: 48px;
  }
  &__image {
    width: 50%;
  }
  &__text {
    width: 50%;
    @include text-h3;
    font-weight: 300;
  }
  &__404 {
    font-weight: 500;
    @include text-h1;
    margin-bottom: 16px;
    color: var(--color-text-primary);
  }
  &__text-1 {
    margin-bottom: 16px;
  }
  &__link {
    text-decoration: underline;
  }
}
</style>
