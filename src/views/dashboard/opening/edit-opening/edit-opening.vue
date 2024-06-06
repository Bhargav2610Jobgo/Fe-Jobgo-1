<template>
  <div>
    <form
      class="edit-openings"
      v-if="!isLoading"
      @submit.prevent="handleContextFormSave"
    >
      <div>
        <div class="edit-openings__edit-container">
          <router-link class="edit-question__back" :to="`/openings`">
            <hp-icon name="arrow-left"></hp-icon>Back
          </router-link>
          <h3 class="edit-openings__edit-container__title">Edit opening</h3>
          <p class="edit-openings__edit-container__subtitle">
            Main information for your openings
          </p>
          <hp-input
            @input="debouncedSubmit"
            label="Name"
            name="name"
          ></hp-input>
          <hp-textarea
            @input="debouncedSubmit"
            label="Description"
            name="description"
          ></hp-textarea>
          <hp-collaborator-permission v-if="canEditMemberPermissions" />
          <hp-image-selector
            class="edit-openings__edit-container__cover-selector"
            label="Cover"
            name="artwork"
            @input="debouncedSubmit"
          ></hp-image-selector>
          <div
            v-if="canArchiveOpening"
            class="edit-openings__edit-container__archive"
          >
            <hp-button
              icon="archive"
              label="Archive opening"
              danger
              @handleClick="archiveOpening"
            ></hp-button>
          </div>
        </div>
      </div>
      <div class="edit-openings__empty-state" v-if="templates.length === 0">
        <mic-check />
        <p class="edit-openings__empty-state__title">Mic check! One, two...</p>
        <p class="edit-openings__empty-state__subtitle">
          Looking a bit empty here, please add an interview
        </p>
        <hp-button
          :to="`/opening/${route.params.openingRef}/edit/add-interview`"
          label="Add interview"
          primary
        ></hp-button>
      </div>
      <div class="edit-openings__interview-container" v-else>
        <h2 class="edit-openings__interview-container__title">Interviews</h2>
        <p class="edit-openings__interview-container__subtitle">
          View and manage all interviews
        </p>
        <div class="edit-openings__interview-container__grid">
          <hp-interview-card isAddCard></hp-interview-card>
          <draggable
            v-model="templates"
            tag="transition-group"
            item-key="reference"
            handle=".hp-interview-card__badge-container__handle"
            @change="handleDragChange"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <template #item="{ element, index }">
              <hp-interview-card
                :template="element"
                :index="index + 1"
                :key="element.reference"
                @handleRemove="handleRemoveInterview"
              ></hp-interview-card>
            </template>
          </draggable>
        </div>
      </div>
      <teleport to="#teleport-target-header">
        <hp-save-indicator
          :meta="meta"
          :isLoading="isSaving"
        ></hp-save-indicator>
      </teleport>
    </form>
    <div class="edit-openings__spinner" v-else>
      <hp-spinner size="24"></hp-spinner>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import draggable from "vuedraggable";
import { useDebounceFn } from "@vueuse/core";
import { onClickOutside } from "@vueuse/core";
import * as yup from "yup";

// Components
import HpInterviewCard from "@/components/cards/hp-interview-card.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpTextarea from "@/components/form/hp-textarea.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpSaveIndicator from "@/components/hp-save-indicator.vue";
import HpImageSelector from "@/components/form/hp-image-selector.vue";
import MicCheck from "@/assets/abstracts/mic-check.svg";

// Views
import HpCollaboratorPermission from "./collaborator-permissions.vue";

// Composables
import useAuth from "@/composables/useAuth";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import useContextSave from "@/composables/useContextSave";
import { useGet, usePut } from "@/composables/useHttp";
import useOpenings from "@/composables/useOpenings";
import useCandidates from "@/composables/useCandidates";
import usePermissions from "@/composables/usePermissions";

const { organization } = useAuth();

const route = useRoute();
const router = useRouter();
const templates = ref([]);
const opening = ref({});
const isOverviewFlyoutOpen = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);

const { fetchOpenings } = useOpenings();
const { fetchCandidates } = useCandidates();

const { setBreadcrumbs } = useBreadcrumbs();

const schema = yup.object({
  name: yup
    .string()
    .required("Opening name is required")
    .label("Opening name")
    .max(240),
  description: yup.string().label("Description").max(240),
  artwork: yup.number(),
  templates: yup.array(),
});

const { handleSubmit, resetForm, meta, setFieldValue, values } = useForm({
  validationSchema: schema,
  initialValues: {
    name: "",
    description: "",
    artwork: 0,
    templates: [],
  },
});

const canEditMemberPermissions = computed(() => {
  return organization.value && organization.value.role !== "member";
});

const canArchiveOpening = computed(() => {
  if (!organization.value) {
    return true;
  }
  if (organization && organization.value.role === "member") {
    return false;
  }
  return true;
});

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
});

const overviewArea = ref(null);

onClickOutside(overviewArea, (event) => {
  if (!isOverviewFlyoutOpen.value) {
    return;
  }
  isOverviewFlyoutOpen.value = false;
});

const handleDragChange = () => {
  setFieldValue("templates", templates.value);
  onSubmit();
};

const onSubmit = handleSubmit(async (submitValues) => {
  isSaving.value = true;
  const putOpening = usePut(`openings/${route.params.openingRef}`);
  await putOpening.put({
    opening: {
      ...values,
      templates: values.templates.map((t) => t.reference),
    },
  });
  isSaving.value = false;
  opening.value.name = values.name;
  resetForm({
    touched: false,
    dirty: false,
    values: { ...values, templates: values.templates },
  });
  fetchOpenings();
  fetchCandidates();
  setBreadcrumbs(
    [
      {
        label: "Openings",
        to: "/openings",
      },
      {
        label: opening.value.name,
        to: `/openings/${opening.value.reference}`,
      },
    ],
    true
  );
});

const handleRemoveInterview = (templateReference) => {
  const newTemplate = templates.value.filter(
    (t) => t.reference !== templateReference
  );
  templates.value = newTemplate;
  setFieldValue("templates", newTemplate);
  onSubmit();
};

const debouncedSubmit = useDebounceFn(() => {
  onSubmit();
}, 500);

onMounted(async () => {
  if (route.params.openingRef) {
    const getOpening = useGet(`openings/${route.params.openingRef}`);
    await getOpening.get();
    opening.value = getOpening.data.value.opening;
    templates.value = getOpening.data.value.opening.templates;
    resetForm({ touched: false, values: opening.value });
    isLoading.value = false;
    setBreadcrumbs(
      [
        {
          label: "Openings",
          to: "/openings",
        },
        {
          label: opening.value.name,
          to: `/openings/${opening.value.reference}`,
        },
      ],
      true
    );
  }
});

useContextSave(meta);

const archiveOpening = async () => {
  const putOpening = usePut(`openings/${route.params.openingRef}/state`);
  await putOpening.put({
    state: "archived",
  });
  fetchOpenings();
  router.push("/openings");
};
</script>

<style lang="scss" scoped>
.edit-openings {
  display: flex;
  flex-direction: column;
  &__teleport-button {
    margin-right: 6px;
    &--overview {
      position: relative;
      display: none;
    }
  }
  &__spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
  }
  &__edit-container {
    @include panel;
    &__title {
      @include text-h4;
      font-weight: 500;
    }
    &__subtitle {
      @include text-h5;
      margin: 0;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
    }
    &__cover-selector {
      display: none;
      flex-grow: 1;
    }
    &__archive {
      display: flex;
    }
  }
  &__empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 400px;
    &__title {
      margin-top: 24px;
      @include text-h4;
    }
    &__subtitle {
      @include text-h5;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
    }
  }
  &__interview-container {
    padding: 26px;
    &__grid {
      display: grid;
      grid-gap: 26px;
      grid-template-columns: repeat(auto-fill, 264px);
      align-content: baseline;
    }
    &__title {
      @include text-h2;
      font-weight: 500;
    }
    &__subtitle {
      @include text-h5;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .edit-openings {
    display: grid;
    grid-template-columns: 30% auto;
    &__edit-container {
      height: 80vh;
    }
    &__interview-container {
      padding: 0px;
      padding-left: 96px;
    }
    &__teleport-button {
      &--overview {
        display: block;
      }
    }
  }
  .edit-openings__edit-container__cover-selector {
    display: block;
    position: relative;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
