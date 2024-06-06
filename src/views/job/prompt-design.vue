<template>
  <div class="signin">
    <!-- <div class="signin__logo">
      <Logo />
    </div> -->
    <div class="signin__container signin__container_prompt">
      <div class="signin__section">
        <div class="signin__image-container"></div>
        <!-- <p class="signin__subtitle">Welcome back!</p> -->
        <div class="" style="display: flex;align-items: center;justify-content: space-between;">
        <!-- <di class="signin__title">Play with Prompt</di> -->

        <div
          class="country-list__country-list__dropdown-target"
          @click="isTemplateFlyoutOpen = !isTemplateFlyoutOpen"
          ref="templateDropdownTarget"
        >
          <div class="country-list__country-list__dropdown-target__tag">
            {{ selectedPrompt?.promptName }}
          </div>
          <hp-icon
            class="country-list__country-list__dropdown-target__icon"
            name="chevron-down"
          ></hp-icon>
        </div>
        <transition name="flyout-transition">
          <div
            v-if="isTemplateFlyoutOpen"
            class="country-list__flyout country-list__flyout--left"
          >
            <ol class="country-list__flyout__options">
              <li
                v-for="(template, index) in promptList"
                :key="index"
                class="country-list__flyout__options__option"
              >
                <button
                  class="country-list__flyout__options__button"
                  :class="{
                    'active-class': selectedPrompt?.promptName == template.promptName,
                  }"
                  type="button"
                  @click="handleTemplateFilterChange(template)"
                >
                 
                  {{ template?.promptName }}
                </button>
              </li>
            </ol>
          </div>
        </transition>
      </div>
        <form @submit="onSubmit">
          <hp-textArea name="prompt" placeholder="Enter your prompt" label="" :autofocus="true" type="text"
            rows="20"/>

          <hp-button primary fullWidth :isDisabled="isLoading" type="submit"
            :label="(isLoading) ? 'Loading...' : 'Save'"></hp-button>
        </form>
      </div>
    
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import HpTextArea from "@/components/form/hp-textarea.vue";
import HpButton from "@/components/hp-button.vue";
import { useGet, usePut } from "@/composables/useHttp";
import HpIcon from "@/components/hp-icon.vue";

import useToast from "@/composables/useToast";
import Logo from "@/assets/logo.svg";
import { onClickOutside } from "@vueuse/core";
import { useRouter, useRoute } from "vue-router";
const isTemplateFlyoutOpen = ref(false);
const templateDropdownTarget = ref(null);

const router = useRouter();

const { handleSubmit, isSubmitting, setFieldError, meta, resetForm } = useForm({
  initialValues: {
    prompt: "",
  },
});
const { setToast } = useToast();
const isLoading = ref(false);
const promptList = ref([]);
const selectedPrompt = ref(null);
onMounted(() => {
  getPrompt();
});

onClickOutside(templateDropdownTarget, (event) => {
  if (!isTemplateFlyoutOpen.value) {
    return;
  }
  if (event.target.className.includes("country-list__flyout")) {
    return;
  }
  isTemplateFlyoutOpen.value = false;
});
const getPrompt = async () => {
  const getPromptAPI = useGet(`prompt`);
  isLoading.value=getPromptAPI.loading.value
  await getPromptAPI.get();
  selectedPrompt.value=getPromptAPI?.data.value[0]
  promptList.value =getPromptAPI?.data.value
  resetForm({
    values: {
      prompt: selectedPrompt.value.prompt
    },
  });

  // isLoading.value=getPromptAPI.loading.value



};
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const { prompt } = values;
  const { put, data, loading } = usePut("prompt");
  const prompt1={...selectedPrompt.value,prompt:prompt}
  await put(
    prompt1
  );
  getPrompt();
  setToast({
    type: "positive",
    title: "Success!",
    message: "Prompt is Update Successfully",
  });

  // router.push({ path: "/chat"});


  isLoading.value = false;
});
</script>

<style lang="scss">
.signin {
  display: flex;
  flex-direction: column;
  padding: 24px;

  &__section {
    padding-bottom: 24px;
    position: relative;
  }

  &__subtitle {
    @include text-h3;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__title {
    @include text-h3;
    font-weight: 500;
    margin-bottom: 24px;
  }

  &__logo {
    margin: auto;
    margin-bottom: 48px;
    height: 48px;
    width: 48px;
  }

  &__container {
    margin: auto;
    padding: 24px;
    width: 100%;
    border: $border;
    border-radius: $border-radius-md;
    background-color: var(--color-background);
    position: relative;
    box-shadow: $box-shadow;
  }

  &__image-container {
    display: flex;
    background-image: url("../../assets/abstracts/decorations/illustration.svg");
    position: absolute;
    top: 50%;
    height: 100%;
    width: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: $z-index-negative;
  }

  &__password-container {
    position: relative;
  }
}

@media (min-width: $breakpoint-tablet) {
  .signin {
    padding: 0;

    &__container {
      width: 450px;
    }

    &__logo {
      margin-top: 64px;
    }

    &__image-container {
      height: 446px;
      width: 588px;
    }
  }
}

.signin__container_prompt {
  width: 80% !important;
}













.hp-input__input-container1:focus-within {
  outline: 4px solid var(--color-focus) !important;
  border: 1px solid var(--color-accent-background) !important;
}
.hp-input {
  &--search {
    margin-bottom: 0;
  }
  &--disabled {
    opacity: 0.4;
    .hp-input__input {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  &--error {
    .hp-input__input {
      border: 1px solid var(--color-error);
      &::placeholder {
        color: var(--color-text-secondary);
      }
      &:focus:not([disabled]),
      &:active:not([disabled]) {
        outline: 4px solid var(--color-focus);
        border: 1px solid var(--color-error);
      }
    }
  }
  &__input-container1 {
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    margin-bottom: 8px;
  }
  &__input-container {
    position: relative;
    border: 0px solid var(--color-border);
    // border-radius: $border-radius-sm;
    margin-bottom: 8px;
  }
  &__input-icon {
    position: absolute;
    left: 0;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    &--password {
      cursor: pointer;
    }
  }
  &__error {
    color: var(--color-error);
    font-weight: 500;
  }
  &__label {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  &__input {
    color: var(--color-text-primary);
    background-color: inherit;
    border: none;
    border-radius: $border-radius-sm;
    padding: 8px 8px 8px 12px;
    line-height: 36px;
    max-height: 36px;
    width: 100%;
    color: var(--color-text-primary);
    &--search {
      max-height: 32px;
      line-height: 32px;
    }
    &::placeholder {
      color: var(--color-text-secondary);
    }
    &:focus:not([disabled]),
    &:active:not([disabled]) {
      outline: none !important;
      border: none;
    }
  }
}

.hp-input__error-transition {
  opacity: 1;
}
.hp-input__error-transition-enter-active,
.hp-input__error-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-input__error-transition-enter-from,
.hp-input__error-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.country-list {
  &__country-list {
    &__dropdown-target {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
      
      position: relative;
      cursor: pointer;
      border-right: 1px solid var(--color-border) !important;
      &__dropdown-target:focus-within {
        outline: 4px solid var(--color-focus) !important;
  border: 1px solid var(--color-accent-background) !important;
      }
      :first-letter {
        text-transform: uppercase;
      }
      &__view {
        margin-right: 4px;
        margin-left: 8px;
        color: var(--color-text-secondary);
      }
      &__tag {
        margin-left: 12px;
      }
    }
  }

  &__flyout {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    position: absolute;
    max-height: 300px;
    overflow-y: scroll;
    width: 256px;
    padding: 8px;
    z-index: $z-index-1000;
    top: 38px;
    transition: all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &--left {
      left: 10px;
    }
    &__options {
      &__button {
        // white-space: ;
        cursor: pointer;
        padding: 8px;
        border-radius: $border-radius-sm;
        outline: 0;
        background-color: var(--color-background);
        color: var(--color-text);
        border: 0;
        display: flex;
        align-items: center;
        width: 100%;

        &:hover {
          background-color: var(--color-forground-floating);
        }
        &:focus {
          background-color: var(--color-forground-floating);
          outline: none;
        }
        &--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        & img {
          margin-right: 10px;
        }
      }
    }
  }
}
@media (min-width: $breakpoint-tablet) {
  .country-list {
    position: absolute;
    transition: transform 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67),
      right 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    transform: translateX(0);
    right: 16px;
    width: 400px;
    min-height: calc(100vh - 120px);
    z-index: $z-index-10;
    padding: 20px;
    padding-bottom: 0px;
    background-color: var(--color-panel);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-lg;
    top: initial;
    bottom: initial;
    left: initial;
    &__image-container__link {
      display: none;
    }
    &--left {
      right: 100%;
      transform: translateX(100%);
      display: block;
    }
  }
}
.active-class {
  background-color: var(--color-forground-floating) !important;
}
</style>
