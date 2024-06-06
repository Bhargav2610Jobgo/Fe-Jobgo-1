import HpBadgeTag from "../components/hp-badge-tag.vue";

export default {
  title: "Components/Badge Tag",
  component: HpBadgeTag,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpBadgeTag },
  setup() {
    return { args };
  },
  template: `<div style="display:flex">
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0" v-bind="args"> </hp-badge-tag>
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0" icon="layers"  v-bind="args"> </hp-badge-tag>
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0"  type="positive" v-bind="args"> </hp-badge-tag>
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0" icon="layers"  type="positive"  v-bind="args"> </hp-badge-tag>
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0"  type="negative" v-bind="args"> </hp-badge-tag>
    <hp-badge-tag style="margin-right:8px;" label="Hello world" quantity="4.0" icon="layers"  type="negative"  v-bind="args"> </hp-badge-tag>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
