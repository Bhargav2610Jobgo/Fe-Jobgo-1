<template>
  <div class="edit-interview__container">
    <hp-modal
      :isOpen="isAddQuestionsModalOpen"
      @close="isAddQuestionsModalOpen = false"
    >
      <bulk-question-modal @questionsAdded="handleQuestionsAdded"
    /></hp-modal>
    <form>
      <hp-drawer
        :isOpen="isSearchQuestionsListOpen"
        @close="handleCloseEditDrawer"
      >
        <question-list
          :handleClose="handleCloseEditDrawer"
          @questionAdded="handleQuestionAdded"
          v-if="isSearchQuestionsListOpen"
        />
      </hp-drawer>
      <hp-drawer
        :isOpen="isCreateQuestionDrawerOpen"
        @close="handleCloseEditDrawer"
      >
        <edit-question
          :handleClose="handleCloseEditDrawer"
          :isScratch="true"
          @questionAdded="handleQuestionAdded"
          v-if="isCreateQuestionDrawerOpen"
        />
      </hp-drawer>
      <hp-drawer
        :isOpen="isEditQuestionDrawerOpen"
        @close="handleCloseEditDrawer"
      >
        <edit-question
          @handleClose="handleCloseEditDrawer"
          :question="isEditQuestionDrawerOpen"
        />
      </hp-drawer>
      <hp-drawer
        :isOpen="isViewQuestionDrawerOpen"
        @close="isViewQuestionDrawerOpen = false"
      >
        <view-question
          :question="isViewQuestionDrawerOpen"
          :handleClose="() => (isViewQuestionDrawerOpen = false)"
          v-if="isViewQuestionDrawerOpen"
        />
      </hp-drawer>
      <teleport to="#teleport-target-header">
        <hp-save-indicator
          :isLoading="isSaving"
          :meta="meta"
        ></hp-save-indicator>
      </teleport>
      <div class="edit-interview" v-if="!isInterviewLoading && !isLoading">
        <div class="edit-interview__overview">
          <router-link
            class="edit-question__back"
            :to="`/opening/${opening.reference}/edit`"
          >
            <hp-icon name="arrow-left"></hp-icon>Back
          </router-link>
          <h3 class="edit-interview__overview__title">Edit interview</h3>
          <p class="edit-interview__overview__subtitle">
            Main information for your interview. If you already have questions,
            you can add
            <span
              @click="isAddQuestionsModalOpen = true"
              class="edit-interview__overview__subtitle__link"
              >upload in bulk</span
            >.
          </p>
          <div>
            <hp-input
              @input="debouncedSubmit"
              label="Name"
              name="name"
            ></hp-input>
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
          <div class="edit-interview__overview__buttons">
            <hp-button
              class="edit-interview__overview__dropzone-button"
              @handleClick="isCreateQuestionDrawerOpen = true"
              label="Create question"
              type="button"
              icon="add-note"
              fullWidth
              primary
            ></hp-button>
            <hp-button
              @handleClick="isSearchQuestionsListOpen = true"
              label="Search questions"
              type="button"
              fullWidth
              icon="search"
            ></hp-button>
          </div>
          <div
            v-if="interview.statistics.skills.length > 0"
            class="edit-interview__overview__header"
          >
            Top skills evaluated
            <ol class="edit-interview__overview__skills">
              <hp-badge-tag
                v-for="skill in interview.statistics.skills"
                :quantity="skill.quantity"
                :label="skill.value.name"
              ></hp-badge-tag>
            </ol>
          </div>
          <hp-danger-zone
            v-if="hasEditPermission(interview)"
            class="edit-interview__danger-zone"
            label="Delete interview template"
            :onConfirm="handleDeleteInterviewTemplate"
          ></hp-danger-zone>
        </div>
        <div class="edit-interview__form">
          <h2 class="edit-interview__form__title">Interview structure</h2>
          <p class="edit-interview__form__subtitle">
            Use questions and warmup and cooldown to define the order and
            structure of your interview
          </p>
          <div class="edit-interview__ceremony">
            <div class="edit-interview__ceremony__header">
              <div>
                <h3 class="edit-interview__ceremony__header__title">
                  Before the interview
                </h3>
                <p class="edit-question__sublabel">
                  Instructions to start dialog and kick off the interview
                </p>
              </div>
              <hp-switch
                name="ceremony.warmup.enabled"
                :isDisabled="isSaving"
                @input="debouncedSubmit"
              ></hp-switch>
            </div>
            <transition name="ceremony-transition">
              <div v-show="values.ceremony.warmup.enabled">
                <hp-textarea
                  @input="debouncedSubmit"
                  :rows="6"
                  name="ceremony.warmup.content"
                />
                <div class="edit-question__duration__container">
                  <div class="edit-question__duration__labels">
                    <div class="edit-question__label">Estimated duration</div>
                  </div>
                  <hp-counter
                    class="edit-interview__ceremony__duration"
                    @input="debouncedSubmit"
                    name="ceremony.warmup.duration"
                  />
                </div>
              </div>
            </transition>
          </div>
          <ol class="edit-interview__question-cards">
            <draggable
              v-model="interview.questions"
              tag="transition-group"
              item-key="reference"
              handle=".edit-interview__question-card__handle"
              @change="handleDragChange"
              v-bind="dragOptions"
            >
              <template #item="{ element, index }">
                <li
                  :class="`edit-interview__question-card`"
                  :key="index"
                  role="option"
                  tabindex="0"
                  @keydown.down.prevent="moveItem(true, index)"
                  @keydown.up.prevent="moveItem(false, index)"
                >
                  <div class="edit-interview__question-card__container">
                    <div
                      class="edit-interview__question-card__handler-container"
                    >
                      <hp-badge icon="questions" :content="index + 1" />
                      <hp-icon
                        name="drag"
                        class="edit-interview__question-card__handle"
                      ></hp-icon>
                    </div>
                    <div class="edit-interview__question-card__content">
                      {{ element.content }}
                    </div>
                    <div class="edit-interview__question-card__flyout">
                      <hp-options-dropdown>
                        <div class="edit-interview__question-card__options">
                          <li
                            v-if="hasEditPermission(element)"
                            class="edit-interview__question-card__option"
                            @click="isEditQuestionDrawerOpen = element"
                          >
                            <div
                              class="
                                edit-interview__question-card__option__icon
                              "
                            >
                              <hp-icon size="16" name="pencil"></hp-icon>
                            </div>
                            Edit question
                          </li>
                          <li
                            class="edit-interview__question-card__option"
                            @click="isViewQuestionDrawerOpen = element"
                          >
                            <div
                              class="
                                edit-interview__question-card__option__icon
                              "
                            >
                              <hp-icon size="16" name="eye"></hp-icon>
                            </div>
                            View question
                          </li>
                          <li
                            class="edit-interview__question-card__option"
                            @click="handleRemoveQuestion(element)"
                          >
                            <div
                              class="
                                edit-interview__question-card__option__icon
                              "
                            >
                              <hp-icon size="16" name="trash"></hp-icon>
                            </div>
                            Remove question
                          </li>
                        </div>
                      </hp-options-dropdown>
                    </div>
                  </div>
                </li>
              </template>
            </draggable>
          </ol>
          <div
            class="edit-interview__ceremony edit-interview__ceremony--cooldown"
          >
            <div class="edit-interview__ceremony__header">
              <div>
                <h3 class="edit-interview__ceremony__header__title">
                  After the interview
                </h3>
                <p class="edit-interview__ceremony__header__subtitle">
                  Instructions for finishing the interview
                </p>
              </div>
              <hp-switch
                name="ceremony.cooldown.enabled"
                :isDisabled="isSaving"
                @input="debouncedSubmit"
              ></hp-switch>
            </div>
            <transition name="ceremony-transition">
              <div v-show="values.ceremony.cooldown.enabled">
                <hp-textarea
                  @input="debouncedSubmit"
                  :rows="6"
                  name="ceremony.cooldown.content"
                />
                <div class="edit-question__duration__container">
                  <div class="edit-question__duration__labels">
                    <div class="edit-question__label">Estimated duration</div>
                  </div>
                  <hp-counter
                    class="edit-interview__ceremony__duration"
                    @input="debouncedSubmit"
                    name="ceremony.cooldown.duration"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <hp-spinner v-else size="24" content />
    </form>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed, nextTick } from "vue";
import { useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import * as yup from "yup";
import draggable from "vuedraggable";

// Views
import QuestionList from "@/views/dashboard/opening/questions/question-list.vue";
import EditQuestion from "@/views/dashboard/opening/questions/edit-question.vue";
import ViewQuestion from "@/views/dashboard/opening/questions/view-question.vue";

// Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";
import HpModal from "@/components/hp-modal.vue";
import HpOptionsDropdown from "@/components/hp-options-dropdown.vue";
import HpCounter from "@/components/hp-counter.vue";
import HpSwitch from "@/components/hp-switch.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpBadgeTag from "@/components/hp-badge-tag.vue";
import HpDrawer from "@/components/hp-drawer.vue";
import HpTextarea from "@/components/form/hp-textarea.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import HpDangerZone from "@/components/cards/hp-danger-zone-card.vue";
import HpSaveIndicator from "@/components/hp-save-indicator.vue";
import BulkQuestionModal from "@/components/modals/bulk-question-modal.vue";

// Composables
import { hasEditPermission } from "@/composables/usePermissions";
import { usePut, useDelete } from "@/composables/useHttp";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import useContextSave from "@/composables/useContextSave";
import useQuestionContext from "@/composables/useQuestionContext";
import useToast from "@/composables/useToast";
import useInterviews from "@/composables/useInterviews";

const props = defineProps({
  opening: {
    type: Object,
    required: true,
  },
});

const drag = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const route = useRoute();
const router = useRouter();
const isListItemMoving = ref(false);
const isSearchQuestionsListOpen = ref(false);
const isCreateQuestionDrawerOpen = ref(false);
const isAddQuestionsModalOpen = ref(false);
const isViewQuestionDrawerOpen = ref(false);
const isEditQuestionDrawerOpen = ref(false);
const { interview, fetchInterview, isInterviewLoading, setInterview } =
  useInterviews();
const putInterview = usePut(`templates/${route.params.interviewRef}`);

const { setToast } = useToast();

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

const handleQuestionsAdded = () => {
  isAddQuestionsModalOpen.value = false;
  fetchInterview(route.params.interviewRef);
};

const handleQuestionAdded = async () => {
  await nextTick(async () => {
    const items = [
      ...document.getElementsByClassName("edit-interview__question-card"),
    ];
    items[interview.value.questions.length - 1].focus();
    items[interview.value.questions.length - 1].scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  });
  handleCloseEditDrawer();
};

const moveItem = async (moveDown, index) => {
  if (isSaving.value) {
    return;
  }
  const newIndex = moveDown ? index + 1 : index - 1;
  if (newIndex < 0 || newIndex >= interview.value.questions.length) {
    return;
  }

  const copy = [...interview.value.questions];
  const draggedItem = copy[index];

  copy.splice(index, 1);
  copy.splice(newIndex, 0, draggedItem);

  interview.value = {
    ...interview.value,
    questions: copy,
  };

  await nextTick(async () => {
    const items = [
      ...document.getElementsByClassName("edit-interview__question-card"),
    ];
    items[newIndex].focus();
    items[newIndex].scrollIntoView({ behavior: "auto", block: "center" });
    isListItemMoving.value = true;
    onSubmitWithDebounce();
  });
};

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
  isSaving.value = false;
  if (!isListItemMoving.value) {
    setInterview(putInterview.data.value.template);
  }
  isListItemMoving.value = false;

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
        label: props.opening.name,
        to: `/opening/${props.opening.reference}/edit`,
      },
      {
        to: `/opening/${props.opening.reference}/edit/edit-interview/${route.params.interviewRef}`,
        label: interview.value.name,
      },
    ],
    true
  );
});

const onSubmitWithDebounce = useDebounceFn(() => {
  onSubmit();
}, 500);

const debouncedSubmit = () => {
  isSaving.value = true;
  onSubmitWithDebounce();
};

const { setBreadcrumbs } = useBreadcrumbs();
useContextSave(meta);

onMounted(async () => {
  await fetchInterview(route.params.interviewRef);
  resetForm({ touched: false, values: interview.value });

  setBreadcrumbs(
    [
      {
        label: "Openings",
        to: "/openings",
      },
      {
        label: props.opening.name,
        to: `/opening/${props.opening.reference}/edit`,
      },
      {
        to: `/opening/${props.opening.reference}/edit/edit-interview/${route.params.interviewRef}`,
        label: interview.value.name,
      },
    ],
    true
  );
  isLoading.value = false;
});

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
});

const handleDragChange = () => {
  setFieldValue("questions", interview.value.questions);
  onSubmit();
};

const handleRemoveQuestion = async (template) => {
  const putInterview = usePut(`templates/${route.params.interviewRef}`);

  await putInterview.put({
    template: {
      ...interview.value,
      ceremony: {
        warmup: {
          ...interview.value.ceremony.warmup,
          duration: interview.value.ceremony.warmup.duration * 60,
        },
        cooldown: {
          ...interview.value.ceremony.cooldown,
          duration: interview.value.ceremony.cooldown.duration * 60,
        },
      },
      questions: interview.value.questions
        .map((q) => q.reference)
        .filter((q) => q !== template.reference),
    },
  });
  setInterview(putInterview.data.value.template);
};

const handleDeleteInterviewTemplate = async () => {
  const deleteInterview = useDelete(`templates/${route.params.interviewRef}`);
  await deleteInterview.remove();
  router.push(`/opening/${route.params.openingRef}/edit`);
  setToast({
    type: "positive",
    title: "It had to be done!",
    message: "That nasty interview is finally gone",
  });
};

onKeyStroke("Escape", (e) => {
  handleCloseEditDrawer();
});

const handleCloseEditDrawer = async () => {
  const handleClose = () => {
    isEditQuestionDrawerOpen.value = false;
    isSearchQuestionsListOpen.value = false;
    isCreateQuestionDrawerOpen.value = false;
  };

  const { isDirty, type, clearIsDirty, handleSubmitFunc } =
    useQuestionContext();

  if (isDirty.value) {
    await handleSubmitFunc.value();
    handleClose();
  } else {
    handleClose();
  }
};
</script>

<styles lang="scss">
.edit-interview {
  display: flex;
  flex-direction: column;
  &__overview-container {
    height: 100%;
  }
  &__container {
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    position: relative;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  &__title {
    @include text-h2;
    font-weight: 600;
  }
  &__subtitle {
    @include text-h5;
    color: var(--color-text-secondary);
    margin-bottom: 32px;
  }
  &__questions-button {
    margin-top: 16px;
    padding-bottom: 24px;
  }
  &__ceremony {
    border: 1px solid var(--color-border);
    padding: 12px;
    padding-bottom: 0;
    border-radius: $border-radius-sm;
    margin-bottom: 16px;
    &__duration {
      margin-bottom: 12px;
    }
    &--cooldown {
      margin-bottom: 16px;
    }
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      &__title {
        @include text-h5;
        font-weight: 500;
      }
      &__subtitle {
        color: var(--color-text-secondary);
      }
    }
  }
  &__question-card {
    @include flyout;
    border-radius: 8px;
    padding: 16px;
    box-shadow: none;
    margin-bottom: 16px;
    &:focus {
      outline: 4px solid var(--color-focus);
    }
    &__container {
      display: flex;
    }
    &__option {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: $border-radius-sm;
      line-height: 20px;
      cursor: pointer;
      white-space: pre;
      transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      &:hover {
        background-color: var(--color-forground-floating);
      }
      &__icon {
        margin-right: 8px;
        color: var(--color-text-secondary);
      }
    }
    &__content {
      @include text-h5;
      font-weight: 500;
      flex: 1;
    }
    &__handle {
      cursor: grab;
      margin-right: 8px;
      &:active {
        cursor: grabbing;
      }
    }
    &__handler-container {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      margin-right: 16px;
    }
    &__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      &__button-group {
        display: flex;
        align-items: center;
      }
      &__button {
        margin-right: 6px;
      }
    }
  }

  &__overview {
    display: none;
    @include panel;
    margin-bottom: 24px;
    overscroll-behavior: none;
    &__buttons {
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px dashed var(--color-border);
      gap: 12px;
    }
    &__title {
      @include text-h4;
      font-weight: 500;
    }
    &__subtitle {
      @include text-h5;
      margin: 0;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
      &__link {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    &__input {
      border-bottom: 1px dashed var(--color-border);
      margin-bottom: 16px;
    }
    &__skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      margin-bottom: 32px;
    }
    &__header {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 4px;
    }
    &__description {
      color: var(--color-text-secondary);
      margin-bottom: 12px;
    }
    &__cta {
      border-bottom: 1px dashed var(--color-border);
      margin-bottom: 16px;
      padding-bottom: 16px;
    }
    &__stats {
      display: flex;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px dashed var(--color-border);
      margin-bottom: 16px;
      &__stat {
        border-radius: $border-radius-sm;
        border: $border;
        padding: 4px;
        display: flex;
        align-content: center;
        align-items: center;
        padding: 8px;
        width: 100%;
        &__icon {
          color: var(--color-text-secondary);
          margin-right: 6px;
        }
        &__text {
          white-space: nowrap;
        }
      }
    }
  }
}

@media (min-width: $breakpoint-tablet) {
  .edit-interview {
    width: 100%;
    display: grid;
    grid-template-columns: 30% auto;
    &__form {
      margin-left: 96px;
      padding-bottom: 120px;
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
    &__overview {
      display: flex;
      overflow: scroll;
      max-height: calc(100vh - 120px);
      position: sticky;
      top: 90px;
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  background-color: var(--color-panel);
  border: 1px solid var(--blue--500);
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

.ceremony-transition {
  transform: translateY(0);
}
.ceremony-transition-enter-active,
.ceremony-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.ceremony-transition-enter-from,
.ceremony-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</styles>
