<template>
  <div class="add-interview">
    <hp-modal :isOpen="isAddInterviewModalOpen"
      >Add interview
      <form @submit="onSubmit">
        <hp-input name="name"></hp-input>
        <hp-input name="description"></hp-input>
        <button type="submit">Hello</button>
      </form>
    </hp-modal>
    <div class="add-interview__container">
      <div class="add-interview__header">
        <div class="add-interview__title">Add interviews</div>
        <div class="add-interview__subtitle">
          Select a template or create a new one from scratch
        </div>
      </div>
      <div class="add-interview__filter">
        <hp-input
          class="add-interview__filter__search"
          name="search"
          variant="search"
          icon="search"
          standalone
          v-model="filter.search"
          placeholder="Search by name"
        />
        <hp-multi-select
          class="add-interview__filter__dropdowns__dropdown"
          label="All Skills"
          :options="skillOptions"
          name="skills"
          searchable
          :onSearch="searchFunction"
          v-model="filter.skills"
        ></hp-multi-select>
      </div>
      <ol v-if="!isInterviewsLoading" class="add-interview__interview-grid">
        <hp-add-interview-card isAddCard></hp-add-interview-card>
        <hp-add-interview-card
          :template="template"
          :key="template.reference"
          v-for="template in templates"
          @handleDelete="onDeleteTemplate"
        ></hp-add-interview-card>
      </ol>
      <div class="add-interview__load-more">
        <hp-button
          v-if="!isInterviewsLoading && hasLoadMore"
          label="Load more"
          @click="fetchMoreTemplates"
          :isLoading="isLoadingMoreLoading"
        >
          Load more
        </hp-button>
      </div>
      <hp-spinner v-if="isInterviewsLoading" content size="24" />
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";

// Components
import HpModal from "@/components/hp-modal.vue";
import HpButton from "@/components/hp-button.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpMultiSelect from "@/components/form/hp-multi-select.vue";
import HpAddInterviewCard from "@/components/cards/hp-add-interview-card.vue";

// Composables
import useSkillSearch from "@/composables/useSkillSearch";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import { useGet, usePost, useDelete } from "@/composables/useHttp";

const props = defineProps({
  opening: {
    type: Object,
    default: false,
  },
});

const isInterviewsLoading = ref(true);
const isLoadingMoreLoading = ref(false);
const hasLoadMore = ref(true);
const offset = ref(0);
const limit = 20;

const filter = ref({ search: "", skills: [] });

const skillOptions = ref([]);

const { handleSkillSearch } = useSkillSearch();

const searchFunction = async (value) => {
  skillOptions.value = await handleSkillSearch(value);
};

const templates = ref([]);
const isAddInterviewModalOpen = ref(false);
const { setBreadcrumbs } = useBreadcrumbs();

watch(
  () => filter.value,
  () => {
    fetchTemplates();
  },
  { deep: true }
);

const getUrl = () => {
  let url = `templates`;
  var params = new URLSearchParams([["limit", limit]]);

  params.append("offset", offset.value);
  if (filter.value.skills.length > 0) {
    const onlySlugs = filter.value.skills.map((s) => s.value);
    params.append("skills", onlySlugs.join(","));
  }
  if (filter.value.search !== "") {
    params.append("search", filter.value.search);
  }

  if (route.params.openingRef) {
    params.append("exclude-opening", [route.params.openingRef]);
  }
  return `${url}?${params.toString()}`;
};

const fetchTemplates = async () => {
  offset.value = 0;
  isInterviewsLoading.value = true;
  const getTemplates = useGet(getUrl());
  await getTemplates.get();
  templates.value = getTemplates.data.value.templates;
  hasLoadMore.value = getTemplates.data.value.templates.length === limit;
  isInterviewsLoading.value = false;
};

const fetchMoreTemplates = async () => {
  isLoadingMoreLoading.value = true;
  offset.value = offset.value + limit;
  const getTemplates = useGet(getUrl());
  await getTemplates.get();
  templates.value = templates.value.concat(
    [],
    getTemplates.data.value.templates
  );
  hasLoadMore.value = getTemplates.data.value.templates / limit === 1;
  isLoadingMoreLoading.value = false;
};

onMounted(async () => {
  fetchTemplates();
  skillOptions.value = await handleSkillSearch("");

  setBreadcrumbs([
    {
      label: "Openings",
      to: "/openings",
    },
    {
      label: props.opening.name,
      to: `/opening/${props.opening.reference}/edit`,
    },
    {
      label: "Add interview",
      to: `/opening/${props.opening.reference}/edit/add-interview`,
    },
  ]);

  isInterviewsLoading.value = false;
});

const schema = yup.object({
  name: yup.string().required("Job name is required"),
  description: yup.string(),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: { name: "", description: "" },
});

const router = useRouter();
const route = useRoute();

const postInterview = usePost("templates");
const onSubmit = handleSubmit(async (values) => {
  await postInterview.post({ template: { ...values } });
  if (postInterview.data.value) {
    router.push(
      `/opening/${route.params.openingRef}/edit/edit-interview/${postInterview.data.value.template.reference}`
    );
  }
});

const onDeleteTemplate = async (template) => {
  const deleteInterview = useDelete(`templates/${template}`);
  await deleteInterview.remove();
  await fetchTemplates();
};
</script>

<style lang="scss">
.add-interview {
  padding: 26px;
  display: flex;
  justify-content: center;
  &__container {
    width: 882px;
  }
  &__header {
    align-self: flex-start;
    margin-bottom: 24px;
  }
  &__title {
    @include text-h2;
    font-weight: 600;
  }
  &__subtitle {
    @include text-h5;
    color: var(--color-text-secondary);
  }
  &__interview-grid {
    display: grid;
    grid-gap: 24px;
    margin-bottom: 64px;
  }
  &__filter {
    display: grid;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    position: sticky;
    top: $header-height;
    border-bottom: 1px dashed var(--color-border);
    background: var(--color-background);
    z-index: $z-index-100;
    &__dropdowns {
      display: flex;
      &__dropdown {
        margin-bottom: 6px;
      }
    }
  }
  &__load-more {
    display: flex;
    justify-content: center;
    margin-bottom: 200px;
  }
}

@media (min-width: $breakpoint-tablet) {
  .add-interview {
    padding: 0;
    &__interview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 24px;
      margin-bottom: 64px;
    }
    &__filter {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      &__dropdowns {
        display: flex;
        &__dropdown {
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
