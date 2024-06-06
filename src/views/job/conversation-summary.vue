<template>
  <section class="summary" v-if="conversationSummary">
    <h1 class="summary__title">Summary Conversation</h1>
    <p class="summary__text">
      {{ conversationSummary }}
    </p>
  </section>
  <section v-else>You don't have any summary</section>
</template>
<script setup>
import useAssistant from "@/composables/useAssistant.js";
const { conversationSummary } = useAssistant();
</script>
<style lang="scss" scoped>
.summary {
  @include pageContainer;
  &__title {
    margin: 1rem 0;
  }
  &__text {
    font-size: 1.2rem;
  }
}
</style>
