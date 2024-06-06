<template>
  <div class="change-password">
    <div class="change-password__logo"><Logo /></div>
    <form
      @submit.prevent="handlePasswordReset"
      class="change-password__container"
    >
      <div class="change-password__image-container"></div>
      <h2 class="change-password__title">Reset password</h2>
      <p class="change-password__text">
        Don’t worry! Just fill in your email and we’ll send you a link to reset
        your password.
      </p>
      <hp-input
        name="password"
        placeholder="Enter your new password"
        label="Password"
        type="password"
      />
      <hp-input
        name="passwordConfirmation"
        placeholder="Confirm your new password"
        label="Password"
        type="password"
      />
      <hp-button
        primary
        fullWidth
        type="submit"
        :isLoading="postChangePassword.loading.value"
        :isDisabled="!meta.dirty || !meta.valid"
        label="Reset password"
      ></hp-button>
    </form>
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
import { useRouter, useRoute } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";

//Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";
import useToast from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const { setToast } = useToast();

const token = route.query.token;

const schema = yup.object().shape({
  password: yup.string().min(6).required().label("Password"),
  passwordConfirmation: yup
    .string()
    .required("Must enter password twice")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: { password: "", passwordConfirmation: "" },
});

const postChangePassword = usePost("self/reset-password");

const handlePasswordReset = handleSubmit(async (values) => {
  const payload = {
    password: {
      token: token,
      new: values.password,
    },
  };
  await postChangePassword.post(payload);
  router.push("/signin");
  setToast({
    type: "positive",
    title: "Well done!",
    message: `Your password has been updated`,
  });
});
</script>

<chode lang="scss">
.change-password {
  display: flex;
  flex-direction: column;
  &__subtitle {
    @include text-h3;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
  &__title {
    @include text-h3;
    font-weight: 500;
    margin-bottom: 24px;
  }
  &__logo {
    margin: auto;
    margin-bottom: 48px;
    margin-top: 64px;
    height: 48px;
    width: 48px;
  }
  &__container {
    margin: auto;
    padding: 24px;
    width: 460px;
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
    height: 446px;
    width: 588px;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: $z-index-negative;
  }
  &__password-container {
    position: relative;
  }
  &__forgot-password {
    position: absolute;
    right: 0;
    top: 0;
    @include text-h5;
  }
  &__text {
    margin-bottom: 16px;
  }
  &__signup {
  }
}
</chode>
