import { ref } from "vue";
import { useGet } from "@/composables/useHttp";

const checklist = ref({
  account: true,
  opening: false,
  template: false,
  question: false,
  candidate: false,
  interviewed: false,
  invited: false,
});

const isDismissed = ref(
  localStorage.getItem("isGettingStartedDismissed")
    ? localStorage.getItem("isGettingStartedDismissed")
    : false
);

export const useGettingStarted = () => {
  const fetchChecklist = async () => {
    if (isDismissed.value) {
      return;
    }
    const getGettingStarted = useGet("self/getting-started");
    await getGettingStarted.get();
    checklist.value = {
      ...checklist.value,
      ...getGettingStarted.data.value?.gettingStarted,
    };
  };

  const dismissGettingStarted = () => {
    localStorage.setItem("isGettingStartedDismissed", true);
    isDismissed.value = true;
  };

  return {
    fetchChecklist,
    checklist,
    isDismissed,
    dismissGettingStarted,
  };
};
