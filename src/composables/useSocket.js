// useSocket.js
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

export default function useSocket(url) {
  let socket = null
  const socketId = ref(null)
  const conversations1 = ref([{
    role: "assistant",
    msg: "Hello! I'm here to assist you in gathering information swiftly for the position you're looking to fill. How can I help you with the details of the job you have in mind?😊",
  }])

  // Connect to the WebSocket server when component is mounted
  onMounted(() => {
    socket = io(import.meta.env.VITE_API_URL, { transports: ["websocket"] });
    console.log("socket on mounted", socket);

    socket.on("connect", () => {
      socketId.value = socket.id
      console.log("socket is connected with id", socket.id);
    });
    socket.on("receive-message", (data) => {
      conversations1.value.push({
        role: "user",
        msg: data,
      });

    });
  });

  // Disconnect from the WebSocket server when component is unmounted
  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  // Function to send a message to the server
  const sendMessage = (message) => {
    const obj = { room: "room-1", message }
    console.log("send message", message);
    if (socket) {
      socket.emit('message', obj);
    }
  };

  // Function to close the WebSocket connection
  const closeConnection = () => {
    if (socket) {
      socket.close();
    }
  };

  // Return the socket object, sendMessage and closeConnection functions
  return {
    socket,
    socketId,
    sendMessage,
    conversations1
    // closeConnection
  };
}
