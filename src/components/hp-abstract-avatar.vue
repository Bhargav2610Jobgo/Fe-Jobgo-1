<template>
  <div class="hp-abstract-avatar">
    <component
      class="hp-abstract-avatar__image"
      :is="avatar"
      role="img"
      alt="artwork"
    />
  </div>
</template>

<script setup>
import { shallowRef, watch, defineAsyncComponent } from "vue";
const props = defineProps({
  abstractKey: {
    type: [String, Number],
    default: "1",
  },
});

const avatar = shallowRef(null);

watch(
  () => props.abstractKey,
  () => {
    avatar.value = defineAsyncComponent(() =>
      import(
        /* @vite-ignore */ `../assets/abstracts/avatars/avatar_${props.abstractKey}.svg`
      )
    );
  },
  { immediate: true }
);
</script>

<style lang="scss">
.hp-abstract-avatar {
  height: 40px;
  width: 40px;
  border-radius: $border-radius-lg;
  overflow: hidden;
  &__image {
    height: 100%;
    width: 100%;
    clip-path: circle(70% at 50% 50%);
  }
}
</style>
