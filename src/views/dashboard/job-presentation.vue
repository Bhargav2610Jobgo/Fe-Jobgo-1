<template>
  <div class="job-details">
    <div style="display: flex; justify-content: space-between; width: 100%">
      <div placeholder="title" contenteditable="true" class="job-details__name">
        {{ sessionParameter?.jobPosition }}
      </div>
    </div>
    <div style="display: flex">
      <div
        placeholder="experience"
        id="editor"
        contenteditable="true"
        class="job-details__experience"
        style=""
        spellcheck="true"
        data-content-editable-leaf="true"
      >
        {{ sessionParameter?.experience }}
      </div>
      <div
        placeholder="experience"
        id="editor"
        contenteditable="true"
        style=""
        spellcheck="true"
        class="job-details__location"
        data-content-editable-leaf="true"
      >
        {{ sessionParameter?.location }}
      </div>
    </div>
    <div>
      <div
        v-if="showJobDescription"
        placeholder="job description"
        v-html="editorData"
        @click="changeVisibility"
        class="job-details__description"
      ></div>
      <div ref="dropdownTarget" style="margin-top: 2.4rem" v-else>
        <CKEditor
          :editor="ClassicEditor"
          v-model="editorData"
          @input="updateJobDescription"
          :config="editorConfig"
        ></CKEditor>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
// import markdownToeditorData from "markdown-to-editorData";
import { marked } from "marked";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { component as CKEditor } from "@ckeditor/ckeditor5-vue";
import { useRoute } from "vue-router";
import { useGet, usePost } from "@/composables/useHttp";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const editorData = ref("<h1>Content of the editor.</h1>");
const showJobDescription = ref(true);
const dropdownTarget = ref("");
const changeVisibility = () => {
  showJobDescription.value = !showJobDescription.value;
};
const route = useRoute();

onClickOutside(dropdownTarget, async (event) => {
  showJobDescription.value = true;
});
const editorConfig = ref({
  toolbar: ["heading", "bold", "italic", "numberedList"],
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
    ],
  },
});
const markdown = ref(
  "**Job Title:** React.js Developer (Remote)\n" +
    "\n" +
    "**Department:** Software Development\n" +
    "\n" +
    "**Reports To:** Software Development Manager\n" +
    "\n" +
    "**Summary:**\n" +
    "\n" +
    "We are seeking an experienced React.js Developer to join our remote team. The ideal candidate will have a strong understanding of React.js principles and best practices, as well as a passion for building innovative web applications. The successful candidate will work closely with other engineers to design, develop, and maintain React.js applications for our clients.\n" +
    "\n" +
    "**Responsibilities:**\n" +
    "\n" +
    "* Develop React.js applications using best practices and industry standards\n" +
    "* Work with designers and product managers to gather requirements and translate them into technical designs\n" +
    "* Implement React.js components and modules using ES6, JSX, and other modern JavaScript techniques\n" +
    "* Integrate React.js applications with backend services and APIs\n" +
    "* Perform unit testing and debugging of React.js applications\n" +
    "* Collaborate with other engineers to design and implement scalable and maintainable codebases\n" +
    "* FollowAgile development processes and methodologies\n" +
    "* Keep up-to-date on the latest React.js trends and technologies\n" +
    "\n" +
    "**Qualifications:**\n" +
    "\n" +
    "* Minimum 3+ years of experience in software development\n" +
    "* Strong understanding of React.js principles and best practices\n" +
    "* Proficient in ES6, JSX, and other modern JavaScript techniques\n" +
    "* Experience with Flux or Redux state management\n" +
    "* Experience integrating React.js applications with backend services and APIs\n" +
    "* Strong unit testing and debugging skills\n" +
    "* Experience with Agile development processes and methodologies\n" +
    "* Excellent communication and teamwork skills\n" +
    "* Bachelor's or Master's degree in Computer Science, Software Engineering, or related field\n" +
    "\n" +
    "**Benefits:**\n" +
    "\n" +
    "* Competitive salary and benefits package\n" +
    "* Opportunity to work on challenging and innovative projects\n" +
    "* Remote work arrangement with flexible working hours\n" +
    "* Supportive and collaborative work environment\n" +
    "\n" +
    "**To Apply:**\n" +
    "\n" +
    "Please submit your resume and a cover letter highlighting your relevant skills and experience to [email protected]\n" +
    "\n" +
    "**Additional Information:**\n" +
    "\n" +
    "This position is open to candidates located in the United States only.\n" +
    "\n" +
    "We are an equal opportunity employer and value diversity at our company. We do not discriminate on the basis of race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status."
);
const sessionParameter = ref(null);
const getJobPresentation = async () => {
  try {
    const { error, data, get, loading } = useGet(`opening/${route.params.id}`);
    await get();
    const simpleObject = JSON.parse(JSON.stringify(data.value));
    sessionParameter.value = simpleObject;
    // editorData.value=sessionParameter.value.fullDescription
    if (sessionParameter.value?.fullDescription) {
      editorData.value = marked.parse(sessionParameter.value.fullDescription);
    }
    // prompt.value = simpleObject[0].prompt;
    // resetForm({
    //   values: {
    //     prompt: prompt.value,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};
const updateJobDescription = async () => {
  try {
    const jobDetailsName = document.getElementsByClassName("job-details__name");
    const jobDetailsExperience = document.getElementsByClassName(
      "job-details__experience"
    );
    const location = document.getElementsByClassName("job-details__location");
    console.log("jobDetailsName", jobDetailsName[0]?.innerText);
    console.log("jobDetailsExperience", jobDetailsExperience[0]?.innerText);
    console.log("location", jobDetailsExperience[0]?.innerText);
    const putOpening = usePost(`opening`);
    await putOpening.post({
      id: Number(route?.params?.id),
      jobPosition: jobDetailsName[0]?.innerText,
      experience: jobDetailsExperience[0]?.innerText,
      location: location[0]?.innerText,
      salary: sessionParameter.value?.salary,
      education: sessionParameter.value?.education,
      fullDescription: editorData.value,
    });
    await getJobPresentation();
    // await get();
    // console.log("datat.value", data.value);
    // const simpleObject = JSON.parse(JSON.stringify(data.value));
    // sessionParameter.value = simpleObject;
    // // editorData.value=sessionParameter.value.fullDescription
    // editorData.value = marked.parse(sessionParameter.value.fullDescription);
    // // prompt.value = simpleObject[0].prompt;
    // // resetForm({
    // //   values: {
    // //     prompt: prompt.value,
    // //   },
    // // });
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  // editorData.value = markdownToeditorData(markdown.value); // "Some quoted *code*"
  editorData.value = marked.parse(markdown.value);

  getJobPresentation();

  // const jobDetailsDescription = document.getElementsByClassName(
  //   "job-details__description"
  // );
  const jobDetailsName = document.getElementsByClassName("job-details__name");
  const details__experience = document.getElementsByClassName(
    "job-details__experience"
  );
  const details__location = document.getElementsByClassName(
    "job-details__location"
  );

  const debouncedFn = useDebounceFn(() => {
    updateJobDescription();
  }, 1000);
  jobDetailsName[0].addEventListener("input", debouncedFn);
  details__experience[0].addEventListener("input", debouncedFn);
  details__location[0].addEventListener("input", debouncedFn);
});
</script>
<style lang="scss" scoped>
.job-details {
  padding: 4rem;
  // -webkit-user-select: none;
  // -webkit-touch-callout: none;
  // -moz-user-select: none;
  // -ms-user-select: none;
  // user-select: none;
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  // background-color: #f0f0e7;
  min-height: 100vh;
  &__title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    margin: 0;
  }

  input {
    width: 500px !important;
    font-size: 24px;
    font-weight: 600;
    outline: none;
    border: 2px dotted grey;
    line-height: 32px;
    padding-right: 1rem;
    margin: 0;
  }
  &__name {
    cursor: pointer;
    font-size: 24px;
    font-weight: 500;
    border-radius: 5px;
  }
  &__experience {
    font-size: 20px;
    cursor: pointer;
    margin-top: 2rem;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    font-weight: 500;
  }
  &__location {
    font-size: 20px;
    cursor: pointer;
    padding-left: 16px;
    margin-top: 2rem;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    font-weight: 500;
  }
  &__description {
    font-size: 1rem;
    margin-top: 2rem;
    outline: none;
    font-weight: 500;
  }
}
div p:focus {
  background: #fff;
  border-color: #4ae459;
}
:focus {
  outline: none;
  border: none;
}
[contenteditable] {
  // -webkit-tap-highlight-color: transparent;
}
.job-details__name[placeholder]:empty:before {
  content: attr(placeholder);
  color: #555;
}

.ck.ck-content h3.category {
  font-family: "Bebas Neue";
  font-size: 20px;
  font-weight: bold;
  color: #d1d1d1;
  letter-spacing: 10px;
  margin: 0;
  padding: 0;
}

.ck.ck-content p.info-box {
  padding: 1.2em 2em;
  border: 1px solid #e91e63;
  border-left: 10px solid #e91e63;
  border-radius: 5px;
  margin: 1.5em;
}
.ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
  padding: 1rem !important;
}

.ck.ck-content h3.category {
  font-family: "Bebas Neue";
  font-size: 20px;
  font-weight: bold;
  color: #d1d1d1;
  letter-spacing: 10px;
  margin: 0;
  padding: 0;
}

.ck.ck-content p.info-box {
  padding: 1.2em 2em;
  border: 1px solid #e91e63;
  border-left: 10px solid #e91e63;
  border-radius: 5px;
  margin: 1.5em;
}
</style>
