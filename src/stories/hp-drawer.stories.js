import HpDrawer from "../components/hp-drawer.vue";

export default {
  title: "Components/Drawer",
  component: HpDrawer,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpDrawer },
  setup() {
    const isDrawerOpen = ref(false);
    return { args, isDrawerOpen };
  },
  template: `<div>
    <button @click="isDrawerOpen = true">Open Drawer</button>
    <hp-drawer v-bind="args" :isOpen="isDrawerOpen" @close="isDrawerOpen = false"> I'm a Drawer </hp-drawer>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
