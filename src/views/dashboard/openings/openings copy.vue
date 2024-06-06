<template>
  <div class="openings">
    <transition name="candidate-list-transition" mode="in-out" appear>
      <div v-if="isCandidateListOpen" class="candidate-list">
        <candidate-list :isCandidateDetailsOpen="isCandidateDetailsOpen" />
      </div>
    </transition>
    <div :class="`view`">
      <transition
        class="candidate-details"
        name="candidate-details-transition"
        appear
      >
        <candidate-details
          v-if="isCandidateDetailsOpen"
          :isCandidateDetailsOpen="isCandidateDetailsOpen"
        ></candidate-details>
      </transition>
      <transition
        :class="`openingslist ${!isCandidateListOpen && 'openingslist--empty'}`"
        name="openings-list-transition"
      >
        <div v-if="!isCandidateDetailsOpen" class="opening-list">
          <h2 class="openings__title">Openings</h2>
          <p class="openings__subtitle">
            Manage your openings or quickly create new ones
          </p>
          <hp-tabs
            class="openings__tabs"
            :options="[
              { label: 'Active', value: 'active' },
              { label: 'Archived', value: 'archived' },
            ]"
            v-model="state"
          />
          <ol
            v-if="!isOpeningsLoading"
            ref="scrollContainer"
            class="opening-list__grid"
          >
            <hp-opening-card
              v-if="state === 'active' && canCreateOpening"
              @handleAddNew="handleNewOpening"
              :isAddCard="true"
            >
            </hp-opening-card>
            <hp-opening-card
              v-for="opening in openings"
              :isSelected="opening.reference === route.params.openingRef"
              :key="opening.reference"
              :opening="opening"
              @unarchiveOpening="handleUnarchiveOpening"
              :isArchived="state === 'archived'"
            >
            </hp-opening-card>
            <div v-if="state === 'archived' && openings.length === 0">
              No archived openings
            </div>
          </ol>
          <hp-spinner
            class="openingslist__spinner"
            :size="24"
            v-else
          ></hp-spinner>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useWindowScroll } from "@vueuse/core";

// Composables
import { usePut } from "@/composables/useHttp";
import useToast from "@/composables/useToast";
import useOpenings from "@/composables/useOpenings";
import { useGettingStarted } from "@/composables/useGettingStarted";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import useAuth from "@/composables/useAuth";

// Views
import CandidateList from "@/views/dashboard/openings/candidate-list.vue";
import CandidateDetails from "@/views/dashboard/openings/candidate-details.vue";

// Components
import HpTabs from "@/components/hp-tabs.vue";
import HpOpeningCard from "@/components/cards/hp-opening-card.vue";
import HpSpinner from "@/components/hp-spinner.vue";

const route = useRoute();
const router = useRouter();
const selectedOpening = ref({});
const isCandidateDetailsOpen = ref(route.query.candidate);
const isCandidateListOpen = ref(route.params.openingRef);
const state = ref("active");
const { user, organization } = useAuth();
const { setToast } = useToast();

const {
  fetchOpenings,
  openings,
  isOpeningsLoading,
  hasMoreData,
  createOpening,
} = useOpenings();
const { setBreadcrumbs } = useBreadcrumbs();

const { fetchChecklist } = useGettingStarted();

const scrollContainer = ref(null);
const { y } = useWindowScroll();

watch(
  () => y.value,
  () => {
    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;

    if (documentHeight <= currentScroll + 60) {
      if (isOpeningsLoading.value) {
        return;
      }

      if (route.query.candidate) {
        return;
      }

      fetchOpenings(true, state.value);
    }
  }
);

onMounted(async () => {
  // Checks for openingRef in route params
  if (route.params.openingRef) {
    // Sets selected opening to openingRef in route params
    selectedOpening.value = openings.value.find(
      (opening) => opening.reference === route.params.openingRef
    );
  }
  // Checks to see if candidate detail page is open
  isCandidateDetailsOpen.value = route.query.candidate;
});

// Watches for route changes to deal with candidate details page
watch(
  () => route.query.candidate,
  async () => {
    if (!route.query.candidate && route.name === "openings") {
      setBreadcrumbs([
        {
          label: "Openings",
          to: "/openings",
        },
        {
          label: selectedOpening.value.name,
          to: `/openings/${selectedOpening.value.reference}`,
        },
      ]);
    }
    isCandidateDetailsOpen.value = route.query.candidate;
  }
);

// Watch and change selected opening
watch(
  () => route.params.openingRef,
  async () => {
    if (route.params.openingRef) {
      if (openings.value.length === 0 || state.value === "archived") {
        state.value = "active";
        await fetchOpenings();
      }
      isCandidateListOpen.value = true;
      selectedOpening.value = openings.value.find(
        (opening) => opening.reference === route.params.openingRef
      );
      if (!isCandidateDetailsOpen.value && selectedOpening.value?.name) {
        setBreadcrumbs([
          {
            label: "Openings",
            to: "/openings",
          },
          {
            label: selectedOpening.value.name,
            to: `/openings/${selectedOpening.value.reference}`,
          },
        ]);
      }
    } else if (!route.params.openingRef) {
      isCandidateListOpen.value = false;
      setBreadcrumbs([]);
      if (openings.value.length > 0) {
        return;
      } else {
        if (user.value) {
          await fetchOpenings();
        }
      }
    }
  },
  { immediate: true }
);

const handleNewOpening = async () => {
  const newOpeningRef = await createOpening();
  router.push(`/opening/${newOpeningRef}/edit`);
  fetchChecklist();
  fetchOpenings();
};

watch(state, async () => {
  if (state.value === "archived") {
    router.push(`/openings/`);
  }
  hasMoreData.value = true;
  await fetchOpenings(false, state.value);
});

const handleUnarchiveOpening = async (opening) => {
  const putOpening = usePut(`openings/${opening.reference}/state`);
  await putOpening.put({
    state: "active",
  });
  await fetchOpenings();
  setToast({
    message: "Opening unarchived",
    type: "success",
  });
  router.push(`/openings/${opening.reference}`);
};

const canCreateOpening = computed(() => {
  if (!organization.value) {
    return true;
  }
  if (organization && organization.value.role === "member") {
    return false;
  }
  return true;
});
</script>

<style lang="scss" scoped>
.openings {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 24px;
  &__title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    margin: 0;
    margin-bottom: 4px;
  }
  &__subtitle {
    color: var(--color-text-secondary);
    margin: 0;
    margin-bottom: 16px;
  }
  &__tabs {
    margin-bottom: 24px;
  }
}

.opening-list {
  &__grid {
    position: relative;
    display: grid;
    grid-gap: 26px;
    grid-template-columns: repeat(auto-fill, 264px);
    align-content: baseline;
    padding-bottom: 64px;
  }
}
@media (min-width: $breakpoint-tablet) {
  .candidate-list {
    position: sticky;
    top: 90px;
    z-index: $z-index-100;
    transition: all 0.25s linear;
  }
  .openings {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 0;
  }

  .view {
    display: flex;
    position: relative;
    height: calc(100vh - 40px);
    z-index: 0;
  }
  .candidate-details {
    position: absolute;
    left: 440px;
    height: 100%;
    max-width: 848px;
    width: 100%;
    padding-right: 4px;
    padding-left: 4px;
  }

  .candidate-details::-webkit-scrollbar {
    display: none;
  }

  .openingslist {
    position: absolute;
    width: calc(100% - 440px);
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(0);
    transition: all 0.25s linear;
    &__spinner {
      display: flex;
      justify-content: center;
    }
  }

  .openingslist--empty {
    transform: translateX(25%);
  }

  .opening-list__grid::-webkit-scrollbar {
    display: none;
  }
}
.candidate-list-transition-enter-active,
.candidate-list-transition-leave-active {
  transform: translateX(0);
}

.candidate-list-transition-enter-from,
.candidate-list-transition-leave-to {
  transform: translateX(500px);
  opacity: 0;
}

.candidate-details-transition-enter-active,
.candidate-details-transition-leave-active {
  transition: all 0.25s linear;
  transform: translateX(0);
}

.candidate-details-transition-enter-from,
.candidate-details-transition-leave-to {
  transform: translateX(840px);
  opacity: 0;
}

.openings-list-transition-enter-active,
.openings-list-transition-leave-active {
  transition: all 0.25s linear;
}

.openings-list-transition-enter-from,
.openings-list-transition-leave-to {
  transform: translateX(-840px);
  opacity: 0;
}
</style>
