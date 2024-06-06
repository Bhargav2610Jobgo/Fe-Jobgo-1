<template>
  <div class="upgraded">
    <div class="upgraded__content">
      <CongratulationsImage />
      <h1 class="upgraded__header">Congratulations</h1>
      <p class="upgraded__text">
        You're now on the {{ route.query.tier }} plan, feel free to reach out if
        you have any questions. Happy hiring.
      </p>
      <hp-button primary to="/openings" label="Openings"></hp-button>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted } from "vue";
import { useRoute } from "vue-router";

// Components
import HpButton from "@/components/hp-button.vue";

// Composables
import useAuth from "@/composables/useAuth";
import { usePut } from "@/composables/useHttp";

// Assets
import CongratulationsImage from "@/assets/abstracts/decorations/congrats.svg";

const { plan } = useAuth();

const route = useRoute();

onMounted(async () => {
  if (route.query.tier) {
    const putQuota = usePut("self/quota");
    await putQuota.put({
      tier: route.query.tier,
    });
    plan.value = putQuota.data.value.quota.tier;
  }
});
</script>

<styles lang="scss">
.upgraded {
  @include pageContainer;
  overflow: visible;
  margin-bottom: 120px;
  &__header {
    font-weight: 500;
    @include text-h1;
  }
  &__text {
    max-width: 400px;
    color: var(--color-text-secondary);
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    gap: 12px;
  }
}
</styles>
