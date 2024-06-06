import HpDropdownList from "../components/hp-dropdown-list.vue";

export default {
  title: "Components/DropdownList",
  component: HpDropdownList,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpDropdownList },
  setup() {
    const options = [
      { value: "hello", description: "1" },
      { value: "hello2", description: "123" },
      { value: "hello3", description: "1234" },
      { value: "hello4", description: "123456" },
    ];

    const handleChange = (value) => {
      label.value = value;
    };

    const label = ref("hello");
    return { args, options, label, handleChange };
  },
  template: `<div style="width: 200px; margin-left: 400px;"><hp-dropdown-list
                :label="label"
                :options="options"
                @handleChange="handleChange"
            ></hp-dropdown-list></div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
