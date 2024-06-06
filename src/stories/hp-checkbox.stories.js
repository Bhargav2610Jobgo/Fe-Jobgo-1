import HpCheckbox from "../components/hp-checkbox.vue";

export default {
  title: "Components/Checkbox",
  component: HpCheckbox,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpCheckbox },
  setup() {
    const isChecked = ref(false);
    return { args, isChecked };
  },
  template: `<div>
    <hp-checkbox v-model:checked="isChecked" name="toggle" />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
