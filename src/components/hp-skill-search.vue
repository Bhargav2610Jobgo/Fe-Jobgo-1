<template>
  <div class="hp-skill-search">
    <hp-input
      icon="skills"
      standalone
      name="skillSearch"
      :placeholder="placeholder"
      :value="skillSearch"
      @input="onInput($event.target.value)"
    ></hp-input>
    <transition name="flyout-transition">
      <div v-if="isFlyoutOpen" class="hp-skill-search__flyout">
        <button
          class="
            hp-skill-search__flyout__option hp-skill-search__flyout__option--add
          "
          v-if="isAvailableToAddSkill"
          type="button"
          @click="addNewSkill"
        >
          <hp-icon
            class="hp-skill-search__flyout__option__icon"
            :size="14"
            name="plus"
          ></hp-icon>
          Add "{{ skillSearch }}" to list of skills
        </button>
        <div class="hp-skill-search__flyout__loader" v-if="isLoading">
          <hp-spinner></hp-spinner>
        </div>
        <div v-if="skills.length > 0 && !isLoading">
          <button
            tabIndex="0"
            type="button"
            class="
              hp-skill-search__flyout__option
              hp-skill-search__flyout__option--value
            "
            v-for="skill in skills"
            @click="handleSkillSelection(skill)"
          >
            {{ skill.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// Vendor
import { ref, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";

// Components
import HpIcon from "@/components/hp-icon.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import useSkillSearch from "@/composables/useSkillSearch";
import useToast from "@/composables/useToast";

// Composables
import { usePost } from "@/composables/useHttp";

const { setToast } = useToast();

const props = defineProps({
  canAdd: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["onChange"]);

const skills = ref([]);

const { handleSkillSearch } = useSkillSearch();

const isFlyoutOpen = ref(false);
const isLoading = ref(false);
const skillSearch = ref(props.value);

const onInput = (value) => {
  skillSearch.value = value;
  handleInputChange();
};

const handleInputChange = useDebounceFn(async () => {
  if (skillSearch.value === "") {
    isFlyoutOpen.value = false;
  }

  isLoading.value = true;

  if (!isFlyoutOpen.value && skillSearch.value !== "") {
    isFlyoutOpen.value = true;
  }

  const results = await handleSkillSearch(skillSearch.value);
  skills.value = results;
  isLoading.value = false;
}, 150);

const handleSkillSelection = (skill) => {
  isFlyoutOpen.value = false;
  skillSearch.value = skill.label;
  emits("onChange", skill);
};

const isAvailableToAddSkill = computed(() => {
  const skillAnExactMatch = skills.value.find(
    (skill) => skill.label.toLowerCase() === skillSearch.value.toLowerCase()
  );
  return props.canAdd && !skillAnExactMatch && !isLoading.value;
});

const addNewSkill = async () => {
  const postSkill = usePost("skills");
  await postSkill.post({
    skill: {
      name: skillSearch.value,
      type: "technical",
    },
  });
  const newSkill = {
    value: postSkill.data.value.skill.reference,
    label: postSkill.data.value.skill.name,
  };
  handleSkillSelection(newSkill);
  setToast({
    type: "positive",
    title: "Skill added",
  });
};
</script>

<style lang="scss">
.hp-skill-search {
  width: 100%;
  position: relative;
  &__flyout {
    @include flyout;
    padding: 12px;
    margin: auto;
    position: absolute;
    top: 42px;
    width: 100%;
    border-radius: 8px;
    &__loader {
      padding: 24px;
      display: flex;
      justify-content: center;
    }
    &__option {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      border-radius: $border-radius-sm;
      outline: 0;
      color: var(--color-text);
      background-color: var(--color-background);
      border: 0;
      display: flex;
      text-align: left;
      width: 100%;
      transition: 0.15s ease-in-out opacity;
      &__icon {
        margin-right: 4px;
      }
      &--add {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      &:hover {
        background-color: var(--color-forground-floating);
      }
      &:focus {
        background-color: var(--color-forground-floating);
        outline: none;
      }
    }
  }
}
</style>
