<template>
  <component :is="tag" :isDisabled="isAddCard || isArchived" :class="containerClasses" :to="linkValue">
    <div :class="`hp-opening-card__add-new`" v-if="!isAddCard">

      <!-- <div
        @click.capture.stop="handleDeleteOpening(opening?.id)"
        class="hp-opening-card__add-new__icon-container"
      >
      <hp-icon class="delete__icon" style="width: 45px;display: flex;justify-content: end ;fill: gray" :size="24" name="delete" ></hp-icon>
      </div> -->
      <div style="margin-top: 0.4rem; width: 100%;">
        <p class="hp-opening-card__content__name project_title">{{ opening?.jobPosition }}
          <span>
            <router-link :to="`/openings/upload?projectId=${opening?.id}`">
              <hp-icon :size="24" name="upload"></hp-icon>
            </router-link>
          </span>
        </p>
        <p class="hp-opening-card__content__description">
          {{ opening?.experience }}
        </p>
        <p class="hp-opening-card__content__education">
          {{ opening?.education }}
        </p>
        <p class="hp-opening-card__content__location">
          {{ opening?.location }}
        </p>
      </div>
    </div>
    <div :class="`hp-opening-card__add-new`"
      style="display: flex;align-items: center;align-items: center;flex-direction: column;justify-content:center"
      v-else-if="isAddCard">
      <div style="display: flex;">
        <div class="hp-opening-card__add-new__icon-container" style="margin-right: 10px;">
          <router-link to="/chat">
            <hp-icon :size="35" name="plus"></hp-icon>
          </router-link>
        </div>
        <div class="hp-opening-card__add-new__icon-container" style="margin-top: 10px;">
          <router-link to="/voicechat">
            <hp-icon :size="35" name="mic"></hp-icon>
          </router-link>
        </div>
      </div>

      <div class="hp-opening-card__add-new__heading">
        <h3>Click to Create New opening</h3>
      </div>
    </div>
  </component>
</template>

<script setup>
// Vendor
import { computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { useDelete } from "@/composables/useHttp";

// Components
import HpButton from "@/components/hp-button.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpAbstractAvatar from "@/components/hp-abstract-avatar.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpUpgrade from "@/components/hp-upgrade.vue";
import useToast from "@/composables/useToast";

// Composables
import useAuth from "@/composables/useAuth";
import usePlans from "@/composables/usePlans";
import useOpenings from "@/composables/useOpenings";
import usePermissions from "@/composables/usePermissions";
const { setToast } = useToast();

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

const emits = defineEmits([
  "unarchiveOpening",
  "refreshOpenings",
]);

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

  return `/presentation?jobId=${props.opening?.id}`;
});
const handleDeleteOpening = async (id) => {
  if (id) {
    const deleteOpening = useDelete(`opening/${id}`);
    await deleteOpening.remove();
    setToast({
      type: "positive",
      title: "Delete",
      message: "That opining is finally gone",
    });
    emits("refreshOpenings");
  }
};
</script>

<style lang="scss" scoped>

.hp-opening-card__add-new__icon-container[data-v-67238504]:hover {
 background-color: transparent !important;
}

.hp-opening-card {
  width: 264px;
  min-height: 200px;
  list-style: none;
  cursor: pointer;
  // border-radius: $border-radius-lg;

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
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 4px;
    }

    &__description {
      // font-weight: 800;
      flex: 1;
      color: var(--color-text-secondary);
      margin: 8px 0;
      font-size: 18px;
    }

    &__education {
      // margin: 8px 0;
      font-size: 18px;
      flex: 1;
      color: var(--color-text-secondary);
    }

    &__location {
      margin: 8px 0;
      font-size: 18px;
      flex: 1;
      color: var(--color-text-secondary);
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
    position: relative;
    box-shadow: rgba(123, 121, 121, 0.35) 0px 5px 15px;
    // border: 2px solid grey;

    // border-radius: 10px;
    // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    // box-shadow: 1px 1px 1px #bebebe,
    //            -1px -1px 3px #ffffff;
    // justify-content: space-between;
    height: 100%;

    &__heading {
      margin-top: 1.5rem;
    }

    &__icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      // position: absolute;
      // right: 10px;
      // cursor: pointer;
      // height: 40px;
      // width: 40px;
      // // border-radius: $border-radius-lg;
      // margin-bottom: 16px;

      &delete__icon {}

      &:hover {
        background: var(--color-panel);
      }
    }
  }
}

.project_title {
  display: flex;
  justify-content: space-between;
}
</style>