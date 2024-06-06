import { ref, watch, computed } from "vue";

const isDirty = ref(false);
const type = ref(false);
const handleSubmitFunc = ref(() => {});

export function clearIsDirty() {
  isDirty.value = false;
}

export default function (metaReference, drawerType) {
  if (metaReference) {
    const dirtyChange = computed(() => metaReference?.value?.dirty);

    watch(dirtyChange, () => {
      isDirty.value = dirtyChange.value;
    });
    type.value = drawerType;
  }

  return {
    type,
    isDirty,
    clearIsDirty,
    handleSubmitFunc,
  };
}
