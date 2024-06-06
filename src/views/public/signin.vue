<template>
  <div class="signin">
    <div class="signin__logo">
      <Logo />
    </div>
    <div class="signin__container">
      <div class="signin__section">
        <div class="signin__image-container"></div>
        <p class="signin__subtitle">Welcome back!</p>
        <h2 class="signin__title">Log into Jobgo</h2>
        <form @submit="onSubmit">
          <hp-input name="email" placeholder="Type your email" label="Email" />
          <div class="signin__password-container">
            <hp-input name="password" placeholder="Enter your password" label="Password" type="password" />
            <!-- <router-link
              tabIndex="-1"
              to="/forgot-password"
              class="signin__forgot-password"
              >Forgot password</router-link
            > -->
          </div>
          <hp-button :isLoading="postLogin.loading.value" primary fullWidth :isDisabled="!meta.dirty || !meta.valid"
            type="submit" label="Continue"></hp-button>
        </form>
        <!-- <div class="signup__section__or">OR</div> -->
      </div>
      <!-- <div class="signup__section">
        <hp-google-auth />
      </div> -->
    </div>
    <router-link class="signin__signup" to="/signup">Don't have an account?
      <span class="signin__signup__link">Sign up</span></router-link>
    <div class="forgot-password__tos">
      <a href="https://www.hireproof.io/terms-of-service" target="_blank" class="forgot-password__policy">
        Terms of service
      </a>
      <a href="https://www.hireproof.io/privacy-policy" target="_blank" class="forgot-password__policy">
        Privacy policy
      </a>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { useRouter } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";

//Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
// import HpGoogleAuth from "@/components/hp-google-auth.vue";
import useAuth from "@/composables/useAuth";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";

//composable
import { useEncryption } from "@/composables/useEncryption";
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required()
    .label("Email"),
  password: yup.string().min(6).required().label("Password"),
});

const { handleSubmit, isSubmitting, setFieldError, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

const router = useRouter();
const postLogin = usePost("self/login");

const onSubmit = handleSubmit(async (values) => {
  const { email, password } = values;
  const data = {
    credentials: { email, password: useEncryption(password) },
  };

  await postLogin.post(data);
  console.log("postLogin.data.value", postLogin.data.value);
  if (postLogin.data.value) {
    const { setUser } = useAuth();
    setUser(postLogin.data.value, true);
    router.push("/openings");
  } else {
    setFieldError("password", "Invalid email or password");
  }
});
</script>

<style lang="scss">
.signin {
  display: flex;
  flex-direction: column;
  padding: 24px;

  &__section {
    padding-bottom: 24px;
    position: relative;
    border-bottom: 1px solid var(--color-border);
  }

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

  &__signup {
    color: var(--color-text-secondary);
    font-weight: 400;
    margin: auto;
    margin-top: 24px;

    &__link {
      font-weight: 500;
      color: var(--color-text-primary);
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .signin {
    padding: 0;

    &__container {
      width: 450px;
    }

    &__logo {
      margin-top: 64px;
    }

    &__image-container {
      height: 446px;
      width: 588px;
    }
  }
}
</style>
