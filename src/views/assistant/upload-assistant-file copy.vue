<template>
  <div class="upload">
    <div class="upload__input">
      <div class="upload__input__text">Upload File for Assistant</div>
      <hp-dropzone style="background-color: rgb(128, 128, 128, 0.1)" :isLoading="isLoading" @change="uploadFile"
        accept=".csv,.txt" loadingLabel="File processing" label="Upload a file ">
      </hp-dropzone>
    </div>
    <div class="upload__table" style="max-height: 65vh !important;overflow: scroll;">
      <hp-table :isLoading="isLoading1" :data="filteredTableData" :headers="headers">
        <template v-slot:name="{ row }">
          <div>
            <div class="upload__table__td">
              {{ row.name }}
            </div>
          </div>
        </template>
        <template v-slot:size="{ row }">
          <div>
            <div class="upload__table__td">{{ fileSize(row.size) }} MB</div>
          </div>
        </template>
        <template v-slot:modifiedAt="{ row }">
          <div>
            <div class="upload__table__td">
              {{ formatDate(row.modifiedAt) }}
            </div>
          </div>
        </template>
        <template v-slot:action="{ row }">
          <div class="hp-table__table__body__col__action">
            <hp-icon size="20" @click="deleteConfirm(row)" class="hp-badge__icon" name="delete"></hp-icon>
          </div>
        </template>
      </hp-table>
    </div>
    <hp-modal :isOpen="isConfirmFileRemovalOpen" @close="isConfirmFileRemovalOpen = false">
      <div class="settings__modal">
        <h4 class="settings__card__title">Remove File</h4>
        <p class="settings__card__subtitle">
          This file will lose files for permanently
        </p>
        <div class="settings__modal__actions">
          <hp-button @handleClick="isConfirmFileRemovalOpen = false" label="Cancel"></hp-button>
          <hp-button class="settings__modal__button" destructive :isLoading="isRemovingMember" label="Remove file"
            @handleClick="handleRemoveMember"></hp-button>
        </div>
      </div>
    </hp-modal>
  </div>
</template>
<script setup>
// vendor
import { ref, onMounted, computed } from "vue";
import HpDropzone from "@/components/hp-dropzone.vue";
import HpButton from "@/components/hp-button.vue";
import HpTable from "@/components/hp-table.vue";
import { usePost, useGet, useDelete } from "@/composables/useHttp";
import HpModal from "@/components/hp-modal.vue";
import HpIcon from "@/components/hp-icon.vue";
import useToast from "@/composables/useToast";

const { setToast } = useToast();
//hooks
onMounted(async () => {
  getFiles();
});
// state
const isLoading = ref(false);
const isConfirmFileRemovalOpen = ref(false);
const isLoading1 = ref(false);
const tempDeleteFile = ref(null)

const filteredTableData = ref([

]
);
const headers = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "size",
    label: "Size",
  },
  {
    value: "modifiedAt",
    label: "Updated On",
  },
  {
    value: "action",
    label: "action",
  },
];

//computed
const formatDate = computed(() => {
  return (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleString("en-US", options);
  };
});
const fileSize = computed(() => {
  return (size) => {
    const mbSize = size / (1024 * 1024);
    return mbSize.toFixed(3);
  };
});

// methods
const uploadFile = async (file) => {
  file.value = file;
  if (!file.value) {
    alert("Please select a file.");
    return;
  }
  let formData = new FormData();
  formData.append("file", file.value);

  // You can use Axios or fetch API to make a POST request to your backend
  // Replace 'your-upload-endpoint' with the actual endpoint URL

  // const post = usePost("upload");
  // await post.post(formData);
  // console.log(" postSkill.data.value", post.data.value)

  // fetch("http://localhost:3000/upload", {
  fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Handle the parsed data
      console.log("Data received:", data.json());
    })
    .catch((error) => {
      console.error("Error sending file to external API:", error);
    });
  setToast({
    type: "positive",
    title: "File Uploaded Successful",
  });
  await getFiles()
};
const deleteConfirm = (row) => {
  tempDeleteFile.value = row
  isConfirmFileRemovalOpen.value = true
}
const handleRemoveMember = async () => {
  const deleteFiles = useDelete(`delete-file/${tempDeleteFile.value.name}`);
  await deleteFiles.remove();
  setToast({
    type: "negative",
    title: "File successfully Delete",
  });
  await getFiles()
  tempDeleteFile.value = null
  isConfirmFileRemovalOpen.value = false
};

const getFiles = async () => {
  const { get, data } = useGet(`files`);
  await get();
  console.log("data", data.value.files);
  filteredTableData.value = data.value.files;
};
</script>
<style lang="scss" scoped>
.upload {
  @include pageContainer;
  height: 100vh;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;

  &__table {
    &__td {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__input {
    padding: 2rem 0 2rem 0;
    width: 500px;

    &__text {
      text-align: center;
      margin-bottom: 1rem;
      font-weight: 600;
      @include text-h3;
    }
  }
}
</style>
