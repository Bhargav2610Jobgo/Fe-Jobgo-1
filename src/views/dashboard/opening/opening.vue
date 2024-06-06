<template>
  <div>
    <router-view v-slot="{ Component }">
      <component v-if="opening.reference" :opening="opening" :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
// Vendor
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// Composables
import { useGet } from "@/composables/useHttp";
import useOpenings from "@/composables/useOpenings";
import useAuth from "@/composables/useAuth";

const interview = ref(null);
const route = useRoute();

const { fetchOpening, opening } = useOpenings();
const { user } = useAuth();

watch(
  () => route.params.openingRef,
  async (newOpeningRef) => {
    if (!newOpeningRef) {
      return;
    }
    if (!user) {
      return;
    }
    await fetchOpening(newOpeningRef);
  },
  { immediate: true }
);

watch(
  () => route.params.interviewRef,
  async (newOpeningRef) => {
    if (route.params.interviewRef) {
      const getInterview = useGet(`templates/${route.params.interviewRef}`);
      await getInterview.get();
      interview.value = getInterview.data.value;
    }
  },
  { immediate: true }
);
</script>
