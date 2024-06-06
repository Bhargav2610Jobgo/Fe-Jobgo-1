<template>
  <div id="container">
    <div id="room-header" v-show="roomEntered">
      <!-- <h1 id="room-name">{{ roomId }}</h1> -->
      <h1 id="room-name">
    
        <span>
          COPILOT
        </span>
        <hp-button style="margin-left: 1rem;" label="Send Invite" @handleClick="isInviteModalVisible=true">
      </hp-button>
      </h1>
      <div id="room-header-controls">
        <!-- {{ micMuted }} -->
        <!-- <img id="mic-icon" class="control-icon" :src="micIcon" @click="toggleMic" /> -->
        <img id="mic-icon" class="control-icon" :src="micIcon" :class="{ 'bg-red': micMuted, 'bg-white': !micMuted }"
          @click="toggleMic" />
        <img id="leave-icon" class="control-icon" :src="getIcon('avatars/leave.png')" @click="leaveRoom" />
      </div>
    </div>

    <form id="form" v-show="!roomEntered" @submit.prevent="enterRoom">
      <!-- <div>
        <h3>Select An Avatar:</h3>
      </div>
      <div id="avatars">
        <img class="avatar-selection" v-for="src in avatars" :key="src" :src="getImageUrl(src)"
          @click="selectAvatar(src)" :style="avatarStyle(src)" />
      </div> -->

      <div id="form-fields">
        <label>Display Name:</label>
        <input required v-model="displayName" type="text" placeholder="Enter username..." />
        <!-- <label>Room Name:</label>
        <input required v-model="roomIdInput" type="text" placeholder="Enter room name..." /> -->
        <input type="submit" value="Enter Room" />
      </div>
    </form>

    <div v-show="roomEntered">
      <div id="members"></div>
      <!-- <div id="subtitle">{{ subtitle }}</div> -->

      <div class="chat_live">
        <h1>Chat With The Members</h1>
        <div id="messages"></div>
        <form id="send-message-form" @submit.prevent="sendMessageForm">
          <input id="message-input" v-model="messageInput" type="text" placeholder="Type a message..." />
          <button type="submit">Send</button>
        </form>
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
  </div>
</template>

<script setup>
import HpButton from "@/components/hp-button.vue";
import HpIcon from "@/components/hp-icon.vue";
import useToast from "@/composables/useToast";

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import GenericModal from "@/components/modals/generic-modal.vue";
import HpModal from "@/components/hp-modal.vue";
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import {  useRoute } from "vue-router";
// import './style.css'
import { usePost, useGet } from "@/composables/useHttp";

// import appid from '../appId.js';
const { setToast } = useToast();

const token = null;
const rtcUid = Math.floor(Math.random() * 2032);
const rtmUid = String(Math.floor(Math.random() * 2032));
const route = useRoute();

const getRoomId = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('room') ? urlParams.get('room').toLowerCase() : null;
};

const roomId = ref(getRoomId());
const roomIdInput = ref(roomId.value || '');
const displayName = ref('');
const avatar = ref('');
const micMuted = ref(true);
const roomEntered = ref(false);
const isInviteModalVisible= ref(false);
const messageInput = ref('');
const subtitle = ref('');
const messages = ref([]);


let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let rtcClient;
let rtmClient;
let channel;

// Initialize Web Speech API for speech recognition
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1][0].transcript;
  // displaySubtitle(result);
  // broadcastSubtitle(result);
};
const addRow = (() => {
users.value.push({
  userName: "",
  email: "",
})
})
const users = ref([{
userName: null,
userNameError: null,
email: null,
emailError: null,
}])

const deleteRow = ((index) => {
users.value.splice(index, 1)
})

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

function getImageUrl(name) {
  return new URL(`../../assets/${name}`, import.meta.url).href
}
function getIcon(name) {
  console.log("name: - ", name);
  return new URL(`../../assets/${name}`, import.meta.url).href
}

const avatars = [
  'avatars/male-1.png', 'avatars/male-2.png', 'avatars/male-4.png', 'avatars/male-5.png',
  'avatars/female-1.png', 'avatars/female-2.png', 'avatars/female-4.png', 'avatars/female-5.png'
];

const micIcon = computed(() => (micMuted.value ? getIcon('avatars/mic-off.png') : getIcon('avatars/mic.png')));

const selectAvatar = (src) => {
  avatar.value = src;
};

const avatarStyle = (src) => ({
  borderColor: avatar.value === src ? '#00ff00' : '#fff',
  opacity: avatar.value === src ? 1 : 0.5,
});

const displaySubtitle = (text) => {
  subtitle.value = text;
};

const broadcastSubtitle = async (text) => {
  try {
    await channel.sendMessage({ text: text });
  } catch (error) {
    console.error('Error broadcasting subtitle:', error);
  }
};

const initRtm = async (name) => {
  rtmClient = AgoraRTM.createInstance('a2a68bf38b4248b09443bc9097abec35');
  await rtmClient.login({ uid: rtmUid, token });

  channel = rtmClient.createChannel(roomId.value);
  await channel.join();

  await rtmClient.addOrUpdateLocalUserAttributes({ name, userRtcUid: rtcUid.toString() });

  getChannelMembers();

  window.addEventListener('beforeunload', leaveRtmChannel);

  channel.on('MemberJoined', handleMemberJoined);
  channel.on('MemberLeft', handleMemberLeft);
  channel.on('ChannelMessage', handleChannelMessage); // Listening for messages
};

const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  rtcClient.on('user-published', handleUserPublished);
  rtcClient.on('user-left', handleUserLeft);

  await rtcClient.join('a2a68bf38b4248b09443bc9097abec35', roomId.value, token, rtcUid);
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(micMuted.value);
  await rtcClient.publish(audioTracks.localAudioTrack);

  initVolumeIndicator();
};

const initVolumeIndicator = async () => {
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();

  rtcClient.on('volume-indicator', (volumes) => {
    volumes.forEach((volume) => {
      try {
        const item = document.getElementsByClassName(`avatar-${volume.uid}`)[0];
        if(item)
        {
        if (volume.level >= 50) {
          item.style.borderColor = '#00ff00';
        } else {
          item.style.borderColor = '#fff';
        }
      }
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const handleUserPublished = async (user, mediaType) => {
  await rtcClient.subscribe(user, mediaType);
  if (mediaType === 'audio') {
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
    user.audioTrack.play();
  }
};

const handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid];
};

const handleMemberJoined = async (MemberId) => {
  const { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid']);

  const newMember = `
    <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}" style="margin: 0.5em; display: flex; flex-direction: column; align-items: center; width: 120px; text-align: center;">
      <div  class="user-avatar avatar-${userRtcUid}"style="height: 75px; width: 75px; object-fit: contain; border: 2px solid #FFF; border-radius: 50%;">
        <div style="display:flex; justify-content:center;align-items:center;height: 100%;">  ${ getInitials(name)}</div>
          </div>
      <p style="margin-top: 10px;">${name}</p>
    </div>`;
  document.getElementById('members').insertAdjacentHTML('beforeend', newMember);
};

const handleMemberLeft = async (MemberId) => {
  document.getElementById(MemberId).remove();
};

const memmbers = ref([]);
const getInitials=(name) => {
  const nameArray = name.split(' ');
  if (nameArray.length === 1) {
    return nameArray[0].charAt(0);
  } else {
    return nameArray[0].charAt(0) + nameArray[1].charAt(0);
  }
}
const getChannelMembers = async () => {
  const members = await channel.getMembers();
  for (let i = 0; i < members.length; i++) {
    const { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid']);
    // memmbers.value.push({userRtcUid, members[i]});
    const newMember = `
      <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}" style="margin: 0.5em; display: flex; flex-direction: column; align-items: center; width: 120px; text-align: center;">
        <div  class="user-avatar avatar-${userRtcUid}"style="height: 75px; width: 75px; object-fit: contain; border: 2px solid #FFF; border-radius: 50%;">
        <div style="display:flex; justify-content:center;align-items:center;height: 100%;">  ${ getInitials(name)}</div>
          </div>
        <p style="margin-top: 10px;">${name}</p>
      </div>`;
    document.getElementById('members').insertAdjacentHTML('beforeend', newMember);
  }
};

const toggleMic = async () => {
  micMuted.value = !micMuted.value;
  audioTracks.localAudioTrack.setMuted(micMuted.value);
};
const  isMemberInvite=ref(false)

const enterRoom = async () => {
  // if (!avatar.value) {
  //   alert('Please select an avatar');
  //   return;
  // }
  roomId.value = roomIdInput.value.toLowerCase();
if(!isMemberInvite.value)
{
  window.history.replaceState(null, null, `?room=${roomId.value}`);

}

  await initRtc();
  await initRtm(displayName.value);

  roomEntered.value = true;
  recognition.start();
};

const leaveRtmChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

const leaveRoom = async () => {
  audioTracks.localAudioTrack.stop();
  audioTracks.localAudioTrack.close();
  await rtcClient.unpublish();
  await rtcClient.leave();

  await leaveRtmChannel();

  roomEntered.value = false;
  document.getElementById('members').innerHTML = '';

  recognition.stop();
};

const sendMessageForm = async () => {
  const message = messageInput.value;
  if (message) {
    await sendMessage(message);
    messageInput.value = '';
  }
};

const sendMessage = async (message) => {
  await channel.sendMessage({ text: message });
  const messageData = { uid: rtmUid, name: 'You', text: message };
  messages.value.push(messageData); // Add message to the array
  displayMessage(messageData); // Display own message in UI
};

const handleChannelMessage = async (message, memberId) => {
  const user = await rtmClient.getUserAttributesByKeys(memberId, ['name']);
  const messageData = { uid: memberId, name: user.name, text: message.text };
  messages.value.push(messageData); // Add message to the array
  displayMessage(messageData); // Display received message in UI
  displaySubtitle(message.text);
};

const displayMessage = (messageData) => {
  const messageContainer = document.getElementById('messages');
  const newMessage = document.createElement('div');
  newMessage.style.padding = '6px 20px'; // Adding padding CSS
  newMessage.innerHTML = `<strong>${messageData.name}:</strong> ${messageData.text}`;
  messageContainer.appendChild(newMessage);
};

function generateRoomId() {
    let roomId = Math.floor(Math.random() * 100000);
    console.log("roomId.toString().padStart(5, '0')",roomId.toString().padStart(5, '0'))
    return roomId.toString().padStart(5, '0');
}

onMounted(() => {

  roomIdInput.value = route.query.room ?route.query.room:generateRoomId();
if( route.query.room &&  route.query.name)
{
  console.log("route.query.name",route.query.name)
  displayName.value=route.query.name
  console.log("route.query.name",displayName.value)
isMemberInvite.value=true
 enterRoom()
}
// document.getElementById('send-message-form').addEventListener('submit', sendMessageForm);
console.log("roomIisMemberInvite - ", isMemberInvite.value);
});




onBeforeUnmount(() => {
  // document.getElementById('send-message-form').removeEventListener('submit', sendMessageForm);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color-scheme: dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

h1 {
  font-size: 24px;
}

#room-name {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

#room-name span {
  margin-left: 5px;
}

#messages div {
  padding: 6px 20px;
}

a {
  color: #646cff;
  text-decoration: none;
}

.chat_live {
  margin-top: 150px;
}

.chat_live h1 {
  margin-bottom: 5px;
}

a:hover {
  color: #535bf2;
}

body {
  margin: 0;
}

#container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1em;
}

#room-header {
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
  display: flex;
  /* display: none; */
}

#send-message-form {
  margin-top: 15px;
}

#room-header-controls {
  display: flex;
}

#room-header-controls>img {
  margin: 0 2px;
}

.control-icon {
  background-color: indianred;
  border: none;
  padding: 0.5em;
  /* height: 20px; */
  cursor: pointer;
  border-radius: 5px;
}

.bg-red {
  background-color: indianred;
}

.bg-white {
  background-color: white;
}

#members {
  display: flex;
  flex-wrap: wrap;
}

.speaker {
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-align: center;
}

#avatars {
  display: flex;
  flex-wrap: wrap;
  margin: 1em 0;
}

.avatar-selection {
  height: 50px;
  width: 50px;
  object-fit: contain;
  border: 2px solid #FFF;
  border-radius: 50%;
  opacity: .5;
  cursor: pointer;
  margin: 0.25em;
}

#members .speaker .user-avatar {
  height: 75px;
  width: 75px;
  object-fit: contain;
  border: 2px solid #FFF;
  border-radius: 50%;
}

#form input,
input,
button {
  width: 100%;
  padding: 1em;
  margin-bottom: 2em;
  box-sizing: border-box;
}

#form label {
  margin-bottom: 0.5em;
}

#form-fields {
  display: flex;
  flex-direction: column;
}

.chatget {
  background-color: red;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
}
</style>