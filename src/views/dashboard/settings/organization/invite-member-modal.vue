<template>
  <div class="settings__modal">
    <h4 class="settings__card__title">Invite member</h4>
    <p class="settings__card__subtitle">
      This member will have access to your organizations interviews, results,
      and templates
    </p>
    <form @submit="onSubmit">
      <hp-input
        placeholder="Enter new member email..."
        label="Email"
        name="email"
      ></hp-input>
      <hp-button
        primary
        type="submit"
        :isLoading="isSendingInvite"
        :isDisabled="!meta.valid || isSendingInvite"
        label="Send invite"
      ></hp-button>
    </form>
  </div>
</template>

<script setup>
// Vendor
import { ref } from "vue";
import * as yup from "yup";

// Components
import HpInput from "@/components/form/hp-input.vue";
import HpButton from "@/components/hp-button.vue";

// Composables
import { useForm } from "vee-validate";
import { usePost } from "@/composables/useHttp";

const isSendingInvite = ref(false);

const emits = defineEmits(["memberInvited"]);
const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const { handleSubmit, meta, values } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  isSendingInvite.value = true;
  const postInvitation = usePost("invitations");
  await postInvitation.post({
    invitation: {
      email: values.email,
    },
  });
  emits("memberInvited");
  isSendingInvite.value = false;
});
</script>
