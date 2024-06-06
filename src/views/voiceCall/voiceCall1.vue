=<!-- src/components/VoiceCall.vue -->
<template>
    <div>
      <h1>Agora Voice Call</h1>
      <button @click="join">Join Call</button>
      <button @click="leave">Leave Call</button>
      <button @click="mute">Mute</button>
      <button @click="unmute">Unmute</button>
    </div>
  </template>
  
  <script>
  import { joinChannel, leaveChannel, muteAudio, unmuteAudio } from "@/composables/useAgoraRTC.js";
  
  export default {
    name: "VoiceCall",
    data() {
      return {
  
      };
    },
    methods: {
      async join() {
        await joinChannel();
      },
      async leave() {
        await leaveChannel();
      },
      mute() {
        muteAudio();
      },
      unmute() {
        unmuteAudio();
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    margin: 5px;
    padding: 10px;
  }
  </style>