import HpInfoCircle from "../components/hp-info-circle.vue";

export default {
  title: "Components/Info Circles",
  component: HpInfoCircle,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpInfoCircle },
  setup() {
    return { args };
  },
  template: `
  <div>
    <div style="margin-left: 300px; margin-top:300px;">
      <hp-info-circle :content="'whatever boyo'"  />
    </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
