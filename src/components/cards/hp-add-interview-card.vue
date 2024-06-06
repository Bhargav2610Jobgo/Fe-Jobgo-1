<template>
  <li class="hp-add-opening-card">
    <hp-drawer
      @close="isViewInterviewDrawerOpen = false"
      :isOpen="isViewInterviewDrawerOpen"
    >
      <view-interview :template="template" />
    </hp-drawer>
    <div class="hp-add-opening-card__add-new" v-if="isAddCard">
      <div>
        <div
          @click="handleCreateInterview"
          class="hp-add-opening-card__add-new__icon-container"
        >
          <hp-icon :size="24" name="plus"></hp-icon>
        </div>
        <p class="hp-add-opening-card__content__name">Start from scratch</p>
        <p class="hp-add-opening-card__content__description">
          Create your own interview
        </p>
      </div>
      <div>
        <hp-button
          label="Start from scratch"
          @handleClick="handleCreateInterview"
          :isLoading="isCreatingInterview"
        ></hp-button>
      </div>
    </div>
    <div class="hp-add-opening-card__content" v-else>
      <div class="hp-add-opening-card__name">{{ template.name }}</div>
      <div class="hp-add-opening-card__facts">
        <div class="hp-add-opening-card__fact">
          <hp-icon
            class="hp-add-opening-card__fact__icon"
            name="chronometer"
            :size="15"
          ></hp-icon>
          {{ secondsToMinutes(template.statistics.duration) }} minutes
        </div>
        <div class="hp-add-opening-card__fact">
          <hp-icon
            class="hp-add-opening-card__fact__icon"
            name="questions"
            :size="15"
          ></hp-icon>

          {{ template.statistics.questions }} questions
        </div>
        <div class="hp-add-opening-card__fact">
          <hp-icon
            class="hp-add-opening-card__fact__icon"
            name="skills"
            :size="15"
          ></hp-icon>

          {{ template.statistics.skills.length }} evaluated skills
          <hp-info-circle
            class="hp-question-card-stats__stats__stat__info-circle"
            v-if="template.statistics.skills.length > 0"
            :content="formatSkills(template.statistics.skills)"
          ></hp-info-circle>
        </div>
      </div>
      <div class="hp-add-opening-card__actions">
        <hp-button
          class="hp-add-opening-card__actions__button"
          label="Add to opening"
          :isLoading="isLoading"
          @handleClick="handleAddToInterview"
        ></hp-button>
        <hp-tooltip :delay="500" class="hp-add-opening-card__actions__button">
          <hp-button
            icon="eye"
            @handleClick="isViewInterviewDrawerOpen = true"
          ></hp-button>
          <template #content>View interview</template>
        </hp-tooltip>
        <hp-tooltip
          v-if="hasEditPermission(template)"
          :delay="500"
          class="hp-add-opening-card__actions__button"
        >
          <hp-button
            :to="`/opening/${route.params.openingRef}/edit/edit-interview/${template.reference}`"
            icon="pencil"
          ></hp-button>
          <template #content>Edit interview</template>
        </hp-tooltip>
        <hp-tooltip :delay="500" class="hp-add-opening-card__actions__button">
          <hp-button
            icon="copy"
            @click="handleCloneInterview(template.reference)"
            v-if="!hasEditPermission(template)"
          ></hp-button>
          <template #content>Clone interview</template>
        </hp-tooltip>
      </div>
    </div>
  </li>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// Components
import HpTooltip from "@/components/hp-tooltip.vue";
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpInfoCircle from "@/components/hp-info-circle.vue";
import HpDrawer from "@/components/hp-drawer.vue";

// Composables
import { hasEditPermission } from "@/composables/usePermissions";
import { usePost } from "@/composables/useHttp";
import { useGettingStarted } from "@/composables/useGettingStarted";
import useToast from "@/composables/useToast";
import useOpenings from "@/composables/useOpenings";

// Views
import ViewInterview from "@/views/dashboard/opening/view-interview.vue";

const props = defineProps({
  opening: {
    type: Object,
    default: () => ({}),
  },
  template: {
    type: Object,
    default: () => ({}),
  },
  isAddCard: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["handleDelete"]);

const { fetchChecklist } = useGettingStarted();

const isLoading = ref(false);
const isCreatingInterview = ref(false);
const isViewInterviewDrawerOpen = ref(false);

const router = useRouter();
const route = useRoute();

const { setToast } = useToast();
const { fetchOpening, updateOpenings } = useOpenings();

const secondsToMinutes = (seconds) => {
  return Math.floor(seconds / 60);
};

// Creates interview and adds to current opening
const handleCreateInterview = async () => {
  isCreatingInterview.value = true;
  const postInterview = usePost("templates");
  await postInterview.post({
    template: { name: "New Interview" },
  });
  const postOpening = usePost(`openings/${route.params.openingRef}/templates`);
  const payload = {
    template: postInterview.data.value.template.reference,
  };
  await postOpening.post(payload);
  const url = `/opening/${route.params.openingRef}/edit/edit-interview/${postInterview.data.value.template.reference}`;
  await fetchOpening(route.params.openingRef);
  fetchChecklist();
  router.push(url);
  isCreatingInterview.value = false;
};

const handleAddToInterview = async () => {
  isLoading.value = true;
  const postOpening = usePost(`openings/${route.params.openingRef}/templates`);
  const payload = {
    template: props.template.reference,
  };

  await postOpening.post(payload);
  await fetchOpening(route.params.openingRef);
  updateOpenings();
  isLoading.value = false;
  router.push(`/opening/${route.params.openingRef}/edit`);
  setToast({
    type: "positive",
    title: "Well done!",
    message: "Interview added to opening",
  });
};

const formatSkills = (skills) => {
  return skills.map((skill) => skill.value.name).join(", ");
};

const handleCloneInterview = async (ref) => {
  const postInterview = usePost(`clone/templates/${ref}`);
  await postInterview.post();
  router.push(
    `/opening/${route.params.openingRef}/edit/edit-interview/${postInterview.data.value.template.reference}`
  );
};
</script>

<style lang="scss">
.hp-add-opening-card {
  width: 100%;
  height: 208px;
  list-style: none;
  border-radius: $border-radius-lg;
  border: $border;
  display: flex;
  flex-direction: column;
  &__name {
    font-weight: 500;
    @include text-h5;
    margin-bottom: 16px;
    word-break: break-word;
  }
  &__badge-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    &__handle {
      cursor: grab;
    }
  }
  &__content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  &__fact {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &__icon {
      margin-right: 4px;
      color: var(--color-text-secondary);
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    margin-top: auto;
    &__button {
      margin-right: 6px;
    }
  }

  &--selected {
    background-color: var(--color-panel);
  }
  &__add-new {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    &__icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      cursor: pointer;
      border: 1px dashed var(--color-border);
      border-radius: $border-radius-lg;
      margin-bottom: 16px;
      &:hover {
        background: var(--color-panel);
      }
    }
  }
}
</style>
