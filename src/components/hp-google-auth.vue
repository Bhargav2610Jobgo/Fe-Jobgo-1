<template>
  <div class="hp-google-auth__container" ref="container">
    <div class="hp-google-auth" ref="googleContainer"></div>
    <div v-if="error" class="hp-google-auth__error">
      Error. Try logging in with your email and password.
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

// Composables
import { usePost } from "@/composables/useHttp";
import useAuth from "@/composables/useAuth";
import useGoogleAuth from "@/composables/useGoogleAuth";

const props = defineProps({
  isSignIn: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const route = useRoute();

const error = ref(null);
const googleContainer = ref(null);
const container = ref(null);
const emits = defineEmits(["handleSignIn"]);
const handleLogin = async (res) => {
  error.value = null;
  const { setUser, refreshToken } = useAuth();
  const postUser = usePost("sso");
  let payload = {
    sso: {
      provider: "google",
      token: res.credential,
    },
  };

  if (route.query?.token) {
    payload = { ...payload, invitation: route.query.token };
  }
  if (route.query?.ref) {
    payload = {
      ...payload,
      referrer: route.query.ref,
    };
  }
  await postUser.post(payload);

  if (postUser.error.value) {
    error.value = true;
    return;
  }

  window.lintrk("track", { conversion_id: 5220170 });
  setUser({ sessionToken: postUser.data.value.self.sessionToken });
  await refreshToken();
  router.push("/");
};

const { isInitialized } = useGoogleAuth();

onMounted(() => {
  if (!isInitialized.value) {
    const gapiKey = import.meta.env.VITE_GAPI_KEY;
    window.google.accounts.id.initialize({
      client_id: gapiKey,
      callback: handleLogin,
      context: "use",
    });
    isInitialized.value = true;
  }
  const width = container.value.getBoundingClientRect().width;
  window.google.accounts.id.renderButton(googleContainer.value, {
    width: width,
  });
});
</script>

<style lang="scss">
.hp-google-auth {
  max-width: 100%;
  &__container {
    width: 100%;
  }
  &__error {
    color: var(--color-error);
    margin-top: 4px;
    padding: 4px;
    font-size: 14px;
  }
}
</style>
