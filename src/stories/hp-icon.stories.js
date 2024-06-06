import HpIcon from "@/components/hp-icon.vue";

const files = Object.entries(import.meta.globEager("../assets/icons/*.svg"));
const iconNames = files.map((glob) => {
  return glob[0].replace("../assets/icons/", "").replace(".svg", "");
});

export default {
  title: "Components/Icon",
  component: HpIcon,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpIcon },
  setup() {
    return { args, iconNames };
  },
  template: `<div style="display:flex; flex-wrap: wrap;">
      <div v-for="icon in iconNames">
        <div style="display:flex; flex-flow: column; margin-right:8px; font-size: 8px;">
        <hp-icon :name="icon" v-bind="args"> </hp-icon>
        {{icon}} 
        </div>
      </div>  
  </div>`,
});

export const Primary = Template.bind({});
