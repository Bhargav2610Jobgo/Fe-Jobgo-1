import { createRouter, createWebHistory } from "vue-router";

// Public
import ForgotPassword from "@/views/public/forgot-password.vue";
import NotFound from "@/views/public/not-found.vue";
import Verify from "@/views/public/verify.vue";
import Signin from "@/views/public/signin.vue";
import Signup from "@/views/public/signup.vue";
import ConfirmEmail from "@/views/public/confirm-email.vue";
import CompleteSignup from "@/views/public/Complete-Signup.vue";
import ChatbotTest from "@/views/public/chatbot-test.vue";
import ChatbotTest1 from "@/views/public/chatbot.vue";
import VoiceChatbot from "@/views/public/voicechatbot.vue";
import Presentation from "@/views/public/presentation.vue";
import NewPresentation from "@/views/public/new-presentation.vue";
import UploadFile from "@/views/assistant/upload-assistant-file.vue";
// Reports
import Report from "@/views/public/reports/report.vue";
import Evaluation from "@/views/public/reports/evaluation.vue";

// Private
import Layout from "@/views/dashboard/layout.vue";
import ChangePassword from "@/views/public/change-password.vue";
import Settings from "@/views/dashboard/settings/settings.vue";
import Upgrade from "@/views/dashboard/settings/organization/upgrade.vue";
import Upgraded from "@/views/dashboard/settings/organization/upgraded.vue";
import Organization from "@/views/dashboard/settings/organization/organization.vue";
import CompanyPresentation from "@/views/dashboard/settings/organization/company-presentation.vue";
import JobPresentation from "@/views/dashboard/job-presentation.vue";

//Openings
import Openings from "@/views/dashboard/openings/openings.vue";
import InterviewResults from "@/views/dashboard/openings/interview-results.vue";

//Opening
import Opening from "@/views/dashboard/opening/opening.vue";
import EditOpening from "@/views/dashboard/opening/edit-opening/edit-opening.vue";
import AddInterview from "@/views/dashboard/opening/add-interview.vue";
import EditInterview from "@/views/dashboard/opening/edit-interview.vue";
import Compare from "@/views/dashboard/opening/compare.vue";
import conversationSummary from "@/views/job/conversation-summary.vue";

// Prompt Engineering
import PromptDesign from "@/views/job/prompt-design.vue";

//voice
import voiceMeeting from "@/views/voiceCall/voiceMeeting.vue";
const routes = [
  { path: "/", redirect: "/openings" },
  {
    path: "/",
    component: Layout,
    children: [

      {
        path: "/openings/:openingRef?",
        name: "openings",
        component: Openings,
      },
      // {
      //   path: "/voice",
      //   name: "voice",
      //   component: voiceMeeting,
      //   meta:{
      //     public:true
      //   }
      // },
      {
        path: "/prompt",
        name: "PromptDesign",
        component: PromptDesign,
      },

      {
        path: "/job-presentation/:id",
        name: "JobPresentation",
        component: JobPresentation,
      },
      {
        path: "/company-presentation",
        name: "CompanyPresentation",
        component: CompanyPresentation,
      },
      {
        name: "opening",
        path: "opening/:openingRef",
        component: Opening,
        children: [
          {
            path: "edit",
            name: "edit-opening",
            component: EditOpening,
          },
          {
            path: "edit/add-interview",
            name: "add-interview",
            component: AddInterview,
          },
          {
            path: "edit/edit-interview/:interviewRef",
            name: "edit-interview",
            component: EditInterview,
          },

          {
            path: "results/:templateRef/:evaluationRef",
            name: "interview-results",
            component: InterviewResults,
          },
        ],
      },
      {
        path: "settings",
        name: "settings",
        component: Settings,
      },
      {
        path: "compare",
        name: "compare",
        component: Compare,
        meta: {
          public: true
        }
      },

      {
        path: "organization",
        name: "organization",
        component: Organization,
      },
      {
        path: "upgrade",
        name: "upgrade",
        component: Upgrade,
      },
      {
        path: "upgraded",
        name: "upgraded",
        component: Upgraded,
      },
      {
        path: "/presentation",
        name: "job_presentation",
        component: NewPresentation,

      },
    ],
  },
  {
    path: "/voice",
    name: "voice",
    component: voiceMeeting,
    meta: {
      public: true
    }
  },
  {
    path: "/verify",
    name: "Verify",
    component: Verify,
    meta: {
      public: true,
    },
  },
  {
    path: "/conversation-summary",
    name: "conversationSummary",
    component: conversationSummary,
    meta: {
      public: true
    }
  },
  {
    path: "/openings/upload",
    name: "UploadFile",
    component: UploadFile,
    meta: {
      public: true
    }
  },

  {
    path: "/confirm",
    name: "Confirm",
    component: ConfirmEmail,
    meta: {
      public: true,
    },
  },
  {
    path: "/complete-signup/:userid",
    name: "complete-signup",
    component: CompleteSignup,
    meta: {
      public: true,
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  {
    path: "/signin",
    name: "signin",
    component: Signin,
    meta: {
      public: true,
    },
  },
  {
    path: "/chatbot",
    name: "chatbot",
    component: ChatbotTest,
    meta: {
      public: true,
    },
  },
  {
    path: "/chat",
    name: "chatbot1",
    component: ChatbotTest1,

  },
  {
    path: "/voicechat",
    name: "voicechat",
    component: VoiceChatbot,

  },
  {
    path: "/reports/:candidateKey",
    name: "report",
    component: Report,
    meta: {
      public: true,
    },
  },
  {
    path: "/reports/:candidateKey/evaluations/:evaluationRef",
    name: "evaluation",
    component: Evaluation,
    meta: {
      public: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: {
      public: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: {
      public: true,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: {
      public: true,
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: {
      public: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
