import HpSwitch from "../components/hp-switch.vue";

export default {
  title: "Components/Switch",
  component: HpSwitch,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpSwitch },
  setup() {
    const isChecked = ref(false);
    return { args, isChecked };
  },
  template: `<div>
  <div>
  Default
    <hp-switch v-model:checked="isChecked" name="toggle" />
  </div>
  <div>
    Disabled
    <hp-switch v-model:checked="isChecked" :isDisabled="true" name="toggle" />
    </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
