<template>
  <df-messenger
    project-id="recruitment-profiling"
    agent-id="17a4859e-a2f5-4abb-8444-6f0546455a42"
    df-messenger-chat-background="#e89999"
    df-messenger-chat-collapse-icon-size="100px"
    language-code="en"
  >
    <df-messenger-chat-bubble
      df-messenger-chat-collapse-icon-size="12px"
      allow-fullscreen="always"
      expanded="true"
      chat-close-icon="false"
      chat-title="Jobgo AI Profiling"
    ></df-messenger-chat-bubble>
  </df-messenger>
</template>

<script setup>
//vendor
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
// Composables

import { state } from "@/composables/useAuth";

//state
const router = useRouter();
const chatParameter = ref({});
//hooks
onMounted(() => {
  const dfMessenger = document.querySelector("df-messenger");
  dfMessenger.startNewSession({ retainHistory: false });

  window.addEventListener("df-response-received", (event) => {
    chatParameter.value = event?.detail?.raw?.queryResult?.parameters;
  });

  window.addEventListener("df-session-ended", (event) => {
    console.log("session end :- ", chatParameter.value, event);
    onHandleProject(chatParameter.value);
  });
});

//methods
const onHandleProject = async (chatObject) => {
  const {
    position_name,
    candidate_experience,
    location_type,
    candidate_education,
    job_description_type,
    job_description,
  } = chatObject;

  const payload = {
    jobPosition: position_name,
    experience: candidate_experience,
    location: location_type,
    education: candidate_education,
    job_description_type: job_description_type,
    salary: "$100,000 - $120,000",
    fullDescription: job_description,
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/opening`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + state.token,
        "Csrf-Token": "nocheck",
      },
      body: JSON.stringify(payload),
    });
    setTimeout(() => {
      router.push("/openings");
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.minimize-action {
  display: none !important;
}

.remove {
  display: none !;
}

.minimize-action .focus-outline-contrast {
  display: none !important;
}
</style>
