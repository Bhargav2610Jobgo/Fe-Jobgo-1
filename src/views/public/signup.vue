<template>
  <div class="signup">
    <div class="signup__logo"><Logo /></div>
    <div class="signup__container">
      <div class="signup__image-container"></div>
      <h3 class="signup__title">Sign up for Jobgo</h3>
      <div class="signup__section signup__section--border">
        <form @submit="onSubmit">
          <hp-input name="fullName" placeholder="Type your full name" label="Full Name" />
          <hp-input name="email" placeholder="Type your email" label="Email" />
          <hp-input
            name="password"
            placeholder="Type your password"
            label="Password"
            type="password"
          />
          <hp-input
            name="confirmPassword"
            placeholder="Type your Confirm password"
            label="Confirm Password"
            type="password"
          />
          <div class="signup__checkbox-container__tos">
            By signing up, you agree to the
            <a
              class="signup__checkbox-container__link"
              target="_blank"
              href="https://www.hireproof.io/terms-of-service"
              >Terms of Service</a
            >
            and acknowledge our
            <a
              class="signup__checkbox-container__link"
              target="_blank"
              href="https://www.hireproof.io/privacy-policy"
              >Privacy Policy</a
            >
          </div>
          <div v-if="error" class="signup__error">{{ error }}</div>
          <hp-button
            :isLoading="isLoading"
            primary
            :isDisabled="!meta.valid"
            type="submit"
            label="Continue"
            fullWidth
          ></hp-button>
        </form>
        <!-- <div class="signup__section__or">OR</div> -->
      </div>
      <!-- <div class="signup__section">
        <hp-google-auth />
      </div> -->
    </div>
    <router-link
      class="signup__signin signup__checkbox-container__text"
      to="/signin"
      >Already have an account?
      <span class="signup__checkbox-container__link">Sign In</span></router-link
    >
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";

//Components
import HpGoogleAuth from "@/components/hp-google-auth.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpCheckbox from "@/components/form/hp-checkbox.vue";
import HpButton from "@/components/hp-button.vue";
import useAuth from "@/composables/useAuth";
import { useEncryption, useDecryption } from "@/composables/useEncryption";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";

const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters long")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
  //   "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character"
  // );

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required()
    .label("Email"),
    fullName: yup
    .string()
    .required()
    .label("Full Name"),
  password: passwordSchema.label("Password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const error = ref(null);

const { handleSubmit, setFieldError, meta, values } = useForm({
  validationSchema: schema,
  // validateOnMount:true,
  initialValues: {
    name: "",
    fullName:null,
    email: route.query.email,
    password: "",
    confirmPassword: "",
    terms: false,
  },
  
});

const postUsers = usePost("users");
const postLogin = usePost("self/login");

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const { email, password,fullName } = values;
  let encryptPassword = useEncryption(password);
  let payload = {
    user: {
      fullName,
      email,
      password: encryptPassword,
    },
  };
  console.log(payload);
  // if (route.query?.token) {
  //   payload = {
  //     ...payload,
  //     invitation: route.query.token,
  //   };
  // }
  // if (route.query?.ref) {
  //   payload = {
  //     ...payload,
  //     referrer: route.query.ref,
  //   };
  // }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  try {
    console.log(res.status);
   
    if(res.status==200){
      router.push({ path: "/confirm", params: { email:email } });
    }
    const data = await res.json();
    console.log(data);
    error.value = false;
    // const { setUser } = useAuth();
    // setUser(data.user, true);

    // window.lintrk("track", { conversion_id: 5220170 });
    // if (route.query.upgrade) {
    //   router.push("/upgrade");
    // } else {
    //   router.push("/");
    // }
    router.push({ path: "/confirm", params: { email:email } });
  } catch (error) {
    const error1={
      error:error
    }
    console.log("error1",error1);
    setFieldError("email", "Something went wrong");
    isLoading.value = false;
  }
});
</script>

<style lang="scss">
.signup {
  display: flex;
  flex-direction: column;
  padding: 12px;
  &__section {
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
  .signup {
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
