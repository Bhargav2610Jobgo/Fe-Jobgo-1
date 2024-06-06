<template>
  <div class="voice-chat-container">
    <div style="width: 50%;">
      <div style="display: flex;flex-direction: column;align-items: center;margin-top: 10rem;">
        <button @click="createJson" class="end-chat">
          End Chat
        </button>

        <div v-show="!aiSpeaking" id="speech" class="btn m-left type2"
          style="display: flex;align-items: center;justify-content: center" @click="startRecording">
          <div class="pulse-ring"></div>
          <hp-icon size="70" name="micro"></hp-icon>
        </div>
      </div>
      <!-- <div class="title">Jobgo AI Voice Chat Demo</div> -->
      <!-- <div class="voice-chat-button" >
        <img style="width: 100px;" alt="microphone"
          src="https://icon-library.com/images/microphone-icon-png/microphone-icon-png-1.jpg" />
      </div> -->
      <div v-show="aiSpeaking" @click="stopButton">
        <div class="muzik">
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>
          <div class="loader"></div>

        </div>
        <div>
          Tab To Cancel AI Speaking
        </div>
      </div>


    </div>
    <div v-show="outputText.length" style="width: 50%;height: 100vh;overflow: scroll;scrollbar-width: 0;padding:0 10px 0 10px;" class="scrollable">
      <div v-for="(item, index) in outputText" :key="index">

        <div v-if="item.role == 'user'" style="flex-direction: column; display: flex;justify-content: center;align-items: start;  text-align: left;margin-bottom: 10px;
}"><div style="flex-direction: row; display: flex;justify-content: center;align-items:center ">
  
  <div style="padding: 0.5rem;margin-right: 0.2rem;">
            <hp-avatar2 size="sm" :user="state.user.name" class="hp-header__dropdown__info__avatar" />
          </div>
          <div>
            {{ state.user.name }}
          </div>
</div>
          <div style="margin-left: 3rem;">
            {{ item.content }}
          </div>
        </div>

        <div v-if="item.role == 'assistant'" style="flex-direction: column; display: flex;justify-content: center;align-items: start;  text-align: left;margin-bottom: 10px;
}"><div style="flex-direction: row; display: flex;justify-content: center;align-items:center ">
  
  <div style="padding: 0.5rem;margin-right: 0.2rem;">
            <hp-avatar2 size="sm" user="A I" class="hp-header__dropdown__info__avatar" />
          </div>
          <div>
         Copilot
          </div>
</div>
          <div style="margin-left: 3rem;">
            {{ item.content }}
          </div>
        </div>
        <!-- <div v-if="item.role == 'assistant'" style="display: flex;justify-content: end;    text-align: right;margin-bottom: 10px;
}">
          <div style="background-color: #96a3;padding: 0.5rem;margin-right: 0.2rem;"> AI</div>

          {{ item.content }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import HpIcon from "@/components/hp-icon.vue";
import useAuth from "@/composables/useAuth";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { state } from "../../composables/useAuth";
import { usePost,useGet } from "@/composables/useHttp";
import HpAvatar2 from "@/components/hp-avatar2.vue";

const { logout, organization, user } = useAuth();
let audioElement = null;
let threadId = ref(null);
let roomId = ref(null);
const aiSpeaking = ref(false);
const conversationMsg = ref([
  { role: "assistant", msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊" }
]);
const outputText = ref([]);
const currentUser = ref(null);
let webSocket = null;
const backendURL = 'http://localhost:3000'; // Removed trailing slash
const openAiKey=ref(null)
onMounted(async () => {
  const getKey = useGet(`api/key`);
  await getKey.get();
  if(getKey.data.value.key)
  {
    openAiKey.value=getKey.data.value.key
  }
  if (route.query?.room && route.query?.thread && route.query?.user) {
    currentUser.value = route.query?.user;
  } else {
    currentUser.value = user.value.name;
  }
  connectWebsocket();
});

const connectWebsocket = () => {
  webSocket = new WebSocket(import.meta.env.VITE_SOCKET_URL);

  if (!threadId.value && !roomId.value && webSocket) {
    webSocket.onopen = function (event) {
      console.log("onopen")
      if (!(route.query?.room && route.query?.thread && route.query?.user)) {
        webSocket.send(JSON.stringify({
          event: "register",
          role: "hiring manager",
          userName: currentUser.value
        }));
      } else {
        webSocket.send(JSON.stringify({
          event: "add-member",
          room: route.query?.room,
          thread: route.query?.thread,
          userName: currentUser.value
        }));
      }
    };
  }

  webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("data",data)

    if (route.query?.room && route.query?.thread && route.query?.user) {
      roomId.value = route.query?.room;
      threadId.value = route.query?.thread;
    } else {
      if (data.event === 'register') {
        roomId.value = data.roomId;
        threadId.value = data.threadId;
      }
    }

    if (data.event === 'get-message') {
      conversationMsg.value.push({
        role: data.role,
        msg: data.msg,
        userName: data.userName,
      });
    } else if (data.event === 'ai-response') {
      isChatLoading.value = false;
      speak(data.msg);
      conversationMsg.value.push({
        role: data.role,
        msg: data.msg
      });
    } else if (data.event === 'complete-chat') {
      const msg1 = JSON.parse(data.msg);
      const data1 = msg1.data.reverse();
      for (let index = 0; index < data1.length; index++) {
        const element = data1[index];
        conversationMsg.value.push({
          role: element.role,
          msg: element.content[0].text.value,
          userName: element.metadata.user
        });
      }
    }
  };

  webSocket.onclose = () => {
    setTimeout(connectWebsocket, 100); // Reconnect after 100 milliseconds
  };

  webSocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

const setupRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true; // Changed to true for interim results
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (event.results[event.results.length - 1].isFinal) {
      handleRecognitionResult(transcript);
    }
  };

  recognition.onspeechend = () => {
    recognition.stop();
    document.getElementsByClassName('pulse-ring')[0].classList.remove('pulse-ring-animation');
  };

  return recognition;
};

const handleRecognitionResult = (transcript) => {
  outputText.value.push({
    role: 'user',
    content: transcript.trim()
  });
  sendMessage(transcript.trim());
};

const startRecording = () => {
  recognition.start();
  document.getElementsByClassName('pulse-ring')[0].classList.add('pulse-ring-animation');
};

const stopRecording = () => {
  recognition.stop();
  document.getElementsByClassName('pulse-ring')[0].classList.remove('pulse-ring-animation');
};

const recognition = setupRecognition();
// const synthesis = setupSynthesis();

const isChatLoading = ref(false);

const sendMessage = async (message) => {
  isChatLoading.value = true;
  const postQuestion = usePost("chat/message");
  await postQuestion.post({
    chatMessage: outputText.value
  });
  speak(postQuestion.data.value.content);
  outputText.value.push(postQuestion.data.value);
};

const speak = async (message) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAiKey.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "tts-1",
      input: message,
      voice: "alloy"
    })
  };
  fetch('https://api.openai.com/v1/audio/speech', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const audioURL = URL.createObjectURL(blob);
      aiSpeaking.value = true;
      audioElement = new Audio(audioURL);
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      console.log("AI IS sepaking")
      audioElement.onended = () => {
        startRecording();
        aiSpeaking.value = false;
      };
    })
    .catch(error => {
      console.error('Error fetching audio:', error);
    });
};

const stopButton = () => {
  audioElement.pause();
  startRecording();
  aiSpeaking.value = false;
};

const createJson = async () => {
  await createParameterJSON();
};

const createParameterJSON = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/self/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + state.token,
      "Csrf-Token": "nocheck",
    },
    body: JSON.stringify({ conversation: JSON.stringify(outputText.value) }),
  });
  const { jobId } = await res.json();
  router.push(`/presentation?jobId=${jobId}`);
};
</script>

<style scoped lang="scss">
.voice-chat-container {
  display: flex;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.voice-chat-container .title {
  margin-top: 50px;
  font-size: 25px;
}

.voice-chat-container .voice-chat-button {
  margin-top: 50px;
}

.voice-chat-container .voice-chat-button img {
  height: 70px;
  width: 30px;
  background: white;
  border-radius: 100%;
}

.btn {
  border: none;
  padding: 0;
  border-radius: 100%;
  width: 100px;
  height: 100px;
  font-size: 3em;
  color: #fff;
  padding: 0;
  margin: 0;
  background: red;
  position: relative;
  z-index: 999;
  display: inline-block;
  line-height: 100px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
}

.pulse-ring {
  content: '';
  width: 100px;
  height: 100px;
  background: #189BFF;
  border: 5px solid #189BFF;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.pulse-ring-animation {

  animation: pulsate infinite 1.5s;
}

.pulse-ring.delay {
  animation-delay: 1s;
}

@-webkit-keyframes pulsate {
  0% {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1.3, 1.3);
    opacity: 0;
  }
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #d8d8d8;
}

.end-chat {
  color: white;
  padding: 0.4rem 1rem;
  cursor: pointer;
  width: 150px;
  margin-bottom: 10px;
  border-radius: 0.5rem;
  background-color: transparent;
  outline: none;
  border: 2px solid white;
}

.m-left {
  // margin-left: 100px * 3;
}

.type2 {
  background: #189BFF;
}

.type2 .pulse-ring {
  background: transparent;
}




.muzik {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 110px;
}

.loader {
  width: 12px;
  height: 4px;
  border-radius: 10px;
  background-color: #fff;
  animation: musicloader 1s ease-in-out infinite;

}

@keyframes musicloader {

  0% {
    height: 4px;
  }

  50% {
    height: 90px;
  }

  100% {
    height: 4px;
  }

}

.loader:nth-child(1) {
  background-color: #d715d7;
  animation-delay: 1s;
}

.loader:nth-child(2) {
  background-color: #d71515;
  animation-delay: 0.8s;
}

.loader:nth-child(3) {
  background-color: #d71579;
  animation-delay: 0.6s;
}

.loader:nth-child(4) {
  background-color: #d76715;
  animation-delay: 0.4s;
}

.loader:nth-child(5) {
  background-color: #d76415;
  animation-delay: 0.2s;
}

.loader:nth-child(6) {
  background-color: #d70415;
  animation-delay: 0.4s;
}

.loader:nth-child(7) {
  background-color: #d76715;
  animation-delay: 0.4s;
}

.loader:nth-child(8) {
  background-color: #d71579;
  animation-delay: 0.6s;
}

.loader:nth-child(9) {
  background-color: #d71515;
  animation-delay: 0.8s;
}

.loader:nth-child(10) {
  background-color: #d715d7;
  animation-delay: 1s;
}

.scrollable {
  width: 300px;
  height: 200px;
  overflow: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollable::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollable {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>