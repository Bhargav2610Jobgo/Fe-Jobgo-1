import HpSpinner from "../components/hp-spinner.vue";

export default {
  title: "Components/Spinner",
  component: HpSpinner,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpSpinner },
  setup() {
    const sizes = [16, 24, 32, 48, 64];
    return { args, sizes };
  },
  template: `<div style="display:flex">
    <hp-spinner v-for="size in sizes" :size="size"> </hp-spinner>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {
  size: 16,
};
