import HpAvatar from "../components/hp-avatar.vue";

export default {
  title: "Components/Avatar",
  component: HpAvatar,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpAvatar },
  setup() {
    return { args };
  },
  template: `<div>
    <hp-avatar style="margin-right:8px;" v-bind="args" size="sm"> </hp-avatar>
    <hp-avatar style="margin-right:8px;" v-bind="args"> </hp-avatar>
    <hp-avatar style="margin-right:8px;" size="lg" v-bind="args"> </hp-avatar>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {
  user: {
    name: "Nick",
    email: "johndoe@gmail.com",
  },
};
