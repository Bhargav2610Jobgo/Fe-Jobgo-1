import HpTabs from "../components/hp-tabs.vue";

export default {
  title: "Components/Tabs",
  component: HpTabs,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpTabs },
  setup() {
    const state = ref("tab1");
    const state2 = ref("tab5");
    const options = [
      { label: "Tab 1", value: "tab1" },
      { label: "Tab 2", value: "tab2", icon: "trash" },
      { value: "tab3", icon: "trash" },
    ];

    const options2 = [
      { value: "tab5", icon: "trash" },
      { value: "tab6", icon: "trash" },
    ];
    return { args, state, options, options2, state2 };
  },
  template: `<div style="display:flex">
    <hp-tabs :options="options" v-model="state" />
    <hp-tabs :options="options2" v-model="state" />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {
  size: 16,
};
