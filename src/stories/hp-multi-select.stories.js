import HpMultiSelect from "../components/form/hp-multi-select.vue";

export default {
  title: "Components/Form/Multi Select",
  component: HpMultiSelect,
  argTypes: {},
};

import { ref } from "vue";
import useSkillSearch from "@/composables/useSkillSearch";

const Template = (args) => ({
  components: { HpMultiSelect },
  setup() {
    const options = ref([
      { label: "satan", value: "satan" },
      { label: "dagon", value: "dagon" },
    ]);
    const values = ref([{ label: "dagon", value: "dagon" }]);

    return { args, options, values };
  },
  template: `<div style="margin-left:200px;">
    <hp-multi-select v-model="values" label="Skills" :options="options" name="multi-select" />
  </div>
  <div style="margin-left:600px;">
    <hp-multi-select :maxItemsSelected="1" v-model="values" selectedMessage="items selected" :options="options" name="multi-select" />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
