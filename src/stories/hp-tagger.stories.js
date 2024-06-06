import HpTagger from "../components/form/hp-tagger.vue";

export default {
  title: "Components/Form/Tagger",
  component: HpTagger,
  argTypes: {},
};

import { ref } from "vue";
import useSkillSearch from "@/composables/useSkillSearch";

const Template = (args) => ({
  components: { HpTagger },
  setup() {
    const options = ref([
      "ECMA Script 2016",
      "JavaScript",
      "TypeScript",
      "ECMA Script 2016",
      "JavaScript",
      "TypeScript",
      "ECMA Script 2016",
      "JavaScript",
      "TypeScript",
      "ECMA Script 2016",
      "JavaScript",
      "TypeScript",
    ]);
    const values = ref(["ECMA Script 2016"]);

    const searchFunction = async (value) => {
      const { handleSkillSearch } = useSkillSearch();
      const res = await handleSkillSearch(value);
      options.value = ["other skills", "yes, indeed"];
    };
    return { args, options, values, searchFunction };
  },
  template: `<div style="margin-left:200px; margin-top:400px; position:relative;">
    <hp-tagger v-model="values" searchable label="Skills" :options="options" name="multi-select" />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
