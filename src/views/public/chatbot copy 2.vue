<template>
  <div class="chat-boat-container">
    <div class="chat-welcome">
      <div style="display: flex;justify-content:center;align-items: center;flex-direction:column">
<h1 style="font-weight: 800;">Jobgo Profiling Tools</h1>

<Logo  style="margin-top: 1rem;"/>
      </div>
    </div>
    <div class="chat-container">

      <!-- Heading -->
      <div class="header-container">
        <div>
          <h2>Job Go AI Profiling Tools </h2>
          <p>Powered by JoboGo.com</p>
        </div>
        <div>
          <!-- <button class="create-json" @click="createJson">Edit prompt</button> -->

          <router-link class="create-json" to="/prompt">
            <span>Edit prompt</span>
          </router-link>

          <button class="create-json" @click="createJson">{{ isEndChat ? 'Loading...' : 'End Chat' }}</button>
        </div>
      </div>

      <!-- Chat Container -->
      <div  class="chat-box-container" ref="chatBoxRef">

        <div class="" v-for="(item, index) of  conversationMsg" :key="index">
<!-- <span style="color: black;">{{ item.role }}</span> -->
          <div v-if="item.role === 'user'" class="user-chat-container">
            <p class="message">
              <span>You </span>
            <p>{{ item.msg }}</p>
            </p>
            <span>
              <div class="user-img">
                <svg stroke="none" fill="black" stroke-width="0" viewBox="0 0 16 16" height="20" width="20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                  </path>
                </svg>
              </div>
            </span>
          </div>

          <div v-else-if="item.role === 'assistant' || item.role === 'staff'" class="AI-chat-container">
            <span>
              <div class="ai-image">
                <svg stroke="none" fill="black" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20"
                  width="20" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                  </path>
                </svg>
              </div>
            </span>
            <p class="message">
              <span>{{item.role}} </span>
            <p>{{ item.msg }}</p>
            </p>
          </div>
        </div>

        <div class="AI-chat-container" v-if="isChatLoading">
          <span>
            <div class="ai-image">
              <svg stroke="none" fill="black" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20"
                width="20" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                </path>
              </svg>
            </div>
          </span>
          <p class="message">
            <span>AI </span>
            <span class="loader"></span>
          </p>
        </div>
      </div>

      <!-- Input box -->
      <div class="inputbox-container">
        <form class="form" @submit.prevent="sendMsg">
          <input :disabled="isChatLoading || isChatThreadLoading" v-model="userMsg"
            :placeholder="(isChatLoading || isChatThreadLoading) ? 'Loading...' : 'Type your message'">
          <button :disabled="isChatLoading || isChatThreadLoading" type="submit" class="sendbtn">{{ (isChatLoading ||
            isChatThreadLoading) ? 'Loading...' : 'Send' }}</button>

          <!-- <hp-button
          label="END CHAT"
          :isLoading="isChatLoading || isChatThreadLoading"
        ></hp-button> -->

        </form>
      </div>

    </div>
  </div>
  <!-- <div class="spinner__div" v-else >
  <hp-spinner
        class="hp-button__button__spinner"
        :size="25"
        :mode="primary ? 'light' : 'dark'"
      ></hp-spinner>
</div> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePost, useGet } from "@/composables/useHttp";
import HpButton from "@/components/hp-button.vue";
import useAssistant from "@/composables/useAssistant";
import { useRouter, useRoute } from "vue-router";
import HpSpinner from "@/components/hp-spinner.vue";
import useToast from "@/composables/useToast";
import io from 'socket.io-client';
import Logo from "@/assets/logo.svg";

const { setToast } = useToast();

//hooks
const router = useRouter();
const route = useRoute();
// state
const { conversationSummary } = useAssistant();

const conversationMsg = ref([
  {
    role: "Assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊",
  },
]);

const showEndChat = ref(false);
const userMsg = ref(null);
const chatBoxRef = ref(null);
const roomId=ref(null)

const threadId = ref(null);
const isChatLoading = ref(false);
const isChatThreadLoading = ref(false);
const isEndChat = ref(false);
const userIsEmployee= ref(false);
let socket = null

// methods

const sendMsg = async () => {
  
  if (!userMsg.value) {
    return
  }
  console.log("userIsEmployee",userIsEmployee)
  if(userIsEmployee.value)
  {
    socket.emit('member-message', {message: userMsg.value,role:"member"});
    userMsg.value=null
    return
  }
  const obj = { message: userMsg.value,roomId:roomId.value,role:"user"}
  socket.emit('message', obj);
  const chatBox = chatBoxRef.value;
  isChatLoading.value = true;
  // conversationMsg.value.push({
  //   role: "user",
  //   msg: userMsg.value,
  // });

  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  const query = userMsg.value;
  userMsg.value = null;
  // socket.emit('message', obj);
     socket.emit('post-ai-response', {   msg: query,
    threadId: threadId.value,
    roomId:roomId.value,
    role:"user"})
//  conversationMsg.value.push({
//     role: "assistant",
//     msg: data.value,
//   });
// if (data.value.includes("The Chat is end")) {
  //   showEndChat.value = true;
  //   createParameterJSON()
  // }  
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

const createParameterJSON = async () => {
  const { post, data, loading } = usePost("generate-json");
  await post({
    conversation: conversationMsg.value
  });
  console.log("generate-json", data);
};

const createConversationSummary = async () => {
  const { post, data, loading } = usePost("create-summary");
  await post({
    conversation: conversationMsg.value
  });
  conversationSummary.value = data.value
  setToast({
    type: "positive",
    title: "Success!",
    message: "Email send Successfully",
  });
  router.push("/conversation-summary");
};

const createJson = async () => {
  isEndChat.value = true
  await createParameterJSON();
  await createConversationSummary()
  isEndChat.value = false
}

const createAssistant = async () => {
  isChatThreadLoading.value = true
  const assistant = useGet(`create-assistant`);
  await assistant.get();
  conversationMsg.value = [
    {
      role: "assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊",
    },
  ];
  isChatThreadLoading.value = false

};
const createThread = async () => {
  isChatThreadLoading.value = true
  const thread = useGet(`create-thread`);
  await thread.get();
  threadId.value = thread.data.value.threadId.id
  socket.emit("create-room",{roomId:roomId.value,threadId:threadId.value}) 
  isChatThreadLoading.value = false
};

const deleteThread = async () => {
  const deleteFiles = useDelete(`delete-thread/${threadId}`);
  await deleteFiles.remove();
};
const generateRandomAlphaNumeric=()=> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const getMessageList=async(threadId)=>{
  console.log("threadId",threadId)
  isChatThreadLoading.value = true
  const thread = useGet(`get-messages?threadId=${threadId}`);
  await thread.get();
  // conversationMsg.value=thread.data.value.messages
  console.log("thread.data.value.messages",thread.data.value.messages)
 const messagesList= thread.data.value.messages && thread.data.value.messages.map((message)=>{
    return {
      role:message.role,
      msg:message.content[0].text.value,
    }
    
  })
 conversationMsg.value=messagesList.reverse()
 console.log("conversationMsg",conversationMsg.value);
 messagesList.unshift( { role: "assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊"})
  isChatThreadLoading.value = false
}
onMounted(async () => {
 
  socket = io(import.meta.env.VITE_API_URL);
  socket.on("connect",async () => {
 if(route.query?.room && route.query?.thread)
 {
  userIsEmployee.value=true
  roomId.value=route.query?.room
  threadId.value=route.query?.thread
  console.log("roomId",roomId);
  console.log("threadId",threadId);
await  getMessageList(threadId.value)
 }
 else{
  roomId.value=generateRandomAlphaNumeric()
  await createAssistant();
setTimeout(async () => {
  await createThread();
}, 1000)
 
 }
  });
  socket.on("get-ai-message", (data) => {
    console.log("get-ai-message",data);
     conversationMsg.value.push({
      role:"assistant",
       msg: data
     });
     isChatLoading.value=false
   });
 socket.on("receive-message", (data) => {
  console.log("receive-message",data);
     conversationMsg.value.push({
      role:"user",
       msg: data
     });
   });
 socket.on("receive-member-message", (data) => {
  console.log("receive-message",data);
     conversationMsg.value.push({
      role:"staff",
       msg: data
     });
   });
});

const extractRole=(originalString)=> {
  let parts = originalString.split('role:');
let role = parts[1];
return role
}
const  extractMessage=(originalString)=> {
  let parts = originalString.split('role:');
let msg = parts[0].substring('msg:'.length);
msg = msg.substring(0, msg.length - 1);
return msg
}

</script>


<style scoped >
.create-json {
  background: white;
  padding: 6px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid #aeabab;
  cursor: pointer;
  margin-right: 10px;
  color: black;
}

.chat-boat-container {
  height: 100vh;
  display: flex;
}
.chat-welcome{
  background: rgb(243, 239, 239 );
  width: 35%;
color: black;
display: flex;
justify-content: center;
align-items: center;
}

.chatButton {
  display: block;
  display: inline-flex;
  right: 1rem;
  bottom: 1rem;
  padding: 0;
  margin: 0;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  border-width: 1px;
  border-color: #E5E7EB;
  width: 4rem;
  height: 4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  line-height: 1.25rem;
  text-transform: none;
  background-color: #000000;
  background-image: none;
  cursor: pointer;
  color: white;
}

.chatButton:hover {
  background-color: #374151;
}


/* chat-container start */

.logo-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-container {
  width: 70%;
  /* padding: 1.5rem; */
  /* border-radius: 0.5rem; */
  border-width: 1px;
  background-color: #ffffff;
  bottom: calc(4rem+1.5rem);
  border-color: #e5e7eb;
  width: 50%;
  height: 100%;
}

@media (max-width: 768px) {
  .logo-container {
    display: none;
  }

  .chat-container {
    width: 100%
  }
}

/* chat-container end */

/* Header container start */
.header-container {
  padding: 10px 1rem 0 1rem;
  display: flex;
  padding-bottom: 1rem;
  margin-top: 0.375rem;
  justify-content: space-between;
  /* flex-direction: column; */
}

.header-container h2 {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: black;
  margin-bottom: 10px;
}

.header-container p {
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: .75rem;
  color: #6b7280;
}

/* Header container end */

/* chat-box-container Start */
.chat-box-container {
  padding: 0 1rem;
  height: 78vh;
  overflow: auto;
  margin-bottom: 1rem;
}

.chat-box-container::-webkit-scrollbar {
  width: 5px;
}

.chat-box-container::-webkit-scrollbar-thumb {
  background-color: #a3a3a5;
  border-radius: 8px;
}

.chat-box-container::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 8px;
}

/* chat-box-container End */

/* user-chat-container Start */

.user-chat-container {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex: 1 1 0%;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #4B5563;
}

.user-chat-container span {
  display: flex;
  overflow: hidden;
  position: relative;
  shrink: 0;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  text-align: center;
}

.user-chat-container .user-img {
  padding: 0.25rem;
  border-radius: 9999px;
  border-width: 1px;
  background-color: #F3F4F6;
}

.user-chat-container .message {
  line-height: 1.625;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.user-chat-container .message span {
  display: block;
  font-weight: 700;
  color: #374151;
}

/* user-chat-container End */

/* AI-chat-container Start */

.AI-chat-container {
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex: 1 1 0%;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #4B5563;

}

.AI-chat-container span {
  display: flex;
  /* overflow: hidden; */
  position: relative;
  shrink: 0;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  /* text-align: center; */
}

.AI-chat-container .ai-image {
  padding: 0.25rem;
  border-radius: 9999px;
  border-width: 1px;
  background-color: #F3F4F6;
}

.AI-chat-container .message {
  line-height: 1.625;
}

.AI-chat-container .message span {
  display: block;
  font-weight: 700;
  color: #374151;
}

/* AI-chat-container end */

/* Input box container start */
.inputbox-container {
    padding-top: 0;
    /* background-color: red; */
    width: 70%;
    position: fixed;
    bottom: 20px;
}

.inputbox-container .form {
  display: flex;
  margin-left: 0.5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.inputbox-container input {
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 16px;
  border-width: 1px;
  width: 100%;
  height: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  /* border-color: #e5e7eb; */
  color: #030712;
  margin-right: 15px;
  border: 1px solid #b8b6b6;
}

.spinner__div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputbox-container .sendbtn {
  display: inline-flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  height: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  background-color: #000000;
  color: #f9fafb;
}


.inputbox-container .sendbtn:hover {
  background: #111827E6;
}

.chat__assistant-text,
.chat__user-text,
.chat__loading-text {
  color: black;
}

/* Input box container end */

/* Loader css start*/
.AI-chat-container .message span.loader {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: block;
  margin: 0 !important;
  position: relative;
  color: #c6c3c3;
  box-sizing: border-box;
  animation: animloader 1s linear infinite alternate;
  left: 20px;
}

@keyframes animloader {
  0% {
    box-shadow: -19px -3px, -7px 3px, 7px -3px;
  }

  33% {
    box-shadow: -19px 3px, -7px -3px, 7px 3px;
  }

  66% {
    box-shadow: -19px -3px, -7px 3px, 7px -3px;
  }

  100% {
    box-shadow: -19px 3px, -7px -3px, 7px 3px;
  }
}

/* Loader css end */
</style>