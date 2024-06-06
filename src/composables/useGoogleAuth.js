import { ref } from "vue";

const isInitialized = ref(false);

export default () => {
  return {
    isInitialized,
  };
};
