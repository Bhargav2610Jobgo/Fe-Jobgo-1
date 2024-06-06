<template>
  <div class="compare">
    <div class="compare__header">
      <div class="compare__header-container">
        <h2 class="compare__title">Compare candidates</h2>
        <h2 class="compare__subtitle">
          Review and compare your candidate scores
        </h2>
        <hp-tabs
          class="openings__tabs"
          :options="[
            { label: 'Interviews', value: 'templates' },
            { label: 'Skills', value: 'skills' },
          ]"
          v-model="filter.dataset"
        />
      </div>
      <div class="compare__filters">
        <div class="compare__filters__search">
          <hp-input
            name="search"
            variant="search"
            icon="search"
            standalone
            v-model="filter.search"
            placeholder="Search by candidate"
          />
        </div>
        <div
          v-if="filter.dataset === 'skills'"
          class="compare__filters__dropdown"
        >
          <hp-multi-select
            selectedMessage="skills selected"
            :options="skillList"
            name="skills"
            :maxItemsSelected="5"
            v-model="filter.skills"
          ></hp-multi-select>
        </div>
      </div>
    </div>
    <hp-table
      :isLoading="isLoading"
      :data="filteredTableData"
      :headers="headers"
    >
      <template v-slot:name="{ row }">
        <div>
          <div class="compare__table__name">
            <router-link
              :to="`/openings/${opening.reference}?candidate=${row.reference}`"
              >{{ row.name }}</router-link
            >
          </div>
          <div v-if="row.email" class="compare__table__email">
            {{ row.email }}
          </div>
        </div>
      </template>
      <template
        v-for="(template, index) in templateList"
        v-slot:[template.value]="{ row }"
      >
        <div v-if="!row[template.value]">-</div>
        <hp-badge
          :type="
            determineOutcome(row[template.value], averageTemplateScores[index])
          "
          v-else
          :content="row[template.value].toFixed(1)"
        ></hp-badge>
      </template>
      <template
        v-for="(skill, index) in skillList"
        v-slot:[skill.value]="{ row }"
      >
        <div v-if="!row[skill.value]">-</div>
        <hp-badge
          :type="
            determineOutcome(row[skill.value], averageSkillScores[skill.index])
          "
          v-else
          :content="row[skill.value].toFixed(1)"
        ></hp-badge>
      </template>
      <template v-slot:time="{ row }">
        <div class="compare__time">
          {{ row.time }}
        </div>
      </template>
      <template v-slot:averageScore="{ row }">
        <div v-if="!row.averageScore">-</div>
        <hp-badge
          v-else
          :type="determineOutcome(row.averageScore, averageOpeningScore)"
          :content="row.averageScore.toFixed(1)"
        ></hp-badge>
      </template>
    </hp-table>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed, watch } from "vue";
import { formatDistance } from "date-fns";

// Components
import HpTable from "@/components/hp-table.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpMultiSelect from "@/components/form/hp-multi-select.vue";
import HpTabs from "@/components/hp-tabs.vue";

// Composables
import { useGet } from "@/composables/useHttp";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import useOpenings from "@/composables/useOpenings";

const { opening } = useOpenings();
const { setBreadcrumbs } = useBreadcrumbs();

const averageOpeningScore = ref(0);
const averageSkillScores = ref([]);
const averageTemplateScores = ref([]);
const templateData = ref([]);
const fullSkillData = ref([]);
const skillData = ref([]);
const skillHeaders = ref([]);
const templateHeaders = ref([]);
const templateList = ref([]);
const skillList = ref([]);
const isLoading = ref(false);
const filter = ref({
  search: "",
  dataset: "templates",
  skills: [],
});

const determineOutcome = (a, b) => {
  if (a?.toFixed(1) > b?.toFixed(1)) {
    return "positive";
  }
  if (b?.toFixed(1) > a?.toFixed(1)) {
    return "negative";
  }
  return "neutral";
};

watch(
  () => filter.value.skills,
  () => {
    if (
      filter.value.dataset === "skills" &&
      fullSkillData.value.candidates?.length > 0
    ) {
      skillHeaders.value = [
        {
          label: "Candidate",
          value: "name",
        },
        ...filter.value.skills,
      ];
      skillData.value = fullSkillData.value.candidates.map((item) => {
        const skillScores = filter.value.skills.reduce((acc, skill, index) => {
          return {
            ...acc,
            [skill.value]: item.skillScores[index],
          };
        }, {});

        return {
          ...item.candidate,
          ...skillScores,
        };
      });
    }
  }
);

const filteredTableData = computed(() => {
  let sortedData =
    filter.value.dataset === "skills" ? skillData.value : templateData.value;

  if (filter.value.search !== "") {
    sortedData = sortedData.filter((row) => {
      return row.name.toLowerCase().includes(filter.value.search.toLowerCase());
    });
  }
  isLoading.value = false;
  return sortedData;
});

const headers = computed(() => {
  let computedHeaders =
    filter.value.dataset === "skills"
      ? skillHeaders.value
      : templateHeaders.value;

  return computedHeaders;
});

const loadComparisonData = async (dataset) => {
  isLoading.value = true;
  const getComparison = useGet(
    `openings/${opening.value.reference}/comparisons/${dataset}`
  );
  await getComparison.get();

  // Sorts template data into list
  if (dataset === "templates") {
    const { templates } = getComparison.data.value.comparisons;

    averageTemplateScores.value =
      getComparison.data.value.comparisons.averageOpeningTemplateScores;
    averageOpeningScore.value =
      getComparison.data.value.comparisons.averageOpeningScore;

    templateList.value = templates.map((template) => {
      return {
        label: template.name,
        value: template.reference,
        sortable: true,
      };
    });

    templateHeaders.value = [
      {
        value: "name",
        label: "Candidate",
      },
      {
        value: "time",
        label: "Created",
      },
      {
        value: "averageScore",
        label: "Overall score",
        sortable: true,
      },
      ...templateList.value,
    ];

    templateData.value = getComparison.data.value.comparisons.candidates.map(
      (item) => {
        const templatesWithScores = templateList.value.reduce(
          (acc, template, index) => {
            return {
              ...acc,
              [template.value]: item.templateScores[index],
            };
          },
          {}
        );

        const timeAgo = formatDistance(
          new Date(item.candidate.created),
          new Date(),
          {
            addSuffix: true,
          }
        );

        return {
          ...item.candidate,
          time: timeAgo,
          averageScore: item.averageScore,
          ...templatesWithScores,
        };
      }
    );
  }

  //Handle skill data
  if (dataset === "skills") {
    const { skills } = getComparison.data.value.comparisons;
    averageSkillScores.value =
      getComparison.data.value.comparisons.averageOpeningSkillScores;

    fullSkillData.value = getComparison.data.value.comparisons;
    skillList.value = skills.map((skill, index) => {
      return {
        label: skill.name,
        value: skill.reference,
        sortable: true,
        index: index,
      };
    });

    filter.value.skills = skillList.value.slice(0, 5);
    skillHeaders.value = [
      {
        label: "Candidate",
        value: "name",
      },
      ...filter.value.skills,
    ];
    skillData.value = getComparison.data.value.comparisons.candidates.map(
      (item) => {
        const skillScores = filter.value.skills.reduce((acc, skill) => {
          return {
            ...acc,
            [skill.value]: item.skillScores[skill.index],
          };
        }, {});

        return {
          ...item.candidate,
          ...skillScores,
        };
      }
    );
  }
};

onMounted(() => {
  loadComparisonData("templates");
  loadComparisonData("skills");

  setBreadcrumbs([
    {
      label: "Openings",
      to: "/openings",
    },
    {
      label: opening.value.name,
      to: `/openings/${opening.value.reference}`,
    },
    {
      label: "Compare",
      to: `/opening/${opening.value.reference}/compare`,
    },
  ]);
});
</script>

<styles lang="scss">
.compare {
  margin-bottom: 60px;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
  }
  &__filters {
    display: flex;
    flex-direction: row;
    align-items: end;
    > * {
      margin-left: 8px;
    }
    &__search {
      color: red;
      .hp-input__input-container {
        margin-bottom: 0;
      }
    }
    &__dropdown {
      width: 200px;
    }
  }
  &__title {
    @include text-h2;
    font-weight: 600;
  }
  &__subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
  &__time {
    color: var(--color-text-secondary);
  }
  &__table {
    &__name {
      font-weight: 500;
      margin-bottom: 2px;
    }
    &__email {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
}
</styles>
