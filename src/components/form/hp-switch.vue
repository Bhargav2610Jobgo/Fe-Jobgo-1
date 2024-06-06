<template>
  <hp-switch v-model="modelValue"></hp-switch>
</template>

<script setup>
import HpSwitch from "@/components/hp-switch.vue";
import { useField } from "vee-validate";

const props = defineProps({
  label: {
    type: String,
  },
  standalone: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
  },
  modelValue: Boolean,
});

const { value: modelValue, errorMessage } = useField(props.name, undefined, {
  standalone: props.standalone,
  validateOnValueUpdate: false,
  initialValue: props.modelValue,
});
</script>
