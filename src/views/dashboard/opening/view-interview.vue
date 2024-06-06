<template>
  <div v-if="!isInterviewLoading" class="view-interview">
    <h2 class="view-interview__title">{{ interview.name }}</h2>
    <div v-if="interview.description">
      <div class="view-interview__header">Description</div>
      <p class="view-interview__description">{{ interview.description }}</p>
    </div>
    <div class="view-interview__header">Overview</div>
    <div class="view-interview__stats">
      <div class="view-interview__stats__stat">
        <hp-icon
          class="view-interview__stats__stat__icon"
          name="chronometer"
        ></hp-icon>
        <div class="view-interview__stats__stat__text">
          {{ (interview.statistics.duration / 60).toFixed(0) }} minutes
        </div>
      </div>
      <div class="view-interview__stats__stat">
        <hp-icon
          class="view-interview__stats__stat__icon"
          name="questions"
        ></hp-icon>
        <div class="view-interview__stats__stat__text">
          {{ interview.statistics.questions }} questions
        </div>
      </div>
    </div>
    <div
      v-if="interview.statistics.skills.length > 0"
      class="view-interview__header"
    >
      Top skills evaluated
      <ol class="view-interview__skills">
        <hp-badge-tag
          v-for="skill in interview.statistics.skills"
          :quantity="skill.quantity"
          :label="skill.value.name"
        ></hp-badge-tag>
      </ol>
    </div>
    <div class="view-interview__scroll-container">
      <div class="view-interview__ceremony view-interview__ceremony--warmup">
        <div class="view-interview__ceremony__header">
          <h3 class="view-interview__header">Warmup</h3>
          <hp-badge
            icon="chronometer"
            :content="interview.ceremony.warmup.duration"
          ></hp-badge>
        </div>
        <div class="view-interview__ceremony__textarea">
          {{ interview.ceremony.warmup.content }}
        </div>
      </div>
      <div class="view-interview__ceremony view-interview__ceremony--cooldown">
        <div class="view-interview__ceremony__header">
          <h3 class="view-interview__header">Cooldown</h3>
          <hp-badge
            icon="chronometer"
            :content="interview.ceremony.cooldown.duration"
          ></hp-badge>
        </div>
        <div class="view-interview__ceremony__textarea">
          {{ interview.ceremony.cooldown.content }}
        </div>
      </div>
      <div
        class="view-interview__questions"
        v-if="interview.questions.length > 0"
      >
        <h3 class="view-interview__header">Questions</h3>
        <ol class="view-interview__question-container">
          <li
            class="view-interview__question"
            v-for="question in interview.questions"
          >
            <div class="view-interview__question__header">
              <div class="view-interview__question__textarea">
                {{ question.content }}
              </div>
              <hp-badge
                class="view-interview__question__badge"
                icon="chronometer"
                :content="(question.duration / 60).toFixed(0)"
              >
              </hp-badge>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
//Vendor
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

//Components
import HpIcon from "@/components/hp-icon.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpBadgeTag from "@/components/hp-badge-tag.vue";

//Hooks
import useInterviews from "@/composables/useInterviews";

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
});
const isLoading = ref(false);

const { interview, fetchInterview, isInterviewLoading, setInterview } =
  useInterviews();

const schema = yup.object({
  name: yup.string().required("Interview name is required"),
  description: yup.string().nullable(),
  ceremony: yup.object({
    cooldown: yup.object({
      content: yup.string(),
      duration: yup.number(),
    }),
    warmup: yup.object({
      content: yup.string(),
      duration: yup.number(),
    }),
  }),
  questions: yup.array(),
});

const { setFieldValue, resetForm } = useForm({
  validationSchema: schema,
  validateOnMount: false,
});

onMounted(async () => {
  await fetchInterview(props.template.reference);
  resetForm({ touched: false, values: interview.value });
});
</script>

<styles lang="scss">
.view-interview {
  padding: 26px;
  padding-bottom: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  &__title {
    font-weight: bold;
    margin-bottom: 6px;
  }
  &__header {
    font-weight: 500;
    @include text-h5;
  }
  &__description {
    margin-bottom: 12px;
    margin-top: 6px;
  }
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--color-border);
    margin-bottom: 16px;
    margin-top: 16px;
    &__stat {
      border-radius: $border-radius-sm;
      border: $border;
      padding: 4px;
      display: flex;
      align-content: center;
      align-items: center;
      padding: 8px;
      background-color: var(--color-panel);
      &__icon {
        color: var(--color-text-secondary);
        margin-right: 6px;
      }
      &__text {
        white-space: nowrap;
      }
    }
  }
  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--color-border);
  }
  &__ceremony {
    margin-top: 16px;
    &--warmup {
      padding-top: 16px;
    }
    &--cooldown {
      margin-bottom: 16px;
    }
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      &__title {
        font-weight: 500;
      }
    }
    &__textarea {
      padding: 12px;
      border: $border;
      border-radius: $border-radius-sm;
      background-color: var(--color-panel);
    }
  }
  &__scroll-container {
    overflow: scroll;
    flex-grow: 1;
    &::-webkit-scrollbar {
      width: 0px;
    }
  }
  &__questions {
    border-top: 1px dashed var(--color-border);
    padding-top: 16px;
    padding-bottom: 56px;
    overflow: scroll;
    &__title {
      margin-bottom: 16px;
      font-weight: 500;
    }
  }
  &__question-container {
    margin-top: 16px;
  }
  &__question {
    background-color: var(--color-panel);
    border-radius: $border-radius-sm;
    border: $border;
    margin-bottom: 12px;
    padding: 12px;
    &__header {
      display: flex;
      justify-content: space-between;
    }
    &__textarea {
      font-weight: 500;
    }
  }
}
</styles>
