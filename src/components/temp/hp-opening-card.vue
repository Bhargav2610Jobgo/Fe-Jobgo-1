<template>
    <component
      :is="tag"
      :isDisabled="isAddCard || isArchived"
      :to="linkValue"
      :class="containerClasses"
    >
    
      <div
        :class="`hp-opening-card__add-new`"
        v-if="isAddCard && !hasMaxOpenings"
      >
        <div>
          <div
            @click="$emit('handleAddNew')"
            class="hp-opening-card__add-new__icon-container"
          >
            <hp-icon :size="24" name="plus"></hp-icon>
          </div>
          <p class="hp-opening-card__content__name">New opening</p>
          <p class="hp-opening-card__content__description">
            Easily define a new opening
          </p>
        </div>
        <div>
          <hp-button
            @handleClick="$emit('handleAddNew')"
            label="Create new"
          ></hp-button>
        </div>
      </div>
      <div :class="`hp-opening-card__add-new`" v-if="isAddCard && hasMaxOpenings">
        <div class="hp-opening-card__upgrade-container">
          <div class="hp-opening-card__add-new__icon-container">
            <hp-icon :size="24" name="plus"></hp-icon>
          </div>
          <hp-upgrade />
        </div>
        <p class="hp-opening-card__content__name">
          {{ `${openings.length}/${getPlanVariable("openings")} openings` }}
        </p>
        <p class="hp-opening-card__content__description">
          You have reached the maximum amount of openings. Upgrade to open more.
          If you have any questions, contact us.
        </p>
        <hp-button isDisabled label="Create new"></hp-button>
      </div>
      <div class="hp-opening-card__archived" v-if="isArchived">
        <div class="hp-opening-card__archived-header">
          <hp-abstract-avatar :abstractKey="opening.artwork" />
          <hp-button
            @handleClick="$emit('unarchiveOpening', opening)"
            label="Restore"
          >
          </hp-button>
        </div>
        <div class="hp-opening-card__content">
          <h4 class="hp-opening-card__content__name">{{ opening.name }}</h4>
          <div class="hp-opening-card__content__description">
            {{ opening.description }}
          </div>
          <div class="hp-opening-card__content__badges">
            <hp-badge
              icon="layers"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.templates"
            ></hp-badge>
            <hp-badge
              icon="skills"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.skills.length"
            ></hp-badge>
            <hp-badge
              icon="candidates"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.candidates"
            ></hp-badge>
          </div>
        </div>
      </div>
      <div
        class="hp-opening-card__content-container"
        v-if="!isArchived && !isAddCard"
      >
        <div class="hp-opening-card__splash">
          <hp-badge
            v-if="organization"
            class="hp-opening-card__content__role"
            icon="shield"
            :content="currentPermLevel"
          ></hp-badge>
          <component
            :is="splash"
            role="img"
            :alt="splash"
            :key="opening.reference"
            class="hp-opening-card__splash__image"
          />
        </div>
        <div class="hp-opening-card__content">
          <h4 class="hp-opening-card__content__name">{{ opening.name }}</h4>
          <div class="hp-opening-card__content__description">
            {{ opening.description }}
          </div>
          <div class="hp-opening-card__content__badges">
            <hp-badge
              icon="layers"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.templates"
            ></hp-badge>
            <hp-badge
              icon="skills"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.skills.length"
            ></hp-badge>
            <hp-badge
              icon="candidates"
              class="hp-opening-card__content__badges__badge"
              :content="opening.statistics.candidates"
            ></hp-badge>
          </div>
        </div>
      </div>
    </component>
  </template>
  
  <script setup>
  // Vendor
  import { computed, defineAsyncComponent } from "vue";
  import { useRoute } from "vue-router";
  
  // Components
  import HpButton from "@/components/hp-button.vue";
  import HpBadge from "@/components/hp-badge.vue";
  import HpAbstractAvatar from "@/components/hp-abstract-avatar.vue";
  import HpIcon from "@/components/hp-icon.vue";
  import HpUpgrade from "@/components/hp-upgrade.vue";
  
  // Composables
  import useAuth from "@/composables/useAuth";
  import usePlans from "@/composables/usePlans";
  import useOpenings from "@/composables/useOpenings";
  import usePermissions from "@/composables/usePermissions";
  
  const props = defineProps({
    opening: {
      type: Object,
      default: () => ({}),
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isAddCard: {
      type: Boolean,
      default: false,
    },
  });
  
  const { organization } = useAuth();
  const { COLLABORATORS } = usePermissions();
  
  const currentPermLevel = COLLABORATORS[props.opening?.permissions?.role]?.label;
  
  const { openings } = useOpenings();
  const { getPlanVariable } = usePlans();
  
  const tag = props.isAddCard || props.isArchived ? "div" : "router-link";
  
  const route = useRoute();
  
  const emits = defineEmits(["unarchiveOpening, handleAddNew"]);
  
  const splash = defineAsyncComponent(() =>
    import(
      /* @vite-ignore */ `../../assets/abstracts/covers/cover_${props.opening.artwork}.svg`
    )
  );
  const hasMaxOpenings = computed(() => {
    return openings.value.length >= getPlanVariable("openings");
  });
  
  const containerClasses = computed(() => {
    return {
      "hp-opening-card": true,
      "hp-opening-card--add-new": props.isAddCard,
      "hp-opening-card--selected": props.isSelected,
      "hp-opening-card--archived": props.isArchived,
    };
  });
  
  const linkValue = computed(() => {
    // if (props.opening.permissions?.role === "member") {
    //   return `/opening/${props.opening.reference}/edit`;
    // }
    // if (props.opening.reference === route.params.openingRef) {
    //   return `/openings`;
    // }   // if (props.opening.permissions?.role === "member") {
    //   return `/opening/${props.opening.reference}/edit`;
    // }
    // if (props.opening.reference === route.params.openingRef) {
    //   return `/openings`;
    // }
    return `/job-presentation/${props.opening?.id}`;
  });
  </script>
  
  <style lang="scss">
  .hp-opening-card {
    width: 264px;
    min-height: 236px;
    list-style: none;
    cursor: pointer;
    border-radius: $border-radius-lg;
    border: 1px solid var(--color-border);
    &--add-new {
      cursor: default;
    }
    &--archived {
      cursor: default;
      .hp-opening-card__content {
        opacity: 0.5;
        pointer-events: none;
      }
    }
    &--selected {
      background-color: var(--color-panel);
    }
    &:hover {
      box-shadow: inset 0px 0px 4px rgba(33, 44, 51, 0.01),
        inset 0px 0px 48px rgba(33, 44, 51, 0.03);
    }
    &--add-new {
      &:hover {
        box-shadow: none;
      }
    }
    &:focus {
      outline: 4px solid var(--color-focus);
    }
    &__upgrade-container {
      display: flex;
      justify-content: space-between;
    }
    &__splash {
      flex-shrink: 0;
      min-height: 84px;
      position: relative;
      &__image {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
    }
    &__content-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &__content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      &__name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      &__description {
        flex: 1;
        color: var(--color-text-secondary);
        padding-bottom: 12px;
      }
      &__role {
        position: absolute;
        top: 6px;
        right: 6px;
        color: var(--color-accent-forground);
        border-color: var(--color-accent-forground);
      }
      &__badges {
        text-transform: capitalize;
        display: flex;
        &__badge {
          margin-right: 6px;
        }
      }
    }
    &__archived {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &__archived-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
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
        cursor: pointer;
        height: 40px;
        width: 40px;
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
  