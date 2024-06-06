// src/AgoraRTC.js
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localAudioTrack;
let mediaRecorder;
let recordedAudioData = [];

const options = {
  appId: "0e584dd844274254bfb1f6253a7df133", // Replace with your Agora App ID
  channel: "test", // Replace with your channel name
  token: null, // Replace with your token if you are using token-based authentication
  uid: null, // You can set a user ID or leave it null to auto-generate one
};

export async function joinChannel() {
  await client.join(options.appId, options.channel, options.token, options.uid);

  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await client.publish([localAudioTrack]);
  console.log("Publish success!");

  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    console.log("Subscribe success!");

    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack.play();
    }
  });

  client.on("user-unpublished", (user) => {
    console.log("User unpublished", user);
  });

  // Initialize media recorder
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
}

export async function leaveChannel() {
  // Stop media recorder
  mediaRecorder.stop();

  // Convert recorded audio data to Base64 string
  const recordedData = new Blob(recordedAudioData, { type: 'audio/wav' });
  const reader = new FileReader();
  reader.readAsDataURL(recordedData);
  reader.onloadend = () => {
    const base64Audio = reader.result.split(',')[1];
    console.log("Base64 audio:", base64Audio);
  };

  localAudioTrack.close();
  await client.leave();
  console.log("Client left the channel");
}

export function muteAudio() {
  if (localAudioTrack) {
    localAudioTrack.setEnabled(false);
    console.log("Audio muted");
  }
}

export function unmuteAudio() {
  if (localAudioTrack) {
    localAudioTrack.setEnabled(true);
    console.log("Audio unmuted");
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedAudioData.push(event.data);
  }
}