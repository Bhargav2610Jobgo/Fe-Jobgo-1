<template>
  <div class="verify">
    <div class="verify__logo"><Logo /></div>
    <div class="verify__container">
      <div class="verify__image-container"></div>
      <h3 class="verify__title">Verify and set password</h3>
      <div class="verify__section verify__section">
        <form @submit="handleVerify">
          <hp-input name="email" label="Email" :isDisabled="true" />
          <hp-input
            name="name"
            autocomplete="name"
            placeholder="Type your name"
            label="Name"
          />
          <hp-input
            name="password"
            type="password"
            placeholder="Type your password"
            label="Password"
          />
          <hp-input
            name="password2"
            type="password"
            placeholder="Repeat your password"
            label="Repeat your password"
          />
          <hp-button
            :isLoading="isLoading"
            primary
            :isDisabled="!meta.dirty || !meta.valid"
            type="submit"
            label="Continue"
            fullWidth
          ></hp-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";

//Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import useAuth from "@/composables/useAuth";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";

const { refreshToken, setUser } = useAuth();

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  password: yup.string().min(8).required().label("Password"),
  password2: yup
    .string()
    .label("Confirm password")
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const { handleSubmit, setFieldValue, meta, values } = useForm({
  validationSchema: schema,
  initialValues: {
    name: "",
    email: route.query.email,
    password: "",
    terms: false,
  },
});

const handleVerify = handleSubmit(async (values) => {
  isLoading.value = true;
  const postVerify = usePost("self/verify");
  const tokenType = route.query.verification
    ? route.query.verification
    : route.query.invitation;
  await postVerify.post({
    verification: {
      user: {
        name: values.name,
        password: values.password,
      },
      token: tokenType,
    },
  });
  setUser({ sessionToken: postVerify.data.value.self.sessionToken });
  refreshToken();
  router.push("/");
});
</script>

<style lang="scss">
.verify {
  display: flex;
  flex-direction: column;
  padding: 12px;
  &__section {
    margin: 24px 0px;
    position: relative;
    &--border {
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 24px;
    }
    &__or {
      top: 100%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-transform: uppercase;
      color: var(--color-text-secondary);
      position: absolute;
      background: white;
      padding: 0 4px;
      font-weight: 300;
      font-size: 12px;
      letter-spacing: 1.2px;
      box-shadow: 0px 0px 24px 24px rgb(255 255 255 / 75%);
    }
  }
  &__subtitle {
    @include text-h3;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
  &__title {
    @include text-h3;
    font-weight: 500;
    margin-top: 12px;
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
  &__password-container {
    position: relative;
  }
  &__forgot-password {
    position: absolute;
    right: 0;
    top: 0;
    @include text-h5;
  }
  &__error {
    color: var(--color-error);
    margin-bottom: 16px;
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
  &__signin {
    margin: auto;
    margin-top: 32px;
  }
  &__error {
    color: var(--color-error);
  }
}

@media (min-width: $breakpoint-tablet) {
  .verify {
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
