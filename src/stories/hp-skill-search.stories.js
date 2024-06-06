import HpSkillSearch from "../components/hp-skill-search.vue";

export default {
  title: "Components/SkillSearch",
  component: HpSkillSearch,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpSkillSearch },
  setup() {
    const handleChangeReaction = (newSkill) => {
      console.log(newSkill);
    };
    return { args, handleChangeReaction };
  },
  template: `<div style="display:flex">
    <hp-skill-search @handleChange="handleChangeReaction"> </hp-skill-search>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {
  size: 16,
};
