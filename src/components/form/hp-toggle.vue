<template>
  <div>
    <Toggle v-model="value" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Toggle from "@vueform/toggle";

const value = ref(false);
</script>

<style src="@vueform/toggle/themes/default.css"></style>
