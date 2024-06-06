import { ref } from "vue";
import { useGet, usePost } from "./useHttp";

const limit = 20;
const offset = ref(0);
const hasMoreData = ref(true);
const isOpeningsLoading = ref(true);
const isLoadingMoreLoading = ref(false);
const openings = ref([]);
const opening = ref([]);
const getOpenings = useGet();

import useCandidates from "@/composables/useCandidates";

const { candidateListFilter } = useCandidates();

// const fetchOpenings = async (isLoadMore = false, state = "active") => {
//   if (getOpenings.loading.value) {
//     getOpenings.controller.abort();
//   }

//   if (!hasMoreData.value && isLoadMore) {
//     return;
//   }

//   if (isLoadMore) {
//     offset.value = offset.value + limit;
//   } else {
//     offset.value = 0;
//   }

//   if (!isLoadMore) {
//     isOpeningsLoading.value = true;
//   } else {
//     isLoadingMoreLoading.value = true;
//   }

//   const url = `opening?state=${state.toLowerCase()}&limit=${limit}&offset=${
//     offset.value
//   }`;
//   await getOpenings.get(url);
//   if (getOpenings.data.value.openings.length !== limit) {
//     hasMoreData.value = false;
//   }

//   if (getOpenings.data.value) {
//     if (isLoadMore) {
//       openings.value = [...openings.value, ...getOpenings.data.value.openings];
//     } else {
//       openings.value = getOpenings.data.value.openings;
//     }
//   }
//   isOpeningsLoading.value = false;
//   isLoadingMoreLoading.value = false;
// };

const updateOpenings = async (state = "active") => {
  if (getOpenings.loading.value) {
    getOpenings.controller.abort();
  }
  const url = `openings?state=${state.toLowerCase()}`;
  await getOpenings.get(url);
  if (getOpenings.data.value) {
    openings.value = getOpenings.data.value.openings;
  }
  isOpeningsLoading.value = false;
};

const createOpening = async (opening) => {
  const postOpening = usePost("openings");
  await postOpening.post({
    opening: {
      name: `Opening #${openings.value.length + 1}`,
      description: "",
      templates: [],
    },
  });
  // fetchOpenings();
  return postOpening.data.value.opening.reference;
};

const fetchOpenings = async (openingRef) => {
  const {get,data} = useGet(`self/profile`);
  await get();
  console.log("data fetchOpenings",data.value)
  openings.value=   data.value;
  
  // candidateListFilter.value = "active";
  // opening.value = getOpening.data.value.opening;
};

const setOpenings = (newOpenings) => {
  openings.value = newOpenings;
};
const fetchOpeningsData=async()=>{

}

export default () => {
  return {
    setOpenings,
    fetchOpenings,
    updateOpenings,
    hasMoreData,
    offset,
    opening,
    isOpeningsLoading,
    openings,
    createOpening,
    fetchOpeningsData
  };
};
