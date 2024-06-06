<template>
  <div class="edit-question">
    <div class="edit-question__header">
      <h2 class="edit-question__title">{{ content.title }}</h2>
      <p class="edit-question__subtitle">
        This is the question prompt, it is important that this is readable
      </p>
    </div>
    <form @submit.prevent="onSubmit" class="edit-question__form">
      <div class="edit-question__question">
        <hp-textarea
          ref="questionInputRef"
          name="content"
          placeholder="Type the question"
          maxlength="240"
        ></hp-textarea>
      </div>
      <div class="edit-question__duration">
        <div class="edit-question__duration__labels">
          <div class="edit-question__label">Skill</div>
          <div class="edit-question__sublabel">
            Which job-related skill or attribute does this question measure?
          </div>
        </div>
        <hp-skill-search
          @onChange="handleSkillChange"
          :canAdd="true"
          placeholder="Search for skills"
          :value="question?.skill?.name || ''"
        />
      </div>
      <div class="edit-question__dropdowns">
        <div class="edit-question__duration__container">
          <div class="edit-question__duration__labels">
            <div class="edit-question__label">Duration time</div>
            <div class="edit-question__sublabel">
              Expected duration, in minutes
            </div>
          </div>
          <hp-counter name="duration" />
        </div>
        <div class="edit-question__duration__error">{{ errors.duration }}</div>
      </div>
      <div class="edit-question__guidelines">
        <div class="edit-question__label">Evaluation criteria</div>
        <div class="edit-question__sublabel">
          Describe what you would see in a perfect answer
        </div>
        <hp-multi-input name="guidelines" />
      </div>
      <div class="edit-question__actions">
        <hp-button
          :isDisabled="!meta.dirty || !meta.valid"
          primary
          type="submit"
          :isLoading="isSaving"
          :label="content.action"
        />
      </div>
    </form>
    <hp-danger-zone
      v-if="isEdit"
      class="edit-interview__danger-zone"
      label="Delete question template"
      :onConfirm="handleDeleteQuestiontemplate"
    ></hp-danger-zone>
  </div>
</template>

<script setup>
//Vendor
import * as yup from "yup";
import { ref, watchEffect } from "vue";
import { useForm } from "vee-validate";
import { useRoute } from "vue-router";

//Components
import HpTextarea from "@/components/form/hp-textarea.vue";
import HpCounter from "@/components/hp-counter.vue";
import HpButton from "@/components/hp-button.vue";
import HpSkillSearch from "@/components/hp-skill-search.vue";
import HpDangerZone from "@/components/cards/hp-danger-zone-card.vue";
import HpMultiInput from "@/components/form/hp-multi-input.vue";

// Composables
import useInterviews from "@/composables/useInterviews";
import { useGettingStarted } from "@/composables/useGettingStarted";
import useToast from "@/composables/useToast";
import { usePost, usePut, useDelete } from "@/composables/useHttp";
import useQuestionContext from "@/composables/useQuestionContext";

const props = defineProps({
  question: {
    type: Object,
  },
});

const isEdit = props.question;

const content = isEdit
  ? {
      title: "Edit question",
      action: "Save changes",
    }
  : { title: "Create question", action: "Create question" };

const emits = defineEmits(["handleClose", "questionAdded"]);

const skill = ref(props.question?.skill?.reference);

const { fetchChecklist } = useGettingStarted();

const isSaving = ref(false);
const questionInputRef = ref(null);

watchEffect(() => {
  if (questionInputRef.value) {
    questionInputRef.value.inputRef.focus();
  }
});

const route = useRoute();

const schema = yup.object({
  content: yup.string().required("A question is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .min(0)
    .max(60)
    .required("A duration is required"),
  skill: yup.string().required("A skill is required"),
  guidelines: yup.array(),
});

let initialValues = {
  duration: 5,
};

if (props.question) {
  const formattedInitialValues = {
    content: props.question.content,
    duration: props.question.duration / 60,
    guidelines: props.question.guidelines,
    skill: skill.value,
  };
  initialValues = formattedInitialValues;
}

const { handleSubmit, meta, errors, setValues, values } = useForm({
  validationSchema: schema,
  initialValues: initialValues,
});

// State that interacts with parent to make sure we don't accidently close the modal
const { clearIsDirty, handleSubmitFunc } = useQuestionContext(meta, "edit");

const { fetchInterview, setInterview } = useInterviews();
const { setToast } = useToast();

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  const formattedValues = {
    ...values,
    scoring: "likert",
    type: "open",
    duration: values.duration * 60,
    guidelines: values.guidelines
      ? values.guidelines.filter((g) => g !== "")
      : [],
  };

  if (props.question?.reference) {
    const putQuestion = usePut(`questions/${props.question.reference}`);
    await putQuestion.put({
      question: { ...formattedValues },
    });
    await fetchInterview(route.params.interviewRef);
    setToast({
      type: "positive",
      title: "Well done!",
      message: `Question edited successfully`,
    });
  } else {
    const postQuestion = usePost("questions");
    await postQuestion.post({
      question: { ...formattedValues, templates: [route.params.interviewRef] },
    });
    const postTemplateQuestion = usePost(
      `templates/${route.params.interviewRef}/questions`
    );
    await postTemplateQuestion.post({
      question: postQuestion.data.value.question.reference,
    });
    setInterview(postTemplateQuestion.data.value.template);
    fetchChecklist();
    emits("questionAdded");
    setToast({
      type: "positive",
      title: "Well done!",
      message: `Question created and added to interview`,
    });
  }

  // Must clear dirty to handle close
  clearIsDirty();
  emits("handleClose");
  isSaving.value = false;
});

const handleDeleteQuestiontemplate = async () => {
  const deleteQuestion = useDelete(`questions/${props.question.reference}`);
  await deleteQuestion.remove();
  emits("handleClose");
  await fetchInterview(route.params.interviewRef);
  setToast({
    type: "positive",
    title: "Oh my!",
    message: `That question is now in the trash bin`,
  });
};

const handleSkillChange = (newSkill) => {
  setValues({ ...values, skill: newSkill.value });
};

handleSubmitFunc.value = onSubmit;
</script>

<style lang="scss">
.edit-question {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 64px);
  overflow-y: scroll;
  padding: 16px;
  &::-webkit-scrollbar {
    display: none;
  }
  &__back {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 16px;
  }
  &__header {
    margin-bottom: 16px;
  }
  &__title {
    @include text-h4;
    font-weight: 500;
  }
  &__subtitle {
    @include text-h5;
    color: var(--color-text-secondary);
  }
  &__question {
    border-bottom: 1px dashed var(--color-border);
    margin-bottom: 16px;
  }
  &__label {
    font-weight: 500;
    @include text-h5;
  }
  &__sublabel {
    @include text-h5;
    font-weight: 300;
    color: var(--color-text-secondary);
    &--bold {
      font-weight: 500;
    }
  }
  &__guidelines {
    padding-top: 16px;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  &__duration {
    display: flex;
    flex-direction: column;
    border-bottom: 1px dashed var(--color-border);
    &__container {
      display: flex;
      justify-content: space-between;
      align-content: center;
    }
    &__labels {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
    &__error {
      color: var(--color-error);
      font-weight: 500;
    }
  }
  &__dropdowns {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    padding-bottom: 16px;
    padding-top: 16px;
    border-bottom: 1px dashed var(--color-border);
  }
  &__actions {
    display: flex;
    justify-content: start;
    background-color: var(--color-background);
    z-index: $z-index-1000;
    position: fixed;
    bottom: 0;
    padding: 16px;
    right: 0;
    width: 33%;
    max-width: $drawer-max-width;
    border-top: 1px dashed var(--color-border);
  }
}
</style>
