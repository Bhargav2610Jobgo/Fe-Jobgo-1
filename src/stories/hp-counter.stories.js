import HpCounter from "../components/hp-counter.vue";

export default {
  title: "Components/Counter",
  component: HpCounter,
  argTypes: {},
};

import { useForm } from "vee-validate";
import * as yup from "yup";

const Template = (args) => ({
  components: { HpCounter },
  setup() {
    const schema = yup.object({
      number: yup.number(),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
      initialValues: {
        number: 14,
      },
    });

    return { args };
  },
  template: `<div>
  TODO: limit characters
    <hp-counter style="margin-right:16px" label="Default" name="number"  />
    <hp-counter label="Disabled" :isDisabled="true" name="number"  />
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
