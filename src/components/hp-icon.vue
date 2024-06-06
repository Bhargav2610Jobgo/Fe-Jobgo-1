<template>
  <div :style="{ height: `${size}px`, width: `${size}px` }">
    <component
      :is="icon"
      role="img"
      :alt="name"
      :style="{ height: `${size}px`, width: `${size}px` }"
      class="hp-icon"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "cog",
  },
  size: {
    default: 20,
    type: [Number, String],
  },
  color: {
    type: Number,
  },
});

const icon = computed(() => {
  const forceComputed = props.name;
  return defineAsyncComponent(() =>
    import(/* @vite-ignore */ `../assets/icons/${forceComputed}.svg`)
  );
});
</script>

<style lang="scss"></style>
