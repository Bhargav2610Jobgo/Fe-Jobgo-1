import HpCandidateCard from "../components/cards/hp-candidate-card.vue";
import vueRouter from "storybook-vue3-router";

export default {
  title: "Components/Candidate Card",
  component: HpCandidateCard,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpCandidateCard },
  setup() {
    const data = [
      {
        reference: "8oe2enbx",
        name: "dfghjkl",
        email: "test@test.com",
        opening: {
          reference: "jgu6fagb",
          name: "Lead Designer",
          description:
            "Lead Designer include research and analysis, overseeing a variety of design projects.",
          artwork: 0,
          jobLevel: null,
          templates: [
            {
              reference: "2o4wm5vw",
              name: "Welcome Interview",
              interview: {
                token: "da76c0d1-d901-4d32-8d49-c5559c6c9c38",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 5, duration: 3608, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "qon957d9",
              name: "Technical assessment",
              interview: {
                token: "5d524750-b129-4c55-b727-08b2f34e3bfb",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "pcvn5br3",
              name: "Social Skill Assessment",
              interview: {
                token: "0f4eab4d-3a95-4d63-82df-60c5c3c849ae",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
          ],
          state: "active",
          statistics: {
            completedInterviews: 0,
            averageScore: null,
            averageSkillScores: [],
          },
          author: {
            reference: "nrvg1shn",
            email: "nick@hireproof.io",
            name: "Nick",
            organization: { slug: "hireproof", name: "Hireproof" },
          },
        },
        created: "2022-01-24T14:40:07.917937Z",
        state: "active",
      },
      {
        reference: "akix11g9",
        name: "Lego Logic",
        email: "legologic@gmail.com",
        opening: {
          reference: "jgu6fagb",
          name: "Lead Designer",
          description:
            "Lead Designer include research and analysis, overseeing a variety of design projects.",
          artwork: 0,
          jobLevel: null,
          templates: [
            {
              reference: "2o4wm5vw",
              name: "Welcome Interview",
              interview: {
                token: "5aeec93f-c234-4baa-add5-ba13a668dd4d",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 5, duration: 3608, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "qon957d9",
              name: "Technical assessment",
              interview: {
                token: "9884ddb9-7e81-4bb7-9459-14082dd9adac",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "pcvn5br3",
              name: "Social Skill Assessment",
              interview: {
                token: "883ce847-5134-4f69-8700-2fb1219585c0",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
          ],
          state: "active",
          statistics: {
            completedInterviews: 0,
            averageScore: null,
            averageSkillScores: [],
          },
          author: {
            reference: "nrvg1shn",
            email: "nick@hireproof.io",
            name: "Nick",
            organization: { slug: "hireproof", name: "Hireproof" },
          },
        },
        created: "2022-01-20T15:14:57.174978Z",
        state: "active",
      },
      {
        reference: "qcg5auii",
        name: "MR BUGGY STATS",
        email: "gentlemanjaka@gmail.com",
        opening: {
          reference: "jgu6fagb",
          name: "Lead Designer",
          description:
            "Lead Designer include research and analysis, overseeing a variety of design projects.",
          artwork: 0,
          jobLevel: null,
          templates: [
            {
              reference: "2o4wm5vw",
              name: "Welcome Interview",
              interview: {
                token: "fdd59267-662f-4d8f-abf6-126b29a63ae4",
                interviewer: null,
                started: "2022-01-18T11:54:45.549181Z",
                terminated: "2022-01-18T12:02:15.047920Z",
              },
              statistics: { questions: 5, duration: 3608, score: 3.5 },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "qon957d9",
              name: "Technical assessment",
              interview: {
                token: "f5ff2b2e-3a42-4517-979b-b62cef7203f2",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "pcvn5br3",
              name: "Social Skill Assessment",
              interview: {
                token: "d946c89d-51cd-4d6f-bde7-e4c3398a207b",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
          ],
          state: "active",
          statistics: {
            completedInterviews: 1,
            averageScore: 3.5,
            averageSkillScores: [
              {
                skill: {
                  slug: "design-management",
                  name: "Design Management",
                },
                score: { quantity: 1, value: 5.0 },
              },
              {
                skill: {
                  slug: "2d-gel-analysis-software",
                  name: "2D Gel Analysis Software",
                },
                score: { quantity: 1, value: 4.0 },
              },
              {
                skill: { slug: "10base2", name: "10BASE2" },
                score: { quantity: 1, value: 4.0 },
              },
              {
                skill: {
                  slug: "figma-design-software",
                  name: "Figma (Design Software)",
                },
                score: { quantity: 1, value: 3.0 },
              },
              {
                skill: { slug: "product-design", name: "Product Design" },
                score: { quantity: 1, value: 3.0 },
              },
              {
                skill: { slug: "branding", name: "Branding" },
                score: { quantity: 1, value: 2.0 },
              },
              {
                skill: { slug: "typography", name: "Typography" },
                score: { quantity: 1, value: 2.0 },
              },
              {
                skill: { slug: "logo-design", name: "Logo Design" },
                score: { quantity: 1, value: 2.0 },
              },
            ],
          },
          author: {
            reference: "nrvg1shn",
            email: "nick@hireproof.io",
            name: "Nick",
            organization: { slug: "hireproof", name: "Hireproof" },
          },
        },
        created: "2022-01-18T09:13:29.474423Z",
        state: "active",
      },
      {
        reference: "45q8yu9n",
        name: "Allo Millo",
        email: "allo.millo@gmail.com",
        opening: {
          reference: "jgu6fagb",
          name: "Lead Designer",
          description:
            "Lead Designer include research and analysis, overseeing a variety of design projects.",
          artwork: 0,
          jobLevel: null,
          templates: [
            {
              reference: "2o4wm5vw",
              name: "Welcome Interview",
              interview: {
                token: "60f910fa-bd30-4b08-bd52-6d096ad0cfa5",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 5, duration: 3608, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "qon957d9",
              name: "Technical assessment",
              interview: {
                token: "d97faeec-476c-4472-8956-d73ab3e25c5e",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
            {
              reference: "pcvn5br3",
              name: "Social Skill Assessment",
              interview: {
                token: "666f5495-5c97-453b-8768-8cecc8fa26d3",
                interviewer: null,
                started: null,
                terminated: null,
              },
              statistics: { questions: 0, duration: 600, score: null },
              author: {
                reference: "nrvg1shn",
                email: "nick@hireproof.io",
                name: "Nick",
                organization: { slug: "hireproof", name: "Hireproof" },
              },
            },
          ],
          state: "active",
          statistics: {
            completedInterviews: 0,
            averageScore: null,
            averageSkillScores: [],
          },
          author: {
            reference: "nrvg1shn",
            email: "nick@hireproof.io",
            name: "Nick",
            organization: { slug: "hireproof", name: "Hireproof" },
          },
        },
        created: "2022-01-18T09:12:57.721909Z",
        state: "active",
      },
    ];
    return { args, data };
  },
  template: `<div style="display: flex">
        <hp-candidate-card v-for="candidate in data" :candidate="candidate" style="width: 236px; margin-right:24px" v-bind="args">
        </hp-candidate-card>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
Primary.decorators = [vueRouter()];
