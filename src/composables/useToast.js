import { ref } from "vue";

const toastQueue = ref([]);
let timeouts = [];

export default function useToast() {
  const setToast = (toast) => {
    const { duration = 5500 } = toast;
    const uuid = createUUID();
    const iconMap = {
      positive: "check-circle",
      negative: "alert",
    };

    const icon = iconMap[toast.type] || toast.icon || null;

    const formattedToast = { ...toast, icon: icon, id: uuid };
    toastQueue.value = toastQueue.value.concat([], [formattedToast]);
    const timeout = setTimeout(() => {
      toastQueue.value.shift();
    }, duration);
    timeouts.push({ id: uuid, timeout });
  };

  const dismissToast = (id) => {
    clearTimeout(timeouts.find((toast) => toast.id === id).timeout);
    toastQueue.value = toastQueue.value.filter((toast) => toast.id !== id);
  };

  const createUUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };

  return {
    toastQueue,
    setToast,
    dismissToast,
  };
}
