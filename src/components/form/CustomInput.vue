<template>
    <div class="custom-input">
      <label class="custom-input__label" :for="`input-${id}`">
        <slot>Input</slot>
      </label>
      <div class="mt-1">
        <input
          :id="`custom-input-${id}`"
          :type="type"
          :required="required"
          @input="onInput($event.target.value)"
          class="custom-input__input"
          :value="modelValue"
          :placeholder="$attrs.placeholder"
          ref="inputElement"
        />
      </div>
      <div class="custom-input__error-msg" v-if="errorMessage && hasError">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from "vue";
  export default defineComponent({
    name: "custom-input",
    setup() {
      const inputElement = ref(null);
  
      function onInput(value) {
        this.$emit("update:modelValue", value);
      }
  
      return {
        inputElement,
        onInput,
      };
    },
    props: {
      id: {
        required: true,
        type: String,
      },
      type: {
        default: "text",
        type: String,
      },
      required: {
        default: false,
        type: Boolean,
      },
      modelValue: {
        type: [String, Number],
      },
      hasError: {
        type: Boolean,
        default: false,
      },
      errorMessage: {
        type: String,
      },
    },
    emits: ["update:modelValue"],
  });
  </script>
  
  <style lang="scss">
  // apply your styles
  </style>