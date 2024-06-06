import useToast from "../composables/useToast";
import HpToast from "../components/hp-toast.vue";

export default {
  title: "Components/Toast",
  component: HpToast,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpToast },
  setup() {
    const { setToast, toastQueue } = useToast();

    const addToast = () => {
      setToast({
        type: "positive",
        title: "I am a toast",
        message: `The blah has `,
        icon: "layers",
        duration: 5500,
      });
    };

    const addSadToast = () => {
      setToast({
        type: "negative",
        title: "I am a toast",
        message: `The blah has `,
        duration: 5500,
      });
    };

    const addHappyToast = () => {
      setToast({
        type: "positive",
        title: "I am a toast",
        message: `The blah has `,
        duration: 5500,
      });
    };

    const addDefaultToast = () => {
      setToast({
        message: `The blah has `,
        duration: 5500,
      });
    };

    return { args, addToast, addHappyToast, addSadToast, addDefaultToast };
  },
  template: `<div>
  <button  type="button" @click="addToast"> add toast </button>
  <button  type="button" @click="addDefaultToast"> add default toast </button>
  <button  type="button" @click="addHappyToast"> add happy toast </button>
  <button  type="button" @click="addSadToast"> add sad toast </button>

    <hp-toast>
    </hp-toast>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
