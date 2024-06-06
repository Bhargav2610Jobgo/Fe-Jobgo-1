<template>
  <div class="forgot-password">
    <div class="forgot-password__logo"><Logo /></div>
    <div class="forgot-password__container">
      <div class="forgot-password__image-container"></div>
      <form @submit.pervent="handlePasswordReset" v-if="!isEmailSent">
        <h2 class="forgot-password__title">Forgot password</h2>
        <p class="forgot-password__text">
          Don't worry! Just fill in your email and we'll send you a link to
          reset your password.
        </p>
        <hp-input name="email" placeholder="Type your email" label="Email" />
        <hp-button
          primary
          fullWidth
          type="submit"
          :isLoading="postForgotPassword.loading.value"
          :isDisabled="!meta.dirty || !meta.valid"
          label="Reset password"
        ></hp-button>
      </form>
      <div v-else>
        <h2 class="forgot-password__title">Check your email</h2>
        <p>We sent you an email to reset your password.</p>
      </div>
    </div>
    <router-link class="forgot-password__link" to="/signin">
      <hp-icon name="arrow-left"></hp-icon>
      Back to sign in
    </router-link>
    <div class="forgot-password__tos">
      <a
        href="https://www.hireproof.io/terms-of-service"
        class="forgot-password__policy"
      >
        Terms of service
      </a>
      <a
        href="https://www.hireproof.io/terms-of-service"
        class="forgot-password__policy"
      >
        Privacy policy
      </a>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";

//Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required()
    .label("Email"),
});

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: schema,
  initialValues: { email: "" },
});

const isEmailSent = ref(false);
const postForgotPassword = usePost("self/forgot-password");

const handlePasswordReset = handleSubmit(async (values) => {
  const payload = {
    user: {
      email: values.email,
    },
  };
  await postForgotPassword.post(payload);
  isEmailSent.value = true;
});
</script>

<style lang="scss">
.forgot-password {
  display: flex;
  flex-direction: column;
  padding: 26px;
  &__title {
    @include text-h3;
    font-weight: 500;
    margin-bottom: 24px;
  }
  &__logo {
    margin: auto;
    margin-bottom: 48px;
    height: 48px;
    width: 48px;
  }
  &__container {
    margin: auto;
    padding: 24px;
    width: 100%;
    border: $border;
    border-radius: $border-radius-md;
    background-color: var(--color-background);
    position: relative;
    box-shadow: $box-shadow;
  }
  &__text {
    margin-bottom: 16px;
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
  &__link {
    margin: auto;
    margin-top: 64px;
    display: flex;
    align-items: center;
  }
  &__tos {
    display: flex;
    justify-content: space-around;
    max-width: 100%;
    margin-top: 80px;
  }
  &__policy {
    &:first-child {
      margin-left: 0;
    }
    margin-left: 24px;
    @include text-h5;
  }
}

@media (min-width: $breakpoint-tablet) {
  .forgot-password {
    padding: 0;
    &__logo {
      margin-top: 64px;
    }
    &__container {
      width: 460px;
    }
    &__image-container {
      display: flex;
      background-image: url("../../assets/abstracts/decorations/illustration.svg");
      position: absolute;
      top: 50%;
      height: 446px;
      width: 588px;
    }
    &__tos {
      max-width: 450px;
      margin: auto;
      margin-top: 120px;
    }
  }
}
</style>
