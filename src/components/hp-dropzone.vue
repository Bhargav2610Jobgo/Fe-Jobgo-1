<template>
  <div @click="handleClick" class="hp-dropzone">
    <div v-if="!isLoading">
      <div class="candidate-modal__dropzone__container">
        <hp-icon
          class="candidate-modal__dropzone__container__icon"
          size="28"
          name="upload"
        >
        </hp-icon>
        <div v-if="!file">{{ label }}</div>
        <div v-else>{{ file.name }}</div>
      </div>
    </div>
    <div class="candidate-modal__dropzone__container" v-else>
      <div class="candidate-modal__dropzone__container__icon">
        Candidates processing
      </div>
      <hp-spinner size="28"></hp-spinner>
    </div>
    <input
      @change.prevent="handleChange"
      class="hp-dropzone__hidden-input"
      type="file"
      :multiple="multiple"
      :accept="accept"
      ref="inputRef"
    />
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import useToast from "@/composables/useToast";

// Components
import HpIcon from "@/components/hp-icon.vue";
import HpSpinner from "@/components/hp-spinner.vue";
const { setToast } = useToast();

const props = defineProps({
  label: {
    type: String,
    default: "Upload files",
  },
  loadingLabel: {
    type: String,
    default: "Processing...",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: "*/*",
  },
});

const emits = defineEmits(["change"]);

const file = ref(null);
const inputRef = ref(null);

const handleClick = () => {
  inputRef.value.click();
};

const handleChange = (e) => {
  //validate file on accept
  const file=e.target.files[0];
  const fileNameParts = file.name.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  // Validate file extension
  if (fileExtension !== "pdf" && fileExtension !== "txt") {
    setToast({
    type: "negative",
    title: "Please upload a PDF or Text file",
  });
    return;
  }else{
    emits("change", e.target.files[0]);
    file.value = e.target.files[0];
  }
};
</script>

<style lang="scss" scoped>
.hp-dropzone {
  border: 1px dashed var(--color-border);
  padding: 26px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  border-radius: $border-radius-sm;
  &:hover {
    box-shadow: 0px 4px 8px rgba(33, 44, 51, 0.02),
      0px 0px 1px rgba(33, 44, 51, 0.02);
  }

  &__hidden-input {
    display: none;
  }
}
</style>
