<template>
  <div class="candidate-modal">
    <div class="candidate-modal__header">
      <h3 class="candidate-modal__header__title">{{ content.title }}</h3>
      <p class="candidate-modal__header__subtitle">
        {{ content.subtitle }}
        <span v-if="isAddNew">
          <span v-if="!isBulkUploadOpen">
            Add multiple candidates with
            <span
              @click="isBulkUploadOpen = true"
              class="candidate-modal__header__subtitle__link"
              >bulk upload csv</span
            ></span
          >
          <span v-if="isBulkUploadOpen">
            <span
              @click="isBulkUploadOpen = false"
              class="candidate-modal__header__subtitle__link"
              >Add single candidate</span
            ></span
          >.</span
        >
      </p>
    </div>
    <form v-if="!isBulkUploadOpen" @submit="onSubmit">
      <div class="candidate-modal__form">
        <hp-input
          placeholder="Enter candidate name"
          label="Name"
          ref="nameInput"
          :autofocus="true"
          :isDisabled="isArchivingCandidate || isUpdatingCandidate"
          name="name"
        ></hp-input>
        <hp-input
          placeholder="Enter candidate email"
          label="Email"
          :isDisabled="isArchivingCandidate || isUpdatingCandidate"
          name="email"
        ></hp-input>
      </div>
      <div
        :class="`candidate-modal__actions ${
          !isAddNew ? 'candidate-modal__actions--two-button' : ''
        }`"
      >
        <hp-tooltip v-if="!isAddNew && candidate.state !== 'archived'">
          <hp-button
            class="candidate-modal__archive"
            @handleClick="changeCandidateState('archived')"
            :isLoading="isArchivingCandidate"
            :isDisabled="isArchivingCandidate || isUpdatingCandidate"
            icon="archive"
          ></hp-button>
          <template #content> Archive candidate </template>
        </hp-tooltip>
        <hp-tooltip v-if="!isAddNew && candidate.state === 'archived'">
          <hp-button
            @handleClick="changeCandidateState('active')"
            :isLoading="isArchivingCandidate"
            :isDisabled="isArchivingCandidate || isUpdatingCandidate"
            icon="folder"
          ></hp-button>
          <template #content> Unarchive candidate </template>
        </hp-tooltip>
        <hp-button
          primary
          type="submit"
          v-if="!isBulkUploadOpen"
          :isLoading="isUpdatingCandidate"
          :isDisabled="
            !meta.valid || isArchivingCandidate || isUpdatingCandidate
          "
          :label="content.buttonLabel"
        ></hp-button>
      </div>
    </form>
    <div v-else>
      <div class="candidate-modal__dropzone">
        <p class="candidate-modal__dropzone__description">
          Headers are email, and name.
          <a
            class="candidate-modal__header__subtitle__link"
            href="/csvs/bulk-candidate-example.csv"
            download="bulk-candidate-example.csv"
            >Download example file</a
          >.
        </p>
        <hp-dropzone
          @change="handleFileUpload"
          :isLoading="isMultipleCandidatesProcessing"
          accept=".csv"
          loadingLabel="Candidates processing"
          label="Upload a csv file to add multiple candidates"
        >
        </hp-dropzone>
      </div>
      <div class="candidate-modal__actions">
        <hp-button
          primary
          type="button"
          v-if="isBulkUploadOpen"
          @handleClick="handleCsvUpload"
          :isLoading="isMultipleCandidatesProcessing"
          :isDisabled="isMultipleCandidatesProcessing || !csv.name"
          label="Upload csv"
        ></hp-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { computed, ref, onMounted, nextTick } from "vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import Papa from "papaparse";

//Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import HpTooltip from "@/components/hp-tooltip.vue";
import HpDropzone from "@/components/hp-dropzone.vue";

// Composables
import { usePost, usePut } from "@/composables/useHttp";
import useOpenings from "@/composables/useOpenings";
import useCandidates from "@/composables/useCandidates";
import { useGettingStarted } from "@/composables/useGettingStarted";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import useToast from "@/composables/useToast";

const props = defineProps({
  opening: {
    type: Object,
    required: true,
  },
  candidate: {
    type: Object,
    default: { name: "", email: "" },
  },
});

const emits = defineEmits(["close"]);

const isUpdatingCandidate = ref(false);
const isArchivingCandidate = ref(false);
const isMultipleCandidatesProcessing = ref(false);
const isBulkUploadOpen = ref(false);
const isAddNew = props.candidate.name === "";
const csv = ref([]);

const nameInput = ref(null);

const { setToast } = useToast();

onMounted(async () => {
  nameInput.value.inputRef.focus();
});

const content = computed(() => {
  return isAddNew
    ? {
        title: "Add candidate",
        subtitle: `New candidate for ${props.opening.name}.`,
        buttonLabel: "Create candidate",
      }
    : {
        title: "Edit candidate",
        subtitle: `Edit candidate for ${props.opening.name}`,
        buttonLabel: "Update candidate",
      };
});

const route = useRoute();
const router = useRouter();

const { setBreadcrumbs } = useBreadcrumbs();

const schema = yup.object({
  name: yup.string().max(50).required("First name is required"),
  email: yup.string().max(100).email("Email must be valid").nullable(),
  state: yup.string(),
});

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: { ...props.candidate },
});

const { fetchChecklist } = useGettingStarted();
const { fetchOpening, updateOpenings } = useOpenings();

const {
  fetchCandidates,
  candidates,
  fetchCandidate,
  candidate,
  candidateListFilter,
} = useCandidates();

const handleFileUpload = (file) => {
  csv.value = file;
};

const onSubmit = handleSubmit(async (values) => {
  isUpdatingCandidate.value = true;
  if (isAddNew) {
    const postCandidate = usePost("candidates");
    const payload = {
      candidate: {
        ...values,
        email: values.email === "" ? null : values.email,
        opening: route.params.openingRef,
      },
    };
    await postCandidate.post(payload);
    setToast({
      type: "positive",
      title: "Well done!",
      message: "Candidate created successfully",
    });
    candidateListFilter.value = "active";
    router.push(
      `/openings/${route.params.openingRef}?candidate=${postCandidate.data.value.candidate.reference}`
    );
  } else {
    const putCandidate = usePut(`candidates/${props.candidate.reference}`);
    const payload = {
      candidate: {
        ...values,
        email: values.email === "" ? null : values.email,
        opening: route.params.openingRef,
      },
    };
    await putCandidate.put(payload);
    setToast({
      type: "positive",
      title: "What a change!",
      message: "Candidate updated successfully",
    });
    await fetchCandidate(props.candidate.reference);
    setBreadcrumbs([
      {
        label: "Openings",
        to: "/openings",
      },
      {
        label: props.opening.name,
        to: `/openings/${route.params.openingRef}`,
      },
      {
        label: candidate.value.name,
        to: `/opening/${route.params.openingRef}?candidate=${candidate.value.reference}`,
      },
    ]);
  }
  fetchOpening(route.params.openingRef);
  fetchCandidates();
  updateOpenings();
  fetchChecklist();
  isUpdatingCandidate.value = false;
  emits("close");
});

const changeCandidateState = async (state) => {
  isArchivingCandidate.value = true;
  const archiveCandidate = usePut(
    `candidates/${props.candidate.reference}/state`
  );
  await archiveCandidate.put({
    state,
  });

  fetchCandidate(props.candidate.reference);
  candidateListFilter.value = state !== "active" ? "archived" : "active";
  fetchCandidates();
  setToast({
    type: "success",
    title: "What a change!",
    message: "Candidate updated successfully",
  });
  updateOpenings();
  emits("close");
};

const handleCsvUpload = () => {
  isMultipleCandidatesProcessing.value = true;
  Papa.parse(csv.value, {
    header: true,
    complete: async (csvCandidates) => {
      const reqs = csvCandidates.data.map((newCandidate) => {
        const postCandidate = usePost("candidates");
        const payload = {
          candidate: { ...newCandidate, opening: route.params.openingRef },
        };
        return postCandidate.post(payload);
      });

      await Promise.all(reqs);
      setToast({
        type: "positive",
        title: "Candidates uploaded",
        message: "Candidate list added",
      });
      fetchCandidates();
      emits("close");
      isMultipleCandidatesProcessing.value = false;
    },
  });
};
</script>

<style lang="scss">
.candidate-modal {
  &__header {
    padding: 24px 16px;
    border-bottom: 1px dashed var(--color-border);
    &__title {
      font-size: 16px;
      line-height: 24px;
      letter-spacing: -0.015em;
    }
    &__subtitle {
      color: var(--color-text-secondary);
      &__link {
        cursor: pointer;
        text-decoration: underline;
        color: var(--color-text-primary);
      }
    }
  }
  &__form {
    padding: 24px 16px;
    border-bottom: 1px dashed var(--color-border);
    width: 100%;
  }
  &__actions {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    &--two-button {
      justify-content: space-between;
    }
  }
  &__dropzone {
    padding: 0 32px;
    padding-top: 32px;
    color: var(--color-text-secondary);
    &__description {
      margin-bottom: 18px;
    }
    &__container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &__icon {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
