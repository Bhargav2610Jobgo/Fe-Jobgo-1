import { ref } from "vue";

const isDarkmode = ref(false);

const hasDarkModePreference =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : "dark";

currentTheme === "dark"
  ? (isDarkmode.value = true)
  : (isDarkmode.value = false);

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
} else if (hasDarkModePreference) {
  isDarkmode.value = true;
  document.documentElement.setAttribute("data-theme", "dark");
}

const handleDarkModeToggle = () => {
  isDarkmode.value = !isDarkmode.value;
  if (isDarkmode.value) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
};

export default () => {
  return {
    isDarkmode,
    handleDarkModeToggle,
  };
};
