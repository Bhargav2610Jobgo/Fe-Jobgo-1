import HpDropzone from "../components/hp-dropzone.vue";

export default {
  title: "Components/Dropzone",
  component: HpDropzone,
  argTypes: {},
};

import { ref } from "vue";
const Template = (args) => ({
  components: { HpDropzone },
  setup() {
    const isDropzoneOpen = ref(false);
    return { args, isDropzoneOpen };
  },
  template: `<div style="width: 600px;">
    <hp-dropzone v-bind="args"> I'm a Dropzone </hp-dropzone>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
