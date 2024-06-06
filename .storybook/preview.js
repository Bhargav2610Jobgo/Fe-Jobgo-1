export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

document.addEventListener("keydown", function (event) {
  if (event.key === "9") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (event.key === "0") {
    document.documentElement.setAttribute("data-theme", "light");
  }
});
