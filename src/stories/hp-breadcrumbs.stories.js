import HpBreadcrumbs from "../components/hp-breadcrumbs.vue";
export default {
  title: "Components/Breadcrumbs",
  component: HpBreadcrumbs,
  argTypes: {},
};

import vueRouter from "storybook-vue3-router";
import { useBreadcrumbs } from "../composables/useBreadcrumbs.js";
const Template = (args) => ({
  components: { HpBreadcrumbs },
  setup() {
    const crumbz = [
      { label: "Openings", to: "/openings" },
      { label: "Lead Designer", to: "/opening/whatever" },
      { label: "Candidates", to: "/opening/whatever?candidate=ejejej" },
    ];
    const crumbz2 = [
      { label: "Openings", to: "/openings" },
      { label: "Lead Designer", to: "/opening/whatever" },
    ];
    const { crumbs, setBreadcrumbs } = useBreadcrumbs();
    setBreadcrumbs(crumbz);

    const toggleCrumbs = () => {
      if (crumbs.value.length === 2) {
        setBreadcrumbs(crumbz);
      } else {
        setBreadcrumbs(crumbz2);
      }
    };

    return { args, crumbz, toggleCrumbs };
  },
  template: `<div>
    <button @click="toggleCrumbs">Toggle crumbs</button>
    <hp-breadcrumbs v-bind="args"> </hp-breadcrumbs>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
Primary.decorators = [vueRouter()];
