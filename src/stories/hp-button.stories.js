import HpButton from "../components/hp-button.vue";
import vueRouter from "storybook-vue3-router";

export default {
  title: "Components/Button",
  component: HpButton,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpButton },
  setup() {
    const buttonIsLoading = ref(true);
    return { args, buttonIsLoading };
  },
  template: `<div>
    <div style="display:flex; margin-bottom: 16px; margin-top:100px; gap: 6px;">
      <hp-button v-bind="args"> </hp-button>
      <hp-button label="Link button" tooltip="im a tooltip"> </hp-button>
      <hp-button :to="{ name: 'home' }" label="Link button"> </hp-button>
      <hp-button @click="buttonIsLoading = !buttonIsLoading" label="Loading" :isLoading="buttonIsLoading" />
      <hp-button :isDisabled="true" label="Disabled" />
      <hp-button label="Dropdown" dropdownIcon="plus" :hasDropdown="true" />
      <hp-button label="Icon" icon="plus" />
      <hp-button icon="plus" />
      <hp-button destructive label="Destructive" v-bind="args"> </hp-button>
      <hp-button destructive :isDisabled="true" label="Destructive" v-bind="args"> </hp-button>
    </div>
    <div style="display:flex; gap: 6px;">
      <hp-button primary v-bind="args"> </hp-button>
      <hp-button label="Link button" tooltip="im a tooltip"> </hp-button>
      <hp-button primary :to="{ name: 'home' }" label="Link button"> </hp-button>
      <hp-button primary @click="buttonIsLoading = !buttonIsLoading" label="Loading" :isLoading="buttonIsLoading" />
      <hp-button primary :isDisabled="true" label="Disabled" />
      <hp-button primary label="Dropdown" dropdownIcon="plus" :hasDropdown="true" />
      <hp-button primary :iconRight="true" label="Icon" icon="plus" />
      <hp-button primary icon="plus" />
    </div>
    <div style="display:flex; width: 240px; margin-top:24px;">
      <hp-button dropzone label="Add candidate" icon="plus" />
    </div>
    <div style="display:flex; width: 240px; margin-top:24px;">
     <hp-button fullWidth label="I'm fullwidth" primary icon="plus" />
    </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {
  label: "Button",
};

Primary.decorators = [vueRouter()];
