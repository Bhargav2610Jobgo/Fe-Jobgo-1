import { ref } from "vue";
import { useGet } from "./useHttp";

const isInterviewLoading = ref(true);
const interview = ref([]);

const setInterview = (newInterview) => {
  const formattedInterview = {
    ...newInterview,
    ceremony: {
      warmup: newInterview.ceremony.warmup
        ? {
            ...newInterview.ceremony.warmup,
            duration: newInterview.ceremony.warmup.duration / 60,
          }
        : null,
      cooldown: newInterview.ceremony.cooldown
        ? {
            ...newInterview.ceremony.cooldown,
            duration: newInterview.ceremony.cooldown.duration / 60,
          }
        : null,
    },
  };
  interview.value = formattedInterview;
  return formattedInterview;
};

const fetchInterview = async (interviewRef) => {
  isInterviewLoading.value = true;
  const getInterview = useGet(`templates/${interviewRef}`);
  await getInterview.get();
  setInterview(getInterview.data.value.template);
  isInterviewLoading.value = false;
};

export default () => {
  return {
    isInterviewLoading,
    interview,
    fetchInterview,
    setInterview,
  };
};
