<template>
  <div class="chat">
    <div class="chat__header">
      <div style="display: flex; align-items: center">
        <div class="chat__header-logo">
          <Logo />
        </div>
        Job GO Profiling Tools
      </div>
      <div>
        <hp-button
          label="Create Json"
          @handleClick="createJson()"
        ></hp-button>
        <hp-button
          label="END CHAT"
          @handleClick="createThread(),createAssistant()"
          :isLoading="isChatLoading"
        ></hp-button>
      </div>
    </div>

    <div
      class="chat__container"
      style="overflow: scroll; height: 75vh; padding: 15px"
    >
      <div class="" v-for="(item, index) of conversationMsg" :key="index">
        <div
          style="margin-bottom: 10px"
          v-if="item.role == 'assistant'"
          class="chat__assistant"
        >
          <div class="chat__assistant-text">
            {{ item.msg }}
          </div>
        </div>

        <div
          style="margin-bottom: 10px"
          v-else-if="item.role == 'user'"
          class="chat__user"
        >
          <div class="chat__user-text">
            {{ item.msg }}
          </div>
        </div>
      </div>
      <div
        style="margin-bottom: 10px"
        v-if="isChatLoading"
        class="chat__loading"
      >
        <div class="chat__loading-text">...</div>
      </div>
    </div>
    <div class="chat__input">
      <input type="text" v-model="userMsg" v-on:keyup.enter="sendMsg" />
    </div>
  </div>
</template>

<script setup>
//vendor
import Logo from "@/assets/logo.svg";
import { ref, onMounted } from "vue";
import { usePost, useGet } from "@/composables/useHttp";
import HpButton from "@/components/hp-button.vue";
// state
const conversationMsg = ref([
  {
    role: "assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊",
  },
]);
const showEndChat = ref(false);
const userMsg = ref(null);
const isChatLoading = ref(false);
// methods
const sendMsg = async () => {
  isChatLoading.value = true;
  conversationMsg.value.push({
    role: "user",
    msg: userMsg.value,
  });
  const query = userMsg.value;
  userMsg.value = null;
  const { post, data, loading } = usePost("get-msg");
  await post({
    msg: query,
  });
  isChatLoading.value = false;
  conversationMsg.value.push({
    role: "assistant",
    msg: data.value,
  });
  if (data.value.includes("The Chat is end")) {
    showEndChat.value = true;
    createParameterJSON()
  }
};

const createParameterJSON = async () => {
  const { post, data, loading } = usePost("generate-json");
  await post({
    conversation:conversationMsg.value
  });
  console.log("generate-json",data);
};


const createJson = () => {
console.log("Create JSON");
createParameterJSON();
}

const createAssistant = async () => {
  const assistant = useGet(`create-assistant`);
  await assistant.get();
  conversationMsg.value = [
  {
    role: "assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊",
  },
  ];
};
const createThread = async () => {
  const thread = useGet(`create-thread`);
  await thread.get();
};
onMounted(async () => {
  await createAssistant();
  await createThread();
});
</script>

<style lang="scss" scoped>
.chat {
  height: 100vh;
  &__container {
    background-color: rgba(151, 151, 150, 0.2);
  }
  &__assistant {
    display: inline-block;
    &-text {
      // border-radius: 5%;
      // max-width: 78vw;
      padding: 10px;
      background-color: white;
    }
  }
  &__loading {
    display: inline-flex;
    padding: 10px;
    background-color: white;
    margin-top: 12px;
    border-radius: 10px;
    height: 30px;
    align-items: center;
    &-text {
      font-synthesis-weight: bold;
      font-size: 25px;
      margin-bottom: 4px;
    }
  }
  &__user {
    display: flex;
    justify-content: end;
    &-text {
      max-width: 78vw;
      border-radius: 5%;
      display: block;
      padding: 10px;
      background-color: white;
    }
  }
  &__header {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem;
    color: rgba(0, 0, 0, 0.4);
    background-color: white;
    font-weight: 600;
    top: 0;
    &-logo {
      display: flex;
    }
  }
  &__input {
    position: fixed;
    padding: 1rem;
    background-color: white;
    display: flex;
    justify-content: center;
    bottom: 1px;
    width: 100vw;
    input[type="text"] {
      width: 95vw;
      outline: 1px solid gray;
      border: none;
      border-radius: 2rem;
      padding: 1rem;
    }
  }
}

.chat__assistant-text, .chat__user-text { 
  color: black;
}
</style>
