<template>
  <hp-modal
    :isOpen="isAddCandidateModalOpen"
    @close="isAddCandidateModalOpen = false"
  >
    <candidate-modal
      @close="isAddCandidateModalOpen = false"
      :opening="opening"
    />
  </hp-modal>
  <div
    class="candidate-list"
    :class="{ 'candidate-list--left': isCandidateDetailsOpen }"
  >
    <div v-if="opening.statistics">
      <div class="candidate-list__header">
        <div class="candidate-list__image-container">
          <hp-abstract-avatar :abstractKey="opening.artwork" />
          <router-link
            class="candidate-list__image-container__link"
            :to="`/openings`"
          >
            Back
          </router-link>
        </div>
        <div class="candidate-list__header__button-group">
          <hp-button
            :href="`/opening/${opening.reference}/edit`"
            icon="pencil"
            class="candidate-list__header__button-group__edit-button"
            :label="candidates.length <= 1 ? 'Edit opening' : null"
          ></hp-button>
          <div v-if="candidates.length > 1">
            <hp-button
              :href="`/opening/${opening.reference}/compare`"
              label="Compare"
              icon="discover"
            ></hp-button>
          </div>
        </div>
      </div>
      <div ref="scrollContainer" class="candidate-list__scroll-container">
        <h2 class="candidate-list__opening-title">{{ opening.name }}</h2>
        <p class="candidate-list__opening-description">
          {{ opening.description }}
        </p>
        <div class="candidate-list__stats">
          <div class="candidate-list__stats__stat">
            <hp-icon
              class="candidate-list__stats__stat__icon"
              name="layers"
            ></hp-icon>
            <div class="candidate-list__stats__stat__number">
              {{ opening.templates?.length }}
            </div>
            Interviews
          </div>
          <div class="candidate-list__stats__stat">
            <hp-icon
              class="candidate-list__stats__stat__icon"
              name="skills"
            ></hp-icon>
            <div class="candidate-list__stats__stat__number">
              {{ opening.statistics.skills.length }}
            </div>
            Skills
          </div>
          <div class="candidate-list__stats__stat">
            <hp-icon
              class="candidate-list__stats__stat__icon"
              name="candidates"
            ></hp-icon>
            <div class="candidate-list__stats__stat__number">
              {{ opening.statistics.candidates }}
            </div>
            Candidates
          </div>
        </div>
        <div class="candidate-list__candidate-list">
          <div class="candidate-list__candidate-list__header">
            <div
              class="candidate-list__candidate-list__dropdown-target"
              @click="isCandidateFlyoutOpen = !isCandidateFlyoutOpen"
              ref="candidateDropdownTarget"
            >
              <div class="candidate-list__candidate-list__dropdown-target__tag">
                {{ candidateListFilter }} candidates
              </div>
              <hp-icon
                class="candidate-list__candidate-list__dropdown-target__icon"
                name="chevron-down"
              ></hp-icon>
            </div>
            <transition name="flyout-transition">
              <div
                v-if="isCandidateFlyoutOpen"
                class="candidate-list__flyout candidate-list__flyout--left"
              >
                <ol class="candidate-list__flyout__options">
                  <li
                    v-for="(state, index) in stateOptions"
                    class="candidate-list__flyout__options__option"
                  >
                    <button
                      class="candidate-list__flyout__options__button"
                      @click="handleCandidateFilterChange(state)"
                      type="button"
                    >
                      {{ state.label }}
                      <hp-radio
                        name="template"
                        tabindex="-1"
                        :checked="state.value === candidateListFilter"
                      />
                    </button>
                    <div
                      class="candidate-list__flyout__items__divider"
                      v-if="index === stateOptions.length - 2"
                    ></div>
                  </li>
                </ol>
              </div>
            </transition>
            <div
              class="candidate-list__candidate-list__dropdown-target"
              @click="isTemplateFlyoutOpen = !isTemplateFlyoutOpen"
              ref="templateDropdownTarget"
              v-if="templateList && templateList.length > 1"
            >
              <div
                class="candidate-list__candidate-list__dropdown-target__view"
              >
                View:
              </div>
              <div class="candidate-list__candidate-list__dropdown-target__tag">
                {{ templateLabel }}
              </div>
              <hp-icon
                class="candidate-list__candidate-list__dropdown-target__icon"
                name="chevron-down"
              ></hp-icon>
            </div>
            <transition name="flyout-transition">
              <div
                v-if="isTemplateFlyoutOpen"
                class="candidate-list__flyout candidate-list__flyout--right"
              >
                <ol class="candidate-list__flyout__options">
                  <li
                    v-for="(template, index) in templateList"
                    class="candidate-list__flyout__options__option"
                  >
                    <button
                      class="candidate-list__flyout__options__button"
                      @click="handleTemplateFilterChange(template)"
                      type="button"
                    >
                      {{ template.label }}
                      <hp-radio
                        name="template"
                        tabindex="-1"
                        :checked="template.value === filters.template"
                      />
                    </button>
                    <div
                      class="candidate-list__flyout__items__divider"
                      v-if="index === templateList.length - 2"
                    ></div>
                  </li>
                </ol>
              </div>
            </transition>
          </div>
          <div class="candidate-list__search">
            <hp-input
              variant="search"
              v-model="search"
              icon="search"
              name="search"
              standalone
              placeholder="Search..."
            />
            <div class="candidate-list__add-candidate">
              <hp-button
                icon="plus"
                dropzone
                @click="isAddCandidateModalOpen = true"
                label="Add candidate"
              ></hp-button>
            </div>
          </div>
          <div v-if="!isCandidateListLoading">
            <ol v-if="candidates.length > 0">
              <hp-candidate-card
                v-for="candidate in candidates"
                :key="candidate.reference"
                :candidate="candidate"
                :isDisabled="isInfiniteLoading"
              ></hp-candidate-card>
              <hp-spinner
                class="candidate-list__spinner"
                size="32"
                v-if="isInfiniteLoading"
              ></hp-spinner>
            </ol>
            <div class="candidate-list__empty-state" v-else>
              <empty-state class="candidate-list__empty-state__image" />
              <div class="candidate-list__empty-state__text--primary">
                Hello? Is anybody there?
              </div>
              <div class="candidate-list__empty-state__text--secondary">
                Looking a tad empty, try adding a candidate
              </div>
              <hp-button
                @handleClick="isAddCandidateModalOpen = true"
                primary
                label="Add candidate"
              ></hp-button>
            </div>
          </div>
          <hp-spinner
            :size="24"
            class="candidate-list__spinner"
            v-else
          ></hp-spinner>
        </div>
      </div>
    </div>
    <hp-spinner :size="24" class="candidate-list__spinner" v-else></hp-spinner>
  </div>
</template>

<script setup>
//Vendor
import { ref, watch, toRefs, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside, useScroll, useDebounce } from "@vueuse/core";

// Views
import CandidateModal from "./candidate-modal.vue";

//Components
import HpModal from "@/components/hp-modal.vue";
import HpRadio from "@/components/hp-radio.vue";
import HpAbstractAvatar from "@/components/hp-abstract-avatar.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpCandidateCard from "@/components/cards/hp-candidate-card.vue";
import EmptyState from "@/assets/abstracts/empty-state.svg";

// Composables
import useCandidates from "@/composables/useCandidates";
import useOpenings from "@/composables/useOpenings";

const props = defineProps({
  isCandidateDetailsOpen: {
    type: String,
    default: null,
  },
});

const {
  fetchCandidates,
  isCandidateListLoading,
  hasMoreToLoad,
  candidates,
  fetchMoreCandidates,
  isInfiniteLoading,
  candidateListFilter,
} = useCandidates();

const search = ref("");
const filters = ref({
  search: useDebounce(search, 300),
  template: "all",
});
const offset = ref(0);

const { opening, fetchOpening } = useOpenings();
const limit = 15;
const router = useRouter();

const getUrl = () => {
  const limit = 15;
  let url = `openings/${route.params.openingRef}/candidates`;
  var params = new URLSearchParams([["limit", limit]]);
  params.append("offset", offset.value);
  if (filters.value.search !== "") {
    params.append("search", filters.value.search);
  }
  if (filters.value.template !== "all") {
    params.append("template", filters.value.template);
  }
  if (candidateListFilter.value !== "all") {
    params.append("state", candidateListFilter.value);
  }

  return `${url}?${params.toString()}`;
};

const route = useRoute();
const isAddCandidateModalOpen = ref(false);
const isTemplateFlyoutOpen = ref(false);
const isCandidateFlyoutOpen = ref(false);
const candidateDropdownTarget = ref(null);
const templateDropdownTarget = ref(null);

const stateOptions = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Archived",
    value: "archived",
  },
  {
    label: "All",
    value: "all",
  },
];

const templateList = computed(() => {
  return opening.value.templates
    .map((template) => ({
      label: template.name,
      value: template.reference,
    }))
    .concat(
      [],
      [
        {
          label: "All interviews",
          value: "all",
        },
      ]
    );
});

const templateLabel = computed(() => {
  return templateList.value.find(
    (template) => template.value === filters.value.template
  )?.label;
});

const handleCandidateFilterChange = (state) => {
  isCandidateFlyoutOpen.value = false;
  candidateListFilter.value = state.value;
};

const handleTemplateFilterChange = (template) => {
  isTemplateFlyoutOpen.value = false;
  filters.value.template = template.value;
};

onClickOutside(templateDropdownTarget, (event) => {
  if (!isTemplateFlyoutOpen.value) {
    return;
  }
  if (event.target.className.includes("candidate-list__flyout")) {
    return;
  }
  isTemplateFlyoutOpen.value = false;
});

onClickOutside(candidateDropdownTarget, (event) => {
  if (!isCandidateFlyoutOpen.value) {
    return;
  }
  if (event.target.className.includes("candidate-list__flyout")) {
    return;
  }
  isCandidateFlyoutOpen.value = false;
});

watch(
  () => route.params.openingRef,
  async () => {
    if (!route.params.openingRef) {
      return;
    }
    offset.value = 0;
    hasMoreToLoad.value = true;
    const url = getUrl();
    filters.value.template = "all";
    fetchCandidates(url);
    fetchOpening(route.params.openingRef);
  },
  { immediate: true }
);

const scrollContainer = ref(null);
const { y, arrivedState } = useScroll(scrollContainer, {
  offset: { bottom: 400 },
});
const { bottom } = toRefs(arrivedState);
watch(
  () => bottom.value,
  () => {
    if (!bottom.value) {
      return;
    }
    if (isInfiniteLoading.value) {
      return;
    }
    offset.value = offset.value + limit;
    const url = getUrl();
    fetchMoreCandidates(url);
  }
);

watch(
  () => filters,
  () => {
    offset.value = 0;
    hasMoreToLoad.value = true;
    const url = getUrl();
    fetchCandidates(url);
  },
  { deep: true }
);

watch(
  () => candidateListFilter,
  () => {
    offset.value = 0;
    hasMoreToLoad.value = true;
    const url = getUrl();
    fetchCandidates(url);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.candidate-list {
  position: fixed;
  top: 90px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  z-index: 500;
  padding: 24px;
  &--left {
    display: none;
  }
  &__image-container {
    display: flex;
    display: flex;
    align-items: center;
    gap: 12px;
    &__link {
      text-decoration: underline;
    }
  }
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    align-items: center;
    &__spinner {
      padding: 24px;
      display: flex;
      justify-content: center;
    }
    &__avatar {
      height: 40px;
      width: 40px;
    }
    &__button-group {
      display: flex;
      align-items: center;
      > * {
        margin-left: 8px;
      }
    }
  }

  &__spinner {
    display: flex;
    margin-top: 80px;
    justify-content: center;
  }

  &__opening-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 4px;
  }

  &__opening-description {
    color: var(--color-text-secondary);
  }

  &__stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--color-border);
    margin-top: 16px;
    padding-bottom: 24px;

    &__stat {
      display: flex;
      align-items: center;
      color: var(--color-text-primary);
      &__number {
        font-weight: 600;
        margin-right: 2px;
      }
      &__icon {
        color: var(--color-text-secondary);
        margin-right: 4px;
      }
    }
  }

  &__empty-state {
    margin-top: 40px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__text--secondary {
      margin-bottom: 16px;
    }
    &__text--primary {
      color: var(--color-text-primary);
      font-weight: 500;
      margin-bottom: 2px;
    }
    &__image {
      height: 180px;
    }
  }

  &__scroll-container {
    max-height: calc(100vh - 200px);
    overflow: scroll;
    padding-left: 4px;
    padding-right: 4px;
  }

  &__candidate-list {
    margin-top: 24px;

    &__header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      position: relative;
    }
    &__dropdown-target {
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      :first-letter {
        text-transform: uppercase;
      }
      &__view {
        margin-right: 4px;
        color: var(--color-text-secondary);
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__flyout {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    position: absolute;
    width: 256px;
    padding: 8px;
    z-index: $z-index-1000;
    top: 30px;
    transition: all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &--left {
      left: 0;
    }
    &--right {
      right: 0;
    }
    &__items {
      display: flex;
      flex-direction: column;
      &__divider {
        width: 100%;
        border-top: 1px dashed var(--color-border);
        margin-top: 8px;
        margin-bottom: 8px;
      }
      &__item {
        padding: 8px 12px;
      }
    }
    &__options {
      display: flex;
      flex-direction: column;
      width: 100%;
      &__button {
        cursor: pointer;
        padding: 8px;
        border-radius: $border-radius-sm;
        outline: 0;
        background-color: var(--color-background);
        color: var(--color-text);
        border: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        &:hover {
          background-color: var(--color-forground-floating);
        }
        &:focus {
          background-color: var(--color-forground-floating);
          outline: none;
        }
        &--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
      &__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        color: var(--color-text-primary);
        width: 100%;
        flex-direction: column;
      }
    }
  }

  &__add-candidate {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  &__search {
    position: sticky;
    top: 0;
    background: var(--color-panel);
    z-index: $z-index-100;
    margin-bottom: 16px;
    border-bottom: 1px dashed var(--color-border);
  }
}
@media (min-width: $breakpoint-tablet) {
  .candidate-list {
    position: absolute;
    transition: transform 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67),
      right 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    transform: translateX(0);
    right: 16px;
    width: 400px;
    min-height: calc(100vh - 120px);
    z-index: $z-index-10;
    padding: 20px;
    padding-bottom: 0px;
    background-color: var(--color-panel);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    top: initial;
    bottom: initial;
    left: initial;
    &__image-container__link {
      display: none;
    }
    &--left {
      right: 100%;
      transform: translateX(100%);
      display: block;
    }
  }
}
</style>
