import HpRadio from "../components/hp-radio.vue";

export default {
  title: "Components/Radio",
  component: HpRadio,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpRadio },
  setup() {
    const isChecked = ref(true);
    return { args, isChecked };
  },
  template: `<div>
    <hp-radio v-model:checked="isChecked" label="Normal radio button" name="toggle" />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
