<template>
  <div class="signup">
    <div class="signup__logo"><Logo /></div>
    <div class="signup__container">
      <div class="signup__image-container"></div>
      <h3 class="signup__title">Complete Profile</h3>
      <div class="signup__section signup__section--border">
        <form @submit="onSubmit">
          <hp-input
            name="company_name"
            placeholder="Type your Company Name"
            label="Company Name"
          />
          <hp-input
            name="companyUrl"
            placeholder="Type your Company Website"
            label="Company Website"
          />
          <!-- {{ phone?.selectedCountry?.phoneCode }} -->
          <hp-phone
            ref="phone"
            name="company_contact"
            placeholder="Type your Company Contact"
            label="Company Contact"
          />
          <hp-input
            name="company_location"
            placeholder="Type your Company Location"
            label="Company Location"
          />
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
import HpPhone from "@/components/form/hp-phone.vue";
import HpButton from "@/components/hp-button.vue";
import useAuth from "@/composables/useAuth";
import Logo from "@/assets/logo.svg";

//Hooks
import { usePost } from "@/composables/useHttp";
const phone = ref("");
const schema = yup.object().shape({
  company_name: yup.string().required().label("Company Name"),
  companyUrl: yup.string().required().label("Company Website"),
  company_contact: yup.number().required().label("Company Contact"),
  company_location: yup.string().required().label("Company Location"),
});

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const error = ref(null);
const completeRegistration = usePost('company');
const { handleSubmit, setFieldError, meta, values } = useForm({
  validationSchema: schema,
  initialValues: {
    companyUrl: null,
    company_name: null,
    company_contact: null,
    company_location: null,
  },
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const { company_name, company_contact, company_location,companyUrl } = values;
  let payload = {
    userId: route.params?.userid,
    companyUrl: companyUrl,
    company_name: company_name,
    company_contact: `${phone.value.selectedCountry?.phoneCode}${company_contact}`,
    company_location: company_location,
  };


  // await completeRegistration.post(payload);
  // console.log("completeRegistration",completeRegistration.data)
  
  // // if (route.query?.token) {
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
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  try {
    console.log(res);
    if(res.status==200){
      router.push({ path: "/signin" });
    }
    const data = await res.json();
    error.value = false;
    const { setUser } = useAuth();
    setUser(data.user, true);

    // window.lintrk("track", { conversion_id: 5220170 });
    // if (route.query.upgrade) {
    //   router.push("/upgrade");
    // } else {
    //   router.push("/");
    // }
  } catch (error) {
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
