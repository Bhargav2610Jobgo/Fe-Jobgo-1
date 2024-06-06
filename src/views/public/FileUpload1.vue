<template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".pdf,.docx">
    <button @click="summarizeDiscussion">Summarize Discussion</button>
    <div v-if="summary">{{ summary }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';

const fileContent = ref('');
const summary = ref('');
const apiKey = import.meta.env.File_Upload;
const prompt = 'Summarize the discussion in the transcript:';

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    fileContent.value = e.target.result;
  };
  reader.readAsText(file);
};

console.log("fileContent: - ", fileContent);

const summarizeDiscussion = async () => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: 'User: ' + prompt + `DSU (2024-04-02 13:55 GMT+5:30) - Transcript
Attendees
Bhargav Patel, Mohd Uvesh, Vaibhav Pandey
Transcript
This editable transcript was computer generated and might contain errors. People can also change the text after it was created.
Mohd Uvesh: We support karega.
Bhargav Patel: I think I'm just
Mohd Uvesh: DS
Bhargav Patel: when it
Bhargav Patel: is
Vaibhav Pandey: dialogue metal photographer
Mohd Uvesh: possibly the most autom
Mohd Uvesh: ation
Mohd Uvesh: today
Vaibhav Pandey: take okay.
`
        }
      ],
      max_tokens: 150
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    summary.value = response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing discussion:', error);
  }
};
</script>





<!-- <template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".pdf">
    <input type="text" v-model="prompt" placeholder="Enter your prompt">
    <button @click="summarizeDiscussion">Summarize Discussion</button>
    <div v-if="summary">{{ summary }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';

const fileContent = ref('');
const summary = ref('');
let prompt = '';

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await extractTextFromPDF(file);
    fileContent.value = text;
  } catch (error) {
    console.error('Error reading file:', error);
  }
};

const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target.result;
      const typedArray = new Uint8Array(buffer);
      window.PDFJS.getDocument(typedArray).then((pdf) => {
        const numPages = pdf.numPages;
        let textContent = '';
        for (let i = 1; i <= numPages; i++) {
          pdf.getPage(i).then((page) => {
            page.getTextContent().then((content) => {
              content.items.forEach((item) => {
                textContent += item.str + '\n';
              });
            });
          });
        }
        resolve(textContent);
      }).catch((error) => {
        reject(error);
      });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

const summarizeDiscussion = async () => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'user',
          content: prompt
        },
        {
          role: 'system',
          content: `DSU (2024-04-02 13:55 GMT+5:30) - Transcript
Attendees
Bhargav Patel, Mohd Uvesh, Vaibhav Pandey
Transcript
This editable transcript was computer generated and might contain errors. People can also change the text after it was created.
Mohd Uvesh: We support karega.
Bhargav Patel: I think I'm just
Mohd Uvesh: DS
Bhargav Patel: when it
Bhargav Patel: is
Vaibhav Pandey: dialogue metal photographer
Mohd Uvesh: possibly the most autom
Mohd Uvesh: ation
Mohd Uvesh: today
Vaibhav Pandey: take okay.
`
        }
      ],
      max_tokens: 150
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    summary.value = response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing discussion:', error);
  }
};
</script> -->