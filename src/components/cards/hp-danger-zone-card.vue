<template>
  <div class="hp-danger-zone">
    <hp-modal
      @close="isConfirmationModalOpen = false"
      :isOpen="isConfirmationModalOpen"
    >
      <div class="hp-danger-zone__modal">
        <form @submit.prevent="">
          <h4 class="hp-danger-zone__title">Confirm delete</h4>
          <p class="hp-danger-zone__subtitle">
            This is a permanent deletion, all related data will be lost.
          </p>
          <p class="hp-danger-zone__warning">This action is not reversible</p>
          <hp-input
            ref="inputRef"
            icon="locked"
            label="To confirm, please type DELETE"
            name="confirmation"
            v-model="confirmation"
            standalone
          ></hp-input>
          <hp-button
            label="Confirm"
            type="submit"
            :isLoading="isConfirmationLoading"
            :isDisabled="confirmation !== 'DELETE'"
            @handleClick="handleConfirmationClick"
            destructive
          ></hp-button>
        </form>
      </div>
    </hp-modal>
    <h4 class="hp-danger-zone__title">Danger zone</h4>
    <p class="hp-danger-zone__subtitle">
      After you perform this action, there is no going back
    </p>
    <hp-button
      @handleClick="openConfirmationModal"
      destructive
      :label="label"
    ></hp-button>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import HpButton from "@/components/hp-button.vue";
import HpInput from "@/components/form/hp-input.vue";
import HpModal from "@/components/hp-modal.vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  safteyString: {
    type: String,
    default: "Delete",
  },
  onConfirm: {
    type: Function,
    default: () => {},
  },
});

const inputRef = ref(null);
const isConfirmationLoading = ref(false);

const isConfirmationModalOpen = ref(false);
const confirmation = ref("");

const openConfirmationModal = async () => {
  isConfirmationModalOpen.value = true;
  await nextTick();
  inputRef.value.inputRef.focus();
};

const handleConfirmationClick = async () => {
  isConfirmationLoading.value = true;
  await props.onConfirm();
};
</script>

<style lang="scss" scoped>
.hp-danger-zone {
  width: 100%;
  padding: 24px;
  outline: 4px solid var(--color-background-negative);
  border-radius: $border-radius-md;
  &__title {
    font-weight: 500;
    @include text-h5;
  }
  &__subtitle {
    color: var(--color-text-secondary);
    margin-bottom: 16px;
  }
  &__warning {
    color: var(--color-error);
    margin-bottom: 16px;
  }
  &__modal {
    padding: 24px;
  }
}
</style>
