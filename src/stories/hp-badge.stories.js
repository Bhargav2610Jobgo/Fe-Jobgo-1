import HpBadge from "../components/hp-badge.vue";

export default {
  title: "Components/Badge",
  component: HpBadge,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpBadge },
  setup() {
    return { args };
  },
  template: `<div style="display:flex; margin-top:120px;">
    <hp-badge style="margin-right:8px;" content="4.0" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;"  icon="layers" content="4" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;" content="4.0"  type="positive" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;"  icon="layers"  type="positive" content="4" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;" content="4.0"  type="negative" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;"  icon="layers"  type="negative" content="4" v-bind="args"> </hp-badge>
    <hp-badge style="margin-right:8px;" content="Tooltip" tooltip="Interview" icon="layers"  type="negative" v-bind="args"> </hp-badge>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
