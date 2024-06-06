import HpTooltip from "../components/hp-tooltip.vue";

export default {
  title: "Components/Tooltip",
  component: HpTooltip,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpTooltip },
  setup() {
    return { args };
  },
  template: `<div style="padding:200px">
    <hp-tooltip>
        <div>
           Hover me
        </div>
        <template #content>
            Yep thats a tooltip
        </template>
    </hp-tooltip>
    <hp-tooltip position="bottom">
      <div>
        Hover me
      </div>
      <template #content>
          Yep thats a tooltip
      </template>
  </hp-tooltip>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
