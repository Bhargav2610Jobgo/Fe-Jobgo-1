import { ref } from "vue";
import { useGet } from "./useHttp";
import { useRoute } from "vue-router";

const isCandidateListLoading = ref(false);
const isInfiniteLoading = ref(false);
const hasMoreToLoad = ref(true);
const isCandidateLoading = ref(true);
const candidate = ref({});
const candidates = ref([]);
const candidateListFilter = ref("active");

export default () => {
  const route = useRoute();

  const fetchMoreCandidates = async (url) => {
    if (!hasMoreToLoad.value) {
      return;
    }
    const endpoint = url;
    isInfiniteLoading.value = true;
    const getCandidates = useGet(endpoint);
    await getCandidates.get();
    // magic number adheres to limit
    if (getCandidates.data.value.candidates.length < 15) {
      hasMoreToLoad.value = false;
    }
    candidates.value = [
      ...candidates.value,
      ...getCandidates.data.value.candidates,
    ];
    isInfiniteLoading.value = false;
  };

  const fetchCandidates = async (url) => {
    const endpoint = url
      ? url
      : `openings/${route.params.openingRef}/candidates?state=${candidateListFilter.value}`;
    isCandidateListLoading.value = true;
    const getCandidates = useGet(endpoint);
    await getCandidates.get();
    candidates.value = getCandidates.data.value.candidates;
    isCandidateListLoading.value = false;
  };

  const fetchCandidate = async (candidateRef) => {
    isCandidateLoading.value = true;
    const getCandidate = useGet(`candidates/${candidateRef}`);
    await getCandidate.get();
    candidate.value = getCandidate.data.value.candidate;
    isCandidateLoading.value = false;
  };

  return {
    isCandidateListLoading,
    isCandidateLoading,
    candidates,
    candidate,
    isInfiniteLoading,
    hasMoreToLoad,
    fetchMoreCandidates,
    fetchCandidates,
    fetchCandidate,
    candidateListFilter,
  };
};
