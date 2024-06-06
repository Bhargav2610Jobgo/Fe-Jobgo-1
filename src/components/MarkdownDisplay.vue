<template>
  <div v-html="compiledMarkdown" />
</template>

<script>
import marked from "marked";
import { computed } from "vue";

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});
const compiledMarkdown = computed(() => {
  return () => {
    marked(props.markdown);
  };
});
</script>
