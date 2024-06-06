import HpTextarea from "../components/form/hp-textarea.vue";

export default {
  title: "Components/Form/Textarea",
  component: HpTextarea,
  argTypes: {},
};

import { useForm } from "vee-validate";
import * as yup from "yup";

const Template = (args) => ({
  components: { HpTextarea },
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
        name: "",
        disabled: "I'm disabled",
        error: "Error",
      },
      initialErrors: {
        error: "Initial error",
      },
    });
    return { args };
  },
  template: `<div>
    <div style="width:420px;"> 
      <hp-textarea name="default" />
    </div>
    <div style="width:420px;"> 
      <hp-textarea label="Placeholder" placeholder="placeholder" name="name" />
    </div>
    <div style="width:420px;">
      <hp-textarea label="disabled" name="disabled" isDisabled="true" />
    </div>
    <div style="width:420px;">
      <hp-textarea label="error state" name="error" />
    </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
