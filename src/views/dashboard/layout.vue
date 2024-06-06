<template>
  <div>
    <hp-header></hp-header>
    <main class="main">
      <router-view class="router-view" v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script setup>
// Components
import HpHeader from "@/components/hp-header.vue";
import useAuth from "@/composables/useAuth";

import useToast from "@/composables/useToast";

const { setToast } = useToast();

const { user } = useAuth();
if (user.value.user && !user.value.user.verified) {
  setToast({
    type: "negative",
    title:
      "We've sent you an email with a link to verify your account.  Please verify",
    duration: 10000,
  });
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  // max-width: 1400px;
  position: relative;
  margin: auto;
  padding-top: $header-height;
}

.router-view {
  width: 100%;
}
</style>
