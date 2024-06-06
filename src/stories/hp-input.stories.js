import HpInput from "../components/form/hp-input.vue";

export default {
  title: "Components/Form/Input",
  component: HpInput,
  argTypes: {},
};

import { useForm } from "vee-validate";
import * as yup from "yup";

const Template = (args) => ({
  components: { HpInput },
  setup() {
    const schema = yup.object({
      name: yup.string().required("Interview name is required"),
      error: yup.string().required().min(8),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
      initialValues: {
        default: "Default",
        label: "Label",
        name: "Prefilled value",
        disabled: "I'm disabled",
        error: "Error",
        icon: "Icon",
      },
      initialErrors: {
        error: "Initial error",
      },
    });

    return { args };
  },
  template: `
  <div>
    <div style="display:grid; grid-template-columns: repeat(auto-fill, 300px); grid-gap: 10px;">
      <hp-input name="default"  />
      <hp-input name="label"  label="Label" />
      <hp-input name="placeholder" label="Placeholder"  placeholder="Placeholder" />
      <hp-input name="name"  label="Prefilled Input" />
      <hp-input name="disabled" label="Disabled"  :isDisabled="true" />
      <hp-input name="error" label="Error"  />
      <hp-input name="password" label="Password" type="password"  />
      <hp-input name="icon" icon="locked" label="Icons" />
      <hp-input name="search" variant="search" icon="search" label="Search" />
    </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
