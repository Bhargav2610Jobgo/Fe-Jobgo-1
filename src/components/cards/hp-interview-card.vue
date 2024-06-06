<template>
  <li class="hp-interview-card">
    <hp-drawer
      @close="isViewInterviewDrawerOpen = false"
      :isOpen="isViewInterviewDrawerOpen"
    >
      <view-interview :template="template" />
    </hp-drawer>
    <div class="hp-interview-card__add-new" v-if="isAddCard">
      <div>
        <router-link
          :to="`/opening/${route.params.openingRef}/edit/add-interview`"
          class="hp-interview-card__add-new__icon-container"
        >
          <hp-icon :size="24" name="plus"></hp-icon>
        </router-link>
        <p class="hp-interview-card__content__name">Add interview</p>
        <p class="hp-interview-card__content__description">
          Add new interview to the process
        </p>
      </div>
      <div>
        <hp-button
          :to="`/opening/${route.params.openingRef}/edit/add-interview`"
          label="Add interview"
        ></hp-button>
      </div>
    </div>
    <div class="hp-interview-card__content" v-else>
      <div class="hp-interview-card__badge-container">
        <hp-badge
          icon="layers"
          :tooltip="`Interview #${index}`"
          :content="index"
        ></hp-badge>
        <hp-icon
          class="hp-interview-card__badge-container__handle"
          name="drag"
          size="24"
        ></hp-icon>
      </div>
      <div class="hp-interview-card__name">{{ template.name }}</div>
      <div class="hp-interview-card__fact">
        <hp-icon
          class="hp-interview-card__fact__icon"
          name="chronometer"
          :size="15"
        ></hp-icon>
        {{ secondsToMinutes(template.statistics.duration) }} minutes
      </div>
      <div class="hp-interview-card__fact">
        <hp-icon
          class="hp-interview-card__fact__icon"
          name="questions"
          :size="15"
        ></hp-icon>

        {{ template.statistics.questions }} questions
      </div>
      <div class="hp-interview-card__fact">
        <hp-icon
          class="hp-interview-card__fact__icon"
          name="skills"
          :size="15"
        ></hp-icon>

        {{ template.statistics.skills.length }} skills
        <hp-info-circle
          class="hp-question-card-stats__stats__stat__info-circle"
          :content="
            template.statistics.skills
              .map((skill) => skill.value.name)
              .join(', ')
          "
          v-if="template.statistics.skills.length > 0"
        ></hp-info-circle>
      </div>
      <div class="hp-interview-card__actions">
        <div class="hp-interview-card__actions__button-group">
          <hp-button
            v-if="hasEditPermission(template)"
            label="Edit interview"
            class="hp-interview-card__actions__button"
            :to="`/opening/${route.params.openingRef}/edit/edit-interview/${template.reference}`"
          ></hp-button>
          <hp-tooltip :delay="500">
            <hp-button
              icon="eye"
              @handleClick="isViewInterviewDrawerOpen = true"
            ></hp-button>
            <template #content>View interview</template>
          </hp-tooltip>
        </div>
        <hp-tooltip :delay="500">
          <hp-button
            icon="trash"
            danger
            @handleClick="$emit('handleRemove', template.reference)"
          ></hp-button>
          <template #content>Remove interview</template>
        </hp-tooltip>
      </div>
    </div>
  </li>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import { useRoute } from "vue-router";

// Views
import ViewInterview from "@/views/dashboard/opening/view-interview.vue";

// Component
import HpDrawer from "@/components/hp-drawer.vue";
import HpButton from "@/components/hp-button.vue";
import HpTooltip from "@/components/hp-tooltip.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpInfoCircle from "@/components/hp-info-circle.vue";

// Composables
import { hasEditPermission } from "@/composables/usePermissions.js";

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

const emits = defineEmits(["handleRemove"]);

const isViewInterviewDrawerOpen = ref(false);

const route = useRoute();

const secondsToMinutes = (seconds) => {
  return Math.floor(seconds / 60);
};
</script>

<style lang="scss">
.hp-interview-card {
  height: 236px;
  width: 264px;
  list-style: none;
  border-radius: $border-radius-lg;
  border: $border;
  &__name {
    font-weight: 500;
    @include text-h5;
    margin-bottom: 16px;
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
    height: 100%;
  }
  &__fact {
    display: flex;
    flex-direction: row;
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
    justify-content: space-between;
    &__button-group {
      display: flex;
      align-items: center;
    }
    &__button {
      margin-right: 6px;
    }
  }

  &--selected {
    background-color: var(--color-panel);
  }
  &:hover {
    box-shadow: inset 0px 0px 4px rgba(33, 44, 51, 0.01),
      inset 0px 0px 48px rgba(33, 44, 51, 0.03);
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
      border: 1px dashed var(--color-border);
      border-radius: $border-radius-lg;
      margin-bottom: 16px;
    }
  }
}
</style>
