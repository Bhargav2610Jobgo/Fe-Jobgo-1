import { ref } from "vue";

const crumbs = ref([]);

export const useBreadcrumbs = () => {
  const setBreadcrumbs = (newCrumbs) => {
    crumbs.value = newCrumbs;
  };

  return {
    crumbs,
    setBreadcrumbs,
  };
};
