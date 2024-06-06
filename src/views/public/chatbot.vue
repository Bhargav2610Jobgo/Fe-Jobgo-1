<template>
  <div class="chat-boat-container text-base">
    <!-- <div class="chat-welcome">
      <div style="display: flex;justify-content:center;align-items: center;flex-direction:column">
<h1 style="font-weight: 800;">Jobgo Profiling Tools</h1>

<Logo  style="margin-top: 1rem;"/>
      </div>
    </div> -->



    <div class="chat-container">

      <!-- Heading -->
      <div class="header-container">
        <div>
          <h2>JobGo AI Profiling Tools


          </h2>
        </div>
        <div>
          <!-- <button class="create-json" @click="createJson">Edit prompt</button> -->

          <router-link class="create-json" to="/prompt">
            <span>Edit prompt</span>
          </router-link>

          <button class="create-json" @click="inviteMember">Invite</button>
          <button class="create-json" @click="createJson">{{ isEndChat ? 'Loading...' : 'End Chat' }}</button>
        </div>
      </div>

      <!-- Chat Container -->
      <div class="chat-box-container" ref="chatBoxRef">
        <div class="" v-for="(item, index) of  conversationMsg" :key="index">
          <!-- <span style="color: black;">{{ item.role }}</span> -->

          <!-- <div v-if="item.role === 'user'" class="user-chat-container"> -->
          <div v-if="item.role == userName" class="user-chat-container">
            <p class="message text-base">
              <span>{{ item?.role?.charAt(0).toUpperCase() + item.role.slice(1) }} </span>
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

          <div v-else-if="item.role != userName" class="AI-chat-container">
            <span v-if="item.role == 'assistant' || item.role == 'Assistant' || item.role == 'assistent'">
              <div class="ai-image">
                <img alt="logo" src="../../assets/sm-logo.png" width="20" height="20" />

              </div>
            </span>
            <span v-else-if="item.role != 'assistant'">
              <div class="user-img">
                <svg stroke="none" fill="black" stroke-width="0" viewBox="0 0 16 16" height="20" width="20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                  </path>
                </svg>
              </div>
            </span>
            <p class="message">
              <span v-if="item.role == 'assistant' || item.role == 'Assistant'">Jobgo AI Copilot </span>
              <span v-else-if="item.role == 'assistent'" class="text-base">
                Jobgo AI Copilot
              </span>
              <span v-else-if="item.role != 'assistent' || item.role == 'hiring-manager'" class="text-base">
                {{ item.userName }}
              </span>

              <!-- <p>{{ item.msg }}</p> -->
            <div class="job-description  text-base">
              <vue-markdown :source="item.msg" />
            </div>
            <!-- copilot -->
            </p>
          </div>
        </div>

        <div class="AI-chat-container" v-if="isChatLoading">
          <span>
            <div class="ai-image">
              <!-- <svg stroke="none" fill="black" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20"
                width="20" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                </path>
              </svg> -->
              <img alt="logo" src="../../assets/sm-logo.png" width="20" height="20" />

            </div>
          </span>
          <p class="message  text-base">
            <span>Jobgo AI Copilot </span>
            <span class="loader"></span>
          </p>
        </div>
      </div>

      <!-- Input box -->
      <div class="inputbox-container">
        <form class="form" @submit.prevent="sendMsg">

          <input @keyup.enter="sendMsg" autofocus class="text-base" :disabled="isChatLoading || isChatThreadLoading"
            v-model="userMsg"
            :placeholder="(isChatLoading || isChatThreadLoading) ? 'Loading...' : 'Type your message'">
          <!-- <button :disabled="isChatLoading || isChatThreadLoading" type="submit" >{{ (isChatLoading ||
            isChatThreadLoading) ? 'Loading...' : 'Send' }}</button> -->
            <div @click="sendMsg" class="sendbtn" :class="{ 'sendBtn-fade-right': sss }">
            <hp-icon name="send-white" size="30" class="sendbtn-icon"/>
          </div>
        </form>
      </div>

    </div>
  </div>

  <hp-modal class="invite-modal invite" style="width: 55%;" :isOpen="isInviteModalVisible"
    @close="isInviteModalVisible = false">
    <generic-modal class="" title="Invite" subtitle="Invite other people in conversation">
      <div class="invite-modal__input" style="display: flex;justify-content:space-between;align-items: center;"
        v-for="(item, index) of users">
        <div style="display: flex;justify-content:space-between;align-items: center;">
          <div style="display: flex;flex-direction: column;height:60px" class="">
            <input class="invite-input" ref="username" style=" outline: none !important;
  
    border: 2px solid grey !important;padding:8px;border-radius: 10px;
    background-color: transparent !important;margin-top: 10px;" :class="`username${index}`" v-model="item.userName"
              name="username" placeholder="Enter your username" label="username" type="text" />
            <div v-if="item.userNameError" style="color: red;padding-top:2px;">{{ item.userNameError }}</div>
          </div>
          <div style="display: flex;flex-direction: column;height:60px">
            <input ref="email" class="invite-input" style=" outline: none !important;
    border: 2px solid grey !important;padding:8px;border-radius: 10px;
    margin-top: 10px;
    margin-left: 12px;
    background-color: transparent !important;" name="username" placeholder="Enter your email" label="email"
              :class="`email${index}`" type="text" v-model="item.email" />
            <div v-if="item.emailError" style="color: red;padding-left:15px;padding-top:2px;font-size:0.8rem">
              {{ item.emailError }}</div>
          </div>
        </div>
        <div>

          <div style="display: flex;justify-content:space-between;align-items: center; margin-bottom: 15px;">
            <hp-icon v-if="index + 1 == users.length" @click="addRow" class="invite-modal__input__icon"
              style="display: cursor !important;" name="plus"></hp-icon>
            <hp-icon @click="deleteRow(index)" v-if="index != 0" class="invite-modal__input__icon"
              style="display: cursor !important" name="delete"></hp-icon>
          </div>
        </div>
      </div>
      <template #actions>
        <hp-button label="Send Invite" @handleClick="sendInvite">
        </hp-button>
        <!-- <hp-button
            :to="`/reports/${candidate.key}`"
            label="Visit report"
            icon="share"
          >
          </hp-button> -->
      </template>
    </generic-modal>
  </hp-modal>
</template>

<script setup>
// import InviteModal from "@/views/assistant/InviteModal.vue";

import GenericModal from "@/components/modals/generic-modal.vue";
import HpModal from "@/components/hp-modal.vue";
import { ref, onMounted, computed } from "vue";
import { usePost, useGet } from "@/composables/useHttp";
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import useAssistant from "@/composables/useAssistant";
import { useRouter, useRoute } from "vue-router";
import HpSpinner from "@/components/hp-spinner.vue";
import useToast from "@/composables/useToast";
import Logo from "@/assets/logo.svg";
import Chat from "@/assets/chat.svg";
import { state } from "../../composables/useAuth";
import useAuth from "@/composables/useAuth";
import VueMarkdown from 'vue-markdown-render';

const { logout, organization, user } = useAuth();

const { setToast } = useToast();
const API_URL = import.meta.env.VITE_API_URL;

const sss = computed(() => {
  return userMsg.value ? true : false
})
//hooks
const router = useRouter();
const route = useRoute();
// state
const { conversationSummary } = useAssistant();

const conversationMsg = ref([
  { "role": "assistant", "msg": "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊" }

]);

const showEndChat = ref(false);
const userMsg = ref(null);
const chatBoxRef = ref(null);
const roomId = ref(null)

const threadId = ref(null);
const userName = ref(null);
const isChatLoading = ref(false);
const isChatThreadLoading = ref(false);
const isEndChat = ref(false);
const userIsEmployee = ref(false);
let socket = null
let webSocket = null

const users = ref([{
  userName: null,
  userNameError: null,
  email: null,
  emailError: null,
}])

const username = ref(null)
const email = ref(null)
// methods
const closeWebSocket = () => {
  webSocket.close();
}
const reconnectWebSocket = () => {
  connectWebsocket();

}
const sendInvite = async () => {
  users.value.forEach((user, index) => {
    user.userNameError = null
    user.emailError = null
  })
  for (let index = 0; index < users.value.length; index++) {
    const user = users.value[index];
    if (!user.userName) {
      user.userNameError = "User Name is required"
      const inputElement = document.querySelector(`.username${index}`);
      inputElement.focus();
      return
    }
    if (!user.email) {
      user.emailError = "Email is required"
      const inputElement = document.querySelector(`.email${index}`);
      inputElement.focus();
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      user.emailError = "Email is invalid"
      const inputElement = document.querySelector(`.email${index}`);
      inputElement.focus();
      return
    }
  }
  const userNamesAndEmails = users.value.map(user => {
    return { userName: user.userName, email: user.email };
  });


  const body = {
    room: roomId.value,
    thread: threadId.value,
    users: userNamesAndEmails
  }
  const sendInvite = usePost("chat/invite");
  await sendInvite.post(body);

  setToast({
    type: "positive",
    title: "Success!",
    message: "Invite Successfully",
  });
  isInviteModalVisible.value = false
  users.value = [{
    userName: "",
    email: "",
  }]
}
const sendMsg = async () => {
  isChatLoading.value = true;
  webSocket.send(JSON.stringify(
    { event: "send-message", role: "hiring-manager", userName: currentUser.value, msg: userMsg.value, room: roomId.value, threadId: threadId.value }));

  webSocket.send(JSON.stringify(
    { event: "send-ai-message", role: "hiring-manager", userName: currentUser.value, msg: userMsg.value, room: roomId.value, threadId: threadId.value }));
  userMsg.value = null

  // const obj = { message: userMsg.value, roomId: roomId.value, role: userName?.value }
  // socket.emit('message', obj);
  // exampleSocket.onmessage = function (event) {
  //   console.log('Received message:', event.data);
  //   // Handle incoming messages here
  //   handleMessage(event.data);
  // };


  // const chatBox = chatBoxRef.value;
  // isChatLoading.value = true;
  // // conversationMsg.value.push({
  // //   role: "user",
  // //   msg: userMsg.value,
  // // });

  // if (chatBox) {
  //   chatBox.scrollTop = chatBox.scrollHeight;
  // }
  // const query = userMsg.value;
  // userMsg.value = null;
  // // socket.emit('message', obj);
  // socket.emit('post-ai-response', {
  //   msg: query,
  //   threadId: threadId.value,
  //   roomId: roomId.value,
  //   role: "user",
  //   userName: userName?.value
  // })
  // //  conversationMsg.value.push({
  // //     role: "assistant",
  // //     msg: data.value,
  // //   });
  // // if (data.value.includes("The Chat is end")) {
  // //   showEndChat.value = true;
  // //   createParameterJSON()
  // // }  
  // if (chatBox) {
  //   chatBox.scrollTop = chatBox.scrollHeight;
  // }

  // scrollChatBottom();
};
const connectWebsocket = () => {
  console.log("currentUser.value", currentUser.value)
  webSocket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
  // Establishing a WebSocket connection
  // Check WebSocket state at intervals
  webSocket.onopen = () => {
    socektState.value = "Open"
  };

  if (!threadId.value && !roomId.value && webSocket) {
    webSocket.onopen = function (event) {
      if (!(route.query?.room && route.query?.thread && route.query?.user)) {
        webSocket.send(JSON.stringify(
          { event: "register", role: "hiring manager", userName: currentUser.value }));
      } else {
        webSocket.send(JSON.stringify(
          { event: "add-member", room: route.query?.room, thread: route.query?.thread, userName: currentUser.value }));
      }
    };
  }
  scrollChatBottom()

  // Event listener for incoming messages
  webSocket.onmessage = (event) => {
    // Handle incoming messages here
    const data = JSON.parse(event.data);
    console.log("data", data)
    if (route.query?.room && route.query?.thread && route.query?.user) {
      roomId.value = route.query?.room
      threadId.value = route.query?.thread
    } else {
      if (data.event === 'register') {
        roomId.value = data.roomId
        threadId.value = data.threadId
      }
    }

    if (data.event === 'get-message') {
      conversationMsg.value.push({
        role: data.role,
        msg: data.msg,
        userName: data.userName,
      });
      scrollChatBottom();
    }
    else if (data.event === 'ai-response') {
      isChatLoading.value = false;
      conversationMsg.value.push({
        role: data.role,
        msg: data.msg
      });
      scrollChatBottom();
    }
    else if (data.event === 'complete-chat') {
      const msg1 = JSON.parse(data.msg)
      const data1 = msg1.data.reverse()
      for (let index = 0; index < data1.length; index++) {
        const element = data1[index];
        console.log("msg1", element)
        conversationMsg.value.push({
          role: element.role,
          msg: element.content[0].text.value,
          msg: element.content[0].text.value,
          userName: element.metadata.user
        }
        )
      }
      scrollChatBottom();
    }
  };

  // Event listener for when the WebSocket connection is closed
  webSocket.onclose = () => {
    socektState.value = "close"

    // Try to reconnect after a delay
    setTimeout(connectWebsocket, 100); // Reconnect after 3 seconds
  };

  // Event listener for WebSocket errors
  webSocket.onerror = (error) => {
    socektState.value = "errro"

    console.error('WebSocket error:', error);
    // Handle WebSocket errors here
  };
}

const currentUser = ref(null)
onMounted(async () => {
  if (route.query?.room && route.query?.thread && route.query?.user) {
    currentUser.value = route.query?.user

  } else {
    currentUser.value = user.value.name

  }
  connectWebsocket()
});

const createParameterJSON = async () => {
  const res = await fetch(`${API_URL}/self/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + state.token,
      "Csrf-Token": "nocheck",
    },
    body: JSON.stringify({ conversation: JSON.stringify(conversationMsg.value) }),
  });
  const { jobId } = await res.json()
  router.push(`/presentation?jobId=${jobId}`);
};

function scrollChatBottom() {
  setTimeout(() => {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }, 300)

}

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
  // await createConversationSummary()
  isEndChat.value = false
}
const socektState = ref(null)
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
const addRow = (() => {
  users.value.push({
    userName: "",
    email: "",
  })
})
const deleteRow = ((index) => {
  users.value.splice(index, 1)
})




const isInviteModalVisible = ref(false)
const inviteMember = (() => {
  isInviteModalVisible.value = true

})

</script>


<style scoped lang="scss">
.create-json {
  background-color: var(--color-background);
  /* background: white; */
  padding: 6px;

  border-radius: 20px;
  font-size: 12px;
  border: 1px solid #aeabab;
  cursor: pointer;
  margin-right: 10px;
  color: var(--color-text-primary);
}

.chat-boat-container {
  background: var(--color-background) !important;
  height: 100vh;
  display: flex;
  overflow: hidden;
  margin: auto;

}

.chat-welcome {
  /* background: rgb(243, 239, 239); */
  background-color: var(--color-background);
  width: 35%;
  background-color: var(--color-background);
  color: var(--color-text-primary);
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
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.invite {
  background-color: var(--color-background);
  color: var(--color-text-primary);

}

.invite-input {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.chatButton:hover {
  background-color: #374151;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}


/* chat-container start */

.logo-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-container {
  padding: 0;
  margin: auto;
  /* border-radius: 0.5rem; */
  border-width: 1px;
  background-color: #ffffff;
  bottom: calc(4rem + 1.5rem);
  border-color: #e5e7eb;
  width: 70%;
  height: 100%;
  background-color: var(--color-background);
  color: var(--color-text-primary);
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
  padding-bottom: 1rem;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  /* flex-direction: column; */

  z-index: 100;
  padding: 10px 1rem 0 1rem;
  display: flex;
  padding-bottom: 1rem;
  display: flex;
  margin-top: 0.375rem;
  justify-content: space-between;
  position: sticky;
  top: 00px;
}

.header-container h2 {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: black;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.header-container p {
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: .75rem;
  color: #6b7280;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

/* Header container end */

/* chat-box-container Start */
.chat-box-container {
  padding: 0 1rem;
  /* min-height: calc(100vh - 150px); */
  height: 78vh;
  height: calc(100vh - 150px);
  overflow: auto;
  margin-bottom: 1rem;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.chat-box-container::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.chat-box-container::-webkit-scrollbar-thumb {
  background-color: #4c5255;
  border-radius: 8px;
}

.chat-box-container::-webkit-scrollbar-track {
  background-color: var(--color-background);
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

.user-img {
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
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.user-chat-container .message span {
  display: block;
  font-weight: 700;
  color: #374151;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}


.user-chat-container .message span {
  display: flex;
  overflow: hidden;
  position: relative;
  shrink: 0;
  border-radius: 0 !important;
  width: 2rem;
  height: 2rem;
  text-align: right;
  width: 100%;
  justify-content: right;
  background-color: var(--color-background);
  color: var(--color-text-primary);
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
  background-color: var(--color-background);
  color: var(--color-text-primary);
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
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

/* AI-chat-container end */

/* Input box container start */
.inputbox-container {
  background-color: var(--color-background);
  display: flex;
  padding-top: 0;
  align-items: center;
  position: sticky;
  z-index: 1000;
  bottom: 0px;
  padding: 10px;
}

.inputbox-container .form {
  display: flex;
  /* margin-left: 0.5rem; */
  justify-content: center;
  align-items: center;
  width: 100%;
}

.inputbox-container input {
  display: flex;
  /* padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem; */
  padding: 1.3rem 1.3rem;
  border-radius: 16px;
  border-width: 1px;
  width: 100%;
  /* height: 2.5rem; */
  /* font-size: 0.875rem; */
  line-height: 1.25rem;
  transition: all ease-in-out 500;
  border: none;
  /* border-color: #e5e7eb; */
  /* margin-right: 15px; */
  border: 1px solid #898989;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.inputbox-container input:focus-visible {
  outline: 1px solid #898989;
}

b .spinner__div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputbox-container .sendbtn {
  position: absolute;
  right: 20px;
  transition: all ease-in-out 500ms;
  // display: none;
  cursor: pointer;
}
.sendbtn-icon{
    fill: var(--color-revert-background)!important;
}


.sendBtn-fade-right {
  display: block !important;
  right: 20px !important;
}


/* .inputbox-container:hover .sendbtn {
  visibility: visible;
  right:20px;
  background: #111827E6;
} */

.inputbox-container .sendbtn:hover {
  /* visibility: visible; */
  /* background: #111827E6; */
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


.invite {}


.invite-modal {
  &__input {
    &__icon {
      margin-left: 10px;
      color: #000;
      cursor: pointer;
    }
  }

  input {}

  input:focus {
    outline: none
  }
}

/* Loader css end */


.job-description {
  color: black;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.job-description h1 {
  display: block;
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}

.job-description h2 {
  display: block;
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}

.job-description ul {
  display: block;
  list-style-type: disc;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
  /* Adjusted for the bullet point */
}

.job-description ol {
  display: block;
  list-style-type: decimal;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
  /* Adjusted for the number */
}

.job-description li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.job-description p {
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>