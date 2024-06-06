<template>
  <div class="builder">
    <div class="builder__content">
      <div class="builder__wizard">
        <div class="builder__header">
          <h1>Interview builder</h1>
          <p>
            Edcuational content about skills here lorem ipsum. Edcuational
            content about skills here lorem ipsum. Edcuational content about
            skills here lorem ipsum. Edcuational content about skills here lorem
            ipsum. Edcuational content about skills here lorem ipsum.Edcuational
            content about skills here lorem ipsum
          </p>
        </div>
        <div class="builder__stepper__container">
          <ul class="builder__stepper__step-container">
            <li class="builder__stepper__step" @click="isSkillSelection = true">
              <div class="builder__stepper__step__box">
                <hp-icon name="plus"></hp-icon>
              </div>
            </li>
            <li
              class="builder__stepper__step"
              v-for="(skill, index) in yourSkills"
              @click="handleSkillStepSelection(index)"
            >
              <div class="builder__stepper__step__box">
                {{ skill.label.charAt(0) }}
              </div>
            </li>
          </ul>
          <div class="builder__skill-selector" v-if="isSkillSelection">
            <div class="builder__skill-selector__box">
              <p class="builder__skills__label">Most commonly used skills</p>
              <ol class="builder__skills">
                <li
                  class="builder__skills__skill"
                  v-for="skill in mostUsedSkills"
                >
                  <hp-tag
                    @handleChange="handleSkillAdded(skill)"
                    :isAdd="true"
                    :item="skill"
                  ></hp-tag>
                </li>
              </ol>
            </div>
            <div class="builder__skill-selector__box">
              <p class="builder__skills__label">Search skills</p>
              <hp-input
                icon="search"
                placeholder="Javascript"
                v-model="searchSkill"
                @change="searchFunction"
                name="search"
                standalone
              ></hp-input>
            </div>
          </div>
          <div v-else>
            <transition name="flyout-transition">
              <builder-step
                :key="yourSkills[step]"
                :skillRef="yourSkills[step]"
              ></builder-step>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div v-if="interview?.statistics" class="builder__panel">
      <div>
        <hp-input @input="debouncedSubmit" label="Name" name="name"></hp-input>
      </div>
      <div class="edit-interview__overview__input">
        <hp-textarea
          @input="debouncedSubmit"
          label="Description"
          name="description"
        ></hp-textarea>
      </div>
      <div class="edit-interview__overview__stats">
        <div class="edit-interview__overview__stats__stat">
          <hp-icon
            class="edit-interview__overview__stats__stat__icon"
            name="chronometer"
          ></hp-icon>
          <div class="edit-interview__overview__stats__stat__text">
            {{ (interview.statistics.duration / 60).toFixed(0) }}
            minutes
          </div>
        </div>
        <div class="edit-interview__overview__stats__stat">
          <hp-icon
            class="edit-interview__overview__stats__stat__icon"
            name="questions"
          ></hp-icon>
          <div class="edit-interview__overview__stats__stat__text">
            {{ interview.statistics.questions }} questions
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useDebounceFn } from "@vueuse/core";

// Components
import BuilderStep from "@/components/builder/builder-step.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpTag from "@/components/hp-tag.vue";
import HpBadgeTag from "@/components/hp-badge-tag.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpTextarea from "@/components/form/hp-textarea.vue";

// Composables
import useInterviews from "@/composables/useInterviews";
import useOpenings from "@/composables/useOpenings";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import { usePut } from "@/composables/useHttp";
import useSkillSearch from "@/composables/useSkillSearch";

const route = useRoute();
const router = useRouter();

const top10Skills = ref([]);
const step = ref(null);
const skillOptions = ref([]);
const yourSkills = ref([]);
const skillToAdd = ref("");
const { opening } = useOpenings();
const { setBreadcrumbs } = useBreadcrumbs();
const { fetchInterview, interview, setInterview } = useInterviews();
const { handleSkillSearch } = useSkillSearch();
const putInterview = usePut(`templates/${route.params.interviewRef}`);
const isSkillSelection = ref(true);

const searchFunction = async (value) => {
  skillOptions.value = await handleSkillSearch(value);
};

onMounted(async () => {
  await fetchInterview(route.params.interviewRef);
  skillOptions.value = await handleSkillSearch("");
  top10Skills.value = skillOptions.value.slice(0, 10);
  resetForm({ touched: false, values: interview.value });
  setBreadcrumbs(
    [
      {
        label: "Openings",
        to: "/openings",
      },
      {
        label: opening.value.name,
        to: `/opening/${opening.value.reference}/edit`,
      },
      {
        to: `/opening/${opening.value.reference}/edit/edit-interview/${route.params.interviewRef}`,
        label: interview.value.name,
      },
    ],
    true
  );
});

const schema = yup.object({
  name: yup.string().required("Interview name is required"),
  description: yup.string().nullable(),
  ceremony: yup.object({
    cooldown: yup.object({
      enabled: yup.boolean(),
      content: yup.string().max(1000),
      duration: yup.number().min(1).max(60),
    }),
    warmup: yup.object({
      enabled: yup.boolean(),
      content: yup.string().max(1000),
      duration: yup.number().min(1).max(60),
    }),
  }),
  questions: yup.array(),
});

const { handleSubmit, resetForm, meta, setFieldValue, values } = useForm({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {},
});

const debouncedSubmit = () => {
  onSubmitWithDebounce();
};

const onSubmitWithDebounce = useDebounceFn(() => {
  onSubmit();
}, 500);

const onSubmit = handleSubmit(async () => {
  const formattedQuestions =
    interview.value?.questions.map((q) => q.reference) || [];

  const formatCeremony = (ceremonyType) => {
    if (values.ceremony[ceremonyType].enabled) {
      return {
        ...values.ceremony[ceremonyType],
        duration: values.ceremony[ceremonyType].duration * 60,
      };
    } else {
      return {
        ...interview.value.ceremony[ceremonyType],
        duration: interview.value.ceremony[ceremonyType].duration * 60,
        enabled: false,
      };
    }
  };

  const payload = {
    template: {
      ...values,
      questions: formattedQuestions,
      ceremony: {
        warmup: formatCeremony("warmup"),
        cooldown: formatCeremony("cooldown"),
      },
    },
  };
  await putInterview.put(payload);
  setInterview(putInterview.data.value.template);

  resetForm({
    touched: false,
    dirty: false,
    values: { ...values, questions: formattedQuestions },
  });

  setBreadcrumbs(
    [
      {
        label: "Openings",
        to: "/openings",
      },
      {
        label: opening.value.name,
        to: `/opening/${opening.value.reference}/edit`,
      },
      {
        to: `/opening/${opening.value.reference}/builder/${route.params.interviewRef}`,
        label: interview.value.name,
      },
    ],
    true
  );
});

const mostUsedSkills = computed(() => {
  return top10Skills.value.filter((s) => {
    return yourSkills.value.every((yourSkill) => yourSkill.value !== s.value);
  });
});

const handleSkillAdded = (skill) => {
  yourSkills.value.push(skill);
  wizard.value.push({ name: skill.label, id: skill.value });
};

const handleSkillRemoved = (skill) => {
  yourSkills.value.splice(
    yourSkills.value.findIndex((s) => {
      return s.value === skill.value;
    }),
    1
  );

  wizard.value.splice(
    wizard.value.findIndex((s) => {
      return s.id === skill.value;
    }),
    1
  );
};

const handleSkillStepSelection = (index) => {
  isSkillSelection.value = false;
  step.value = index + 1;
};
</script>

<style lang="scss" scoped>
.builder {
  display: flex;
  padding: 12px;
  &__content {
    flex-grow: 1;
  }
  &__wizard {
    min-width: 100%;
  }
  &__panel {
    @include panel;
    max-width: 30%;
    margin-left: 48px;
  }
  &__skills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    &__label {
      font-size: 14px;
      color: var(--color-text-secondary);
      margin-bottom: 12px;
    }
  }
  &__skill-selector {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    &__box {
      width: 30%;
    }
  }
  &__step {
    flex-grow: 1;
    padding: 16px;
  }
  &__header {
    border-bottom: 1px dashed var(--color-border);
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
  &__stepper {
    &__container {
      display: flex;
      flex-direction: column;
    }
    &__step-container {
      display: flex;
      gap: 12px;
      margin-bottom: 26px;
    }
    &__step {
      padding: 4px;
      border-radius: 4px;
      &__box {
        width: 24px;
        height: 24px;
        border: 1px dashed var(--color-border);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
}
</style>
