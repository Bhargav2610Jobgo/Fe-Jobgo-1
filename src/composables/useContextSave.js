import { ref, watch, computed } from "vue";

const isDirty = ref(false);

export function clearIsDirty() {
  isDirty.value = false;
}

export default function (metaReference) {
  if (metaReference) {
    const dirtyChange = computed(() => metaReference?.value?.dirty);

    watch(dirtyChange, () => {
      isDirty.value = dirtyChange.value;
    });
  }

  return {
    isDirty,
    clearIsDirty,
  };
}
