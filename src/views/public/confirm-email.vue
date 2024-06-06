<template>
  <div class="confirm">
    <div class="confirm__logo"><Logo /></div>
    <div class="confirm__container">
      <div class="confirm__image-container"></div>
      <h3 class="confirm__title">JOBGO AI</h3>
      <div class="confirm__section confirm__section--border">
        <div class="confirm-email__logo"><Email /></div>
        <div class="confirm__subtitle">
          We've just dispatched an email to <!-- <b>{{ router?.params?.email }}</b> --> to validate your
          email address. Upon receiving the email, simply follow the enclosed
          link to finalize your registration process.
        </div>
      </div>
    </div>
    <!-- <router-link
      class="confirm__signin confirm__checkbox-container__text"
      to="/signin"
      >Already have an account?
      <span class="confirm__checkbox-container__link">Sign In</span></router-link
    > -->
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import Email from "@/assets/icons/email-verification.svg";

const router = useRouter();
const route = useRoute();
</script>

<style lang="scss">
.confirm {
  display: flex;
  flex-direction: column;
  padding: 12px;
  &-email__logo {
    margin: auto;
    // margin-bottom: 48px;
    // margin-top: 64px;
    height: 52px;
    width: 52px;
  }
  &__section {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    margin: 24px 0px;
    position: relative;
    &--border {
      //border-bottom: 1px solid var(--color-border);
      padding-bottom: 24px;
    }
    &__or {
      top: 100%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-transform: uppercase;
      color: var(--color-text-secondary);
      position: absolute;
      background: var(--color-background);
      padding: 0 4px;
      font-weight: 300;
      font-size: 12px;
      letter-spacing: 1.2px;
    }
  }
  &__subtitle {
    @include text-h4;
    font-weight: 500;
    margin-top: 24px;
    text-align: center;
    color: var(--color-text-secondary);
  }
  &__title {
    @include text-h3;
    font-weight: 500;
    margin-top: 12px;
    text-align: center;
    margin-bottom: 12px;
  }
  &__logo {
    margin: auto;
    margin-bottom: 24px;
    height: 48px;
    width: 48px;
  }
  &__container {
    margin: auto;
    padding: 12px 24px;
    width: 100%;
    border: $border;
    border-radius: $border-radius-md;
    background-color: var(--color-background);
    position: relative;
    box-shadow: $box-shadow;
  }
  &__image-container {
    display: flex;
    background-image: url("../../assets/abstracts/decorations/illustration.svg");
    position: absolute;
    top: 50%;
    height: 100%;
    width: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: $z-index-negative;
  }
 
  &__checkbox-container {
    display: flex;
    background-color: var(--color-background);
    border: none;
    align-items: center;
    width: 100%;
    @include text-h5;
    margin-bottom: 24px;
    &__tos {
      color: var(--color-text-secondary);
      font-weight: 400;
      margin-top: -12px;
      margin-bottom: 18px;
      font-size: 12px;
      padding: 0 2px;
    }
    &__text {
      color: var(--color-text-secondary);
      font-weight: 400;
      margin-top: -12px;
      margin-bottom: 18px;
    }
    &__link {
      font-weight: 500;
      color: var(--color-text-primary);
    }
    &:focus {
      outline: 4px solid var(--color-focus);
      border-radius: 4px;
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .confirm {
    padding: 0;
    &__container {
      width: 450px;
    }
    &__logo {
      margin-top: 64px;
    }
    &__image-container {
      display: flex;
      background-image: url("../../assets/abstracts/decorations/illustration.svg");
      position: absolute;
      top: 50%;
      height: 446px;
      width: 588px;
    }
  }
}
</style>
