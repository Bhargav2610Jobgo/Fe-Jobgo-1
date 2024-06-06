import HpCircularBadge from "../components/hp-circular-badge.vue";

export default {
  title: "Components/Circular Badge",
  component: HpCircularBadge,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpCircularBadge },
  setup() {
    return { args };
  },
  template: `<div style="display:flex">
    <hp-circular-badge :upper="4" :lower="0" style="margin-right:8px;"  v-bind="args"> </hp-circular-badge>
    <hp-circular-badge :upper="4" :lower="1" style="margin-right:8px;"  v-bind="args"> </hp-circular-badge>
    <hp-circular-badge :upper="4" :lower="2" style="margin-right:8px;"  v-bind="args"> </hp-circular-badge>
    <hp-circular-badge :upper="4" :lower="3" style="margin-right:8px;"  v-bind="args"> </hp-circular-badge>
    <hp-circular-badge :upper="4" :lower="4" style="margin-right:8px;"  v-bind="args"> </hp-circular-badge>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
