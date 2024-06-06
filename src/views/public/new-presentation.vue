<template>

  <template v-if="!presentationLoading">
    <div v-if="showReviewNote" class="alert" style="">

      <SmileEmoji class="alert__icon" style="margin-right: 1rem;" />Please review and edit your profiling page. Once
      approved, you’ll
      receive a link of the professional multimedia job page with the next steps for matching you with the best
      candidates.
      <close @click="showReviewNote = false" style="cursor: pointer;    cursor: pointer;
    display: block;
    margin: auto;
}" />

    </div>
    <div class="container" style="background-color: white">
      <div class="presentation">
        <div class="presentation_column">
          <div class="presentation_container">
            <div class="presentation_container_title" v-if="state?.organization.name"> {{ state?.organization.name }}
            </div>
            <div class="presentation_container_title_company">
              {{ dataVal.position }}
            </div>
          </div>

          <div class="company-description">
            <div class="company-description_container">
              <h4>who we are?</h4>
            </div>

            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.companyDescription }" v-if="state?.organization"
              :contentEditable="contentEditable.companyDescription" class="grey-text">
              {{ JSON.parse(state?.organization.info)?.longDescription }}
            </div>
          </div>
          <div class="company-description">
            <div class="company-description_container">
              <h4>Take your career into top gear</h4>
              <div class="flex-center pointer" @click="editContent('job-description')">
                <EditPencil v-if="!contentEditable.jobDescription" />
                <Save v-else />
                <span class="secondary-color description">{{
                  !contentEditable.jobDescription ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.jobDescription }"
              :contentEditable="contentEditable.jobDescription" class="grey-text job-description">
              {{ dataVal.description }}
            </div>
          </div>
          <div class="company-description">
            <div class="company-description_container">
              <h4>Key Responsibilites</h4>
              <div class="flex-center pointer" @click="editContent('key-responsabilities')">
                <EditPencil v-if="!contentEditable.keyResponsabilities" />
                <Save v-else />
                <span class="secondary-color ">{{
                  !contentEditable.keyResponsabilities ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.keyResponsabilities }"
              :contentEditable="contentEditable.keyResponsabilities" class="grey-text">
              <ul class="responsibilities content_editable_true">
                <li v-for="(item, index) of dataVal.key_responsibilities" :index="index"
                  style="display: flex; margin-bottom: 10px">
                  <div style="width: 16px">
                    <ArrowRight />
                  </div>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div class="company-description">
            <div class="company-description_container">
              <h4>Skill and Qualification</h4>
              <div class="flex-center pointer" @click="editContent('skill-qualification')">
                <EditPencil v-if="!contentEditable.skilQualification" />
                <Save v-else />
                <span class="secondary-color skill_qualification">{{
                  !contentEditable.skilQualification ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.skilQualification }"
              :contentEditable="contentEditable.skilQualification" class="grey-text">
              <ul class="skill-qualification content_editable_true">
                <li v-for="(skill, index) of dataVal.skill_qualification" :index="index"
                  style="display: flex; margin-bottom: 10px">
                  <div style="width: 16px">
                    <ArrowRight />
                  </div>
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>
          <div class="company-description">
            <div class="company-description_container">
              <h4>What we offer</h4>
              <div class="flex-center pointer" @click="editContent('what-we-offer')">
                <EditPencil v-if="!contentEditable.what_we_offer" />
                <Save v-else />
                <span class="secondary-color">{{
                  !contentEditable.what_we_offer ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.what_we_offer }" :contentEditable="contentEditable.what_we_offer"
              class="grey-text what_we_offer content_editable_true">
              {{ dataVal.what_we_offer }}
            </div>
          </div>
          <div>
          </div>



          <div class="company-description">
            <div class="company-description_container">
              <h4>Pre screening questions</h4>
              <div class="flex-center pointer" @click="editContent('pre-screening-question')">
                <EditPencil v-if="!contentEditable.pre_screening_question" />
                <Save v-else />
                <span class="secondary-color">{{
                  !contentEditable.pre_screening_question ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.pre_screening_question }" class="grey-text"
              :contentEditable="contentEditable.pre_screening_question">
              <ul class=" content_editable_true pre-screening-question">
                <li v-for="(quesion, index) of dataVal.pre_screeing_question" :index="index"
                  style="display: flex; margin-bottom: 10px">
                  <div style="width: 16px">
                    <ArrowRight />
                  </div>
                  {{ quesion }}
                </li>
              </ul>
            </div>
          </div>

          <div class="company-description" v-if="fileSummaryItems">
            <div class="company-description_container">
              <h4>Uploaded Transcript File Summary</h4>
              <div class="flex-center pointer" @click="editContent('transmitFileSummary-question')">
                <EditPencil v-if="!contentEditable.transmitFileSummary_question" />
                <Save v-else />
                <span class="secondary-color">{{
                  !contentEditable.transmitFileSummary_question ? "Edit" : "Save"
                }}</span>
              </div>
            </div>
            <div class="blue-line"></div>
            <div :class="{ 'border-2': contentEditable.transmitFileSummary_question }"
              class="grey-text transmitFileSummary-question"
              :contentEditable="contentEditable.transmitFileSummary_question">
              {{ fileSummaryItems }}
              <!-- <ul class="content_editable_true transmitFileSummary-question">
                <li v-for="item in fileSummaryItems" :key="item.id" style="display: flex; margin-bottom: 10px">
                  <div style="width: 16px">
                    <ArrowRight />
                  </div>
                  {{ item.text }}
                </li>
              </ul> -->
            </div>
          </div>

          <!-- <button @click="approveContent" class="job__container_button" style="width: 100%;">Approve</button> -->
        </div>

        <div class="job">
          <div class="job__overview">
            <div>Job Overview</div>
          </div>
          <div class="job__container">

            <img class="job_company_logo" v-if="JSON.parse(state?.organization.info)?.logos?.[0]?.formats?.[0]?.src"
              :src="JSON.parse(state?.organization?.info)?.logos?.[0]?.formats?.[0]?.src" alt="" />
            <div class="job__container__details">
              <div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <PostionIcon />

                  </div>
                  <div>
                    <div class="job__container__details__title">Position </div>
                    <div class="border-4 job__container__details__subtitle position" style="
">{{ dataVal.position }}</div>
                  </div>
                </div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <Star />

                  </div>
                  <div>
                    <div class="job__container__details__title">Experience </div>
                    <div :class="[contentEditable.jobOverview ? 'border-2' : '']"
                      class="job__container__details__subtitle experience"
                      :contentEditable="contentEditable.jobOverview" style="
">{{ dataVal.experience }}</div>
                  </div>
                </div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <Salary />

                  </div>
                  <div>
                    <div class="job__container__details__title">Salary </div>
                    <div :class="[contentEditable.jobOverview ? 'border-2' : '']"
                      class="job__container__details__subtitle salary" :contentEditable="contentEditable.jobOverview"
                      style="
">{{ dataVal.salary }}</div>
                  </div>
                </div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <Industry />

                  </div>
                  <div v-if="JSON.parse(state?.organization?.info)?.company?.industries?.[0]?.name">
                    <div class="job__container__details__title">Industry </div>
                    <div :class="[contentEditable.jobOverview ? 'border-2' : '']"
                      class="job__container__details__subtitle" :contentEditable="contentEditable.jobOverview" style="
">
                      {{
                        JSON.parse(state?.organization.info).company?.industries[0].name
                      }}</div>
                  </div>
                </div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <Hyrbird />

                  </div>
                  <div>
                    <div class="job__container__details__title">Location </div>
                    <div :class="[contentEditable.jobOverview ? 'border-2' : '']"
                      class="job__container__details__subtitle location" :contentEditable="contentEditable.jobOverview"
                      style="
">{{ dataVal.location }}</div>
                  </div>
                </div>
                <div style="display: flex;margin:1.2rem 0">
                  <div style="width:16;height: 16px;margin-right: 10px;">
                    <LastEdit />

                  </div>
                  <div>
                    <div class="job__container__details__title last-edit">Last Edit </div>
                    <div :class="[contentEditable.jobOverview ? 'border-2' : '']"
                      class="job__container__details__subtitle" :contentEditable="contentEditable.jobOverview" style="
">{{ dataVal.last_edit }}</div>
                  </div>
                </div>

              </div>

            </div>

            <button @click="editContent('job-overview')" class="job__container_button">{{ !contentEditable.jobOverview ?
              "Edit" : "Save" }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="openings_spinner">
      <hp-spinner class="hp-button__button__spinner" :size="50" mode="dark"></hp-spinner>
    </div>
  </template>
</template>
<script setup>
//vendor
import { ref, onMounted } from "vue";
import { useGet, usePut } from "@/composables/useHttp";
import { useRoute } from "vue-router";
import EditPencil from "@/assets/icons/edit-pencil.svg";
import Save from "@/assets/icons/save.svg";
import ArrowRight from "@/assets/icons/Path.svg";
import SmileEmoji from "@/assets/icons/smile-emoji.svg";
import PostionIcon from "@/assets/icons/postion-icon.svg";
import StarIcon from "@/assets/icons/star1.svg";
import Salary from "@/assets/icons/Salary.svg";
import Industry from "@/assets/icons/Industry.svg";
import LastEdit from "@/assets/icons/last-visited.svg";
import Star from "@/assets/icons/star.svg";
import Hyrbird from "@/assets/icons/hybrid.svg";
import close from "@/assets/icons/close.svg";
import HpSpinner from "@/components/hp-spinner.vue";
import VueMarkdown from 'vue-markdown-render';
import { state } from "@/composables/useAuth";

//state
const presentationLoading = ref(false)
const contentEditable = ref({
  companyDescription: false,
  jobDescription: false,
  keyResponsabilities: false,
  skilQualification: false,
  what_we_offer: false,
  pre_screening_question: false,
  jobOverview: false,
  transmitFileSummary_question: false,
});
const fileSummaryItems = ref(null);
const companyInfo = ref(null)
const showReviewNote = ref(true)
const jobOveriew = ref([{
  title: "Position",
  subTitle: "Position",
}, {
  title: "Experience",
  subTitle: "+4 years Experience",
}, {
  title: "Salary",
  subTitle: "6000 $",
}, {
  title: "Company Industry",
  subTitle: "Software development ",
}, {
  title: "Hyrbird",
  subTitle: "Korkeavourenkatu 2f, 00140, Helsinki",
}, {
  title: "Last Edit",
  subTitle: "10  days ago",
}])
const dataVal = ref({
  description: ` We are looking for a Lead UI Designer to join our team. The location can be set either in our
                        Tampere or
                        Helsinki office. Purpose of the role Main role is to create user interfaces based on the (UX)
                        wireframes
                        Validation of user experience (UX) wireframes Make sure that 3 Step IT’s web services have
                        uniform
                        feeling / look-a-like Main accountabilities & tasks To design user interfaces
                        We are looking for a Lead UI Designer to join our team. The location can be set either in our
                        Tampere or
                        Helsinki office. Purpose of the role Main role is to create user interfaces based on the (UX)
                        wireframes
                        Validation of user experience (UX) wireframes Make sure that 3 Step IT’s web services have
                        uniform
                        feeling / look-a-like Main accountabilities & tasks To design user interfaces`,
  responsibilities: `     We are looking for a Lead UI Designer to join our team. The location can be set either in our
                        Tampere or Helsinki office. Purpose of the role Main role is to create user interfaces based on
                        the (UX) wireframes Validation of user experience (UX) wireframes.

                        We are looking for a Lead UI Designer to join our team. The location can be set either in our
                        Tampere or
                        Helsinki office. Purpose of the role Main role is to create user interfaces based on the (UX)
                        wireframes
                        Validation of user experience (UX) wireframes Make sure that 3 Step IT’s web services have
                        uniform
                        feeling / look-a-like Main accountabilities & tasks To design user interfaces
                        We are looking for a Lead UI Designer to join our team. The location can be set either in our
                        Tampere or
                        Helsinki office. Purpose of the role Main role is to create user interfaces based on the (UX)
                        wireframes
                        Validation of user experience (UX) wireframes Make sure that 3 Step IT’s web services have
                        uniform
                        feeling / look-a-like Main accountabilities & tasks To design user interfaces`,
  education: "Bachelor's degree in Computer Science",
  qualification: `    We are looking for a Lead UI Designer to join our team. The location
            can be set either in our Tampere or Helsinki office. Purpose of the
            role Main role is to create user interfaces based on the (UX)
            wireframes Validation of user experience (UX) wireframes Make sure
            that 3 Step IT’s web services have uniform feeling / look-a-like
            Main accountabilities & tasks To design user interfaces We are
            looking for a Lead UI Designer to join our team. The location can be
            set either in our Tampere or Helsinki office. Purpose of the role
            Main role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces We are looking
            for a Lead UI Designer to join our team. The location can be set
            either in our Tampere or Helsinki office. Purpose of the role Main
            role is to create user interfaces based on the (UX) wireframes
            Validation of user experience (UX) wireframes Make sure that 3 Step
            IT’s web services have uniform feeling / look-a-like Main
            accountabilities & tasks To design user interfaces`,
  how_to_apply: `Praesent sapien massa, convallis a pellentesque nec, egestas non
            nisi. Curabitur aliquet quam id dui posuere blandit. Curabitur
            aliquet quam id dui posuere blandit. Curabitur non nulla sit amet
            nisl tempus convallis quis ac lectus navid.nosrati@jobgo.com.`,
  experience: "2+ Years Exprience",
  salary: "4500 €",
  position: "Lead UX/UI Designer",
  last_edit: "2 Days Ago",
  company_industry: "Computer Application",
  location: "Korkeavourenkatu 2f, 00140, Helsinki",
  key_responsibilities: [
    "Designing and implementing user-friendly and responsive UI components using Vue.js framework.",
    "Ensuring the UI/UX designs are faithfully implemented and optimized for performance.",
    "Utilizing Vuex for managing application state, including data persistence, sharing state across components, and handling complex state transitions.",
    "Integrating Vue.js applications with backend APIs or services using technologies like Axios or Fetch for data retrieval and manipulation.",
    "Implementing client-side routing using Vue Router to create a seamless, single-page application (SPA) experience."],
  skill_qualification: [
    "Java",
    "Python",
    "C++",
    "SQL",
    "API Development"
  ],
  what_we_offer: "At our organization, we provide an array of benefits aimed at fostering a fulfilling work experience. These include comprehensive health insurance coverage to ensure the well-being of our employees. Additionally, we offer unlimited coffee to keep our team energized and motivated throughout the day. ",
  pre_screeing_question: [
    "What is your motivation for this position?",
    "What is your salary expectation?",
    "What is your notice period?",
    "What programming languages are you proficient in?",
    "Have you worked with any specific backend frameworks or technologies?"
  ]
});
const route = useRoute();
//hooks
onMounted(async () => {
  await getJobProfile()
  // await getCompanyInfo()
  fetchFileSummary();

});
//methods

const fetchFileSummary = () => {
  // Fetch file summary items from localStorage or API
  // const fileSummary = '';
  const fileSummary = window.localStorage.getItem('File_Summary');
  console.log("fileSummary- ", fileSummary);
  if (fileSummary) {
    // fileSummaryItems.value ='ABCsd'
    fileSummaryItems.value = fileSummary
    // fileSummaryItems.value = fileSummary.split(',').map((text, index) => ({ id: index, text }));

    console.log("fileSummaryItems:-aaaa", fileSummary);
  }
};

const getCompanyInfo = async () => {
  try {

    const response = await fetch(`https://api.brandfetch.io/v2/brands/dowjones.com`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + '2pDrAAJLOmYKWfnkhbzsBnW4f0wBZyK307ruOFiNb4Y=',
      },

    });
    const data = await response.json(); // or response.text() for non-JSON responses
    // Work with the JSON data
    companyInfo.value = data
    console.log(data);
  } catch (error) {
    console.log("error", error)
  }
}
const editContent1 = () => {

  let responsibilities = []
  let skill_qualification = []
  let what_we_offer = []
  let preScreeningQuestion = []
  let transmiltFileQuestion = []

  var editableElements = document.querySelectorAll('.content_editable_true');
  editableElements.forEach(function (element, index) {
    // Access each editable element here
    // For example, you can get its text content
    if (element.classList.contains('responsibilities')) {
      const liElements = element.getElementsByTagName('li')
      for (let i = 0; i < liElements.length; i++) {
        // Push the text content of the current <li> element into the array
        responsibilities.push(liElements[i].textContent);
      }
    } else if (element.classList.contains('skill-qualification')) {
      let liElements = element.getElementsByTagName('li')
      for (let i = 0; i < liElements.length; i++) {
        // Push the text content of the current <li> element into the array
        skill_qualification.push(liElements[i].textContent);
      }
    }
    else if (element.classList.contains('pre-screening-question')) {
      let liElements = element.getElementsByTagName('li')
      for (let i = 0; i < liElements.length; i++) {
        // Push the text content of the current <li> element into the array
        preScreeningQuestion.push(liElements[i].textContent);
      }
    }
    // else if (element.classList.contains('transmitFileSummary-question')) {
    //   let liElements = element.getElementsByTagName('li')
    //   for (let i = 0; i < liElements.length; i++) {
    //     transmiltFileQuestion.push(liElements[i].textContent);
    //   }
    //   // window.localStorage.setItem('File_Summary', transmiltFileQuestion.join());
    // }


  });
  return { responsibilities, skill_qualification, what_we_offer, preScreeningQuestion }
}

const getJobProfile = (async () => {
  const id = route.query?.jobId;
  if (id) {
    const { data, get } = useGet(`self/profile/${id}`);
    presentationLoading.value = true
    await get();
    dataVal.value.description = data.value?.fullDescription;
    dataVal.value.qualification = data.value?.qualification;
    dataVal.value.experience = data.value?.experience;
    dataVal.value.salary = data.value?.salary;
    dataVal.value.pre_screeing_question = data.value?.preScreeningQuestion;
    dataVal.value.what_we_offer = data.value?.whatWeOffer;
    dataVal.value.skill_qualification = data.value?.skillAndQualification;
    dataVal.value.key_responsibilities = data.value?.keyResponsibility;
    dataVal.value.position = data.value?.jobPosition;
    dataVal.value.location = data.value?.location;
    dataVal.value.education = data.value?.education;
    presentationLoading.value = false
  }
})
const editContent = async (section) => {
  const { responsibilities, skill_qualification, what_we_offer, preScreeningQuestion } = editContent1()
  const putOpening = usePut(`update/profile`);
  await putOpening.put({
    id: Number(route.query?.jobId),
    jobPosition: document.querySelector(".position").textContent,
    experience: document.querySelector(".experience").textContent,
    location: document.querySelector(".location").textContent,
    salary: document.querySelector(".salary").textContent,
    fullDescription: document.querySelector(".job-description").textContent,
    keyResponsibility: responsibilities,
    skillAndQualification: skill_qualification,
    whatWeOffer: document.querySelector(".what_we_offer").textContent,
    preScreeningQuestion: preScreeningQuestion
  });

  const sectionMap = {
    "company-description": "companyDescription",
    "job-description": "jobDescription",
    "key-responsabilities": "keyResponsabilities",
    "job-overview": "jobOverview",
    "skill-qualification": "skilQualification",
    "what-we-offer": "what_we_offer",
    "pre-screening-question": "pre_screening_question",
    "transmitFileSummary-question": "transmitFileSummary_question"
  };
  console.log(section)
  if (sectionMap.hasOwnProperty(section)) {
    contentEditable.value[sectionMap[section]] = !contentEditable.value[sectionMap[section]];
  }


  console.log("section l0 ", section);
  if (section == 'transmitFileSummary-question') {
    console.log("aaa :- ", document.querySelector(".transmitFileSummary-question").textContent);
    window.localStorage.setItem('File_Summary', document.querySelector(".transmitFileSummary-question").textContent);
  }
};
const approveContent = () => {
  console.log("approveContent")
}
</script>
<style lang="scss" scoped>
.presentation {
  color: black;
  background-color: white;
  padding: 2rem 0 0 0;
  margin: auto;
  width: 80%;
  display: flex;
  justify-content: space-between;

  &_column {
    width: 60%;

    &__title {
      color: #2c3547;
      margin-top: 1rem;
    }
  }
}

.presentation_container {
  &_title {
    font-family: Roboto;
    font-size: 32px;
    color: #1184d6;
    font-weight: 500;
    letter-spacing: 0.6285715103149414px;
    text-align: left;

    &_company {
      font-family: Roboto;
      font-size: 20px;
      // margin: 12px 0;
      font-weight: 500;
      line-height: 23.44px;
      letter-spacing: 0.6285715103149414px;
      text-align: left;
    }
  }


}

.company-description {
  margin-top: 2rem;
  margin-bottom: 2rem;

  &_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h4 {
    color: #2C3547;
    font-family: Roboto;
    font-size: 20px;
    font-weight: 600;
    line-height: 23.44px;
    letter-spacing: 0.6285715103149414px;
    text-align: left;
  }
}

.blue-line {
  width: 40px;
  height: 1px;
  margin: 1.5rem 0;
  background-color: #1184d6;
}

.secondary-color {
  color: #1184d6;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-description {
  [contenteditable] {
    border-radius: 1rem;

    outline: 1px solid transparent;
    border: 1px solid transparent;
    // border: 0px solid #0000003B
  }
}

.job {
  [contenteditable] {
    border-radius: 1rem;
    padding: 0.5rem !important;
    outline: 1px solid transparent;
    border: 1px solid transparent;
    // border: 0px solid #0000003B
  }
}

.border-4 {

  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: left;
  padding: 1rem;
}

.border-2 {
  outline: 1px solid rgb(206, 206, 206, 0.7);
  border: 1px solid rgb(188, 188, 188, 0.7);
  background-color: #F5F5F5;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: left;
  padding: 1rem;
}

.job {
  &_company_logo {
    width: 160.37px;
    height: 159px;
    top: 101px;
    left: 114px;
    gap: 0px;
    opacity: 0px;
    display: block;
    margin: 0 auto;
  }

  &__container {
    border-left: 1px solid rgb(212, 212, 212);
    border-right: 1px solid rgb(212, 212, 212);
    border-bottom: 1px solid rgb(212, 212, 212);

    &_button {
      background-color: #1184d6;
      color: white;
      padding: 1rem 2rem;
      width: 322.75px;
      opacity: 0px;
      background: rgba(29, 174, 255, 1);
      border: none;
      margin: 1rem auto;
      border-radius: 0.5rem;
      display: block;
    }

    &__details {
      border-top: 1px solid rgb(212, 212, 212);
      padding: 1.5rem;

      &__title {
        font-family: Roboto;
        font-size: 16px;
        font-weight: 700;
        line-height: 18.75px;
        letter-spacing: 0.10181818157434464px;
        text-align: left;
        color: rgba(44, 53, 71, 1);
        margin-top: 2px;
      }

      &__subtitle {
        font-family: Roboto;

        font-size: 16px;
        font-weight: 400;
        line-height: 18.75px;
        letter-spacing: 0.10181818157434464px;
        text-align: left;
        color: rgba(121, 121, 121, 1);
        width: 300.3px;
        margin-top: 4px
      }
    }

  }

  &__overview {
    width: 387.3px;
    height: 53px;
    gap: 0px;
    opacity: 0px;
    background-color: #1184d6;
    color: white;

    div {
      padding: 15px;
    }
  }
}

button {
  cursor: pointer;
}

.grey-text {
  color: #797979;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.440000057220459px;
  text-align: left;

}

.alert {
  background: #02223B;
  color: white;
  padding: 1rem 5rem;
  width: 100vw;
  background-color: white;
  position: fixed;
  top: 80px;
  display: flex;
  align-items: center;
  z-index: 1000;
}

@media screen and (max-width: 1280px) {

  /* Add styles specific to screens 1028px and above here */
  /* For example: */
  .presentation {
    display: flex;
    flex-direction: column-reverse;

    &_column {
      width: 100%;
    }
  }

  .job__container_button {
    width: 100%;
    padding: 0.5rem 1rem;
  }

  .job {
    &__conatiner {
      &_button {}
    }

    &__overview {
      width: 100%;
    }
  }

  .alert {
    background: #02223B;
    font-size: 0.5rem;

    color: white;
    padding: 1rem 1rem;
    width: 100vw;
    display: flex;
    align-items: center;

    &__icon {
      display: none
    }
  }

}

.alert {
  background: #02223B;
  color: white;
  padding: 1rem 5rem;
  width: 100vw;
  display: flex;
  align-items: center;

}


.openings_spinner {
  width: 100vw;
  height: calc(100vh - 90px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
