<template>
  <button class="btn btn-info" @click="onPickFile">
    Upload profile picture
  </button>
  <input
    type="file"
    style="display: none"
    ref="fileInput"
    accept="image/*"
    @change="onFilePicked"
  />
</template>

<script setup>
import { ref } from "vue";
const fileInput=ref(null)
const onPickFile= () =>{
  fileInput.value.click()
}
const onFilePicked= (event)=> {
  const files = event.target.files
  let filename = files[0].name
  const fileReader = new FileReader()
  fileReader.addEventListener('load', () => {
    this.imageUrl = fileReader.result
  })
  fileReader.readAsDataURL(files[0])
  this.image = files[0]
}
</script>
