import HpTable from "../components/hp-table.vue";

export default {
  title: "Components/Table",
  component: HpTable,
  argTypes: {},
};

const Template = (args) => ({
  components: { HpTable },
  setup() {
    const data = [
      {
        name: "Booty Chance Ohallahan",
        score1: 3,
        score2: 2,
        score3: 5,
        score4: 2,
      },
      {
        name: "Shaft Factory Johnson",
        score1: 2,
        score2: 3,
        score3: 5,
        score4: 2,
      },
      {
        name: "Poundtown Mayor O'Keefe",
        score1: 1,
        score2: 4,
        score3: 5,
        score4: 2,
      },
    ];

    const headers = [
      {
        value: "name",
        label: "Name",
      },
      {
        value: "score1",
        label: "Interview #1",
        sortable: true,
      },
      {
        value: "score2",
        label: "Interview #2",
        sortable: true,
      },
      {
        value: "score3",
        label: "Interview #2",
      },
      {
        value: "score4",
        label: "Interview #2",
      },
    ];
    return { args, headers, data };
  },
  template: `<div>
  <div style="margin-bottom:24px">
  <hp-table :data="data" :headers="headers">
    <template v-slot:name="{ row }">
        {{row.name}}
    </template>
  </hp-table>
  </div>
  <div style="margin-bottom:24px">
  <hp-table :data="[]" :headers="headers">
  <template v-slot:name="{ row }">
      {{row.name}}
  </template>
  </hp-table>
  </div>
  <div style="margin-bottom:24px">
  <hp-table :data="data" :headers="headers" isLoading="true">
    <template v-slot:name="{ row }">
        {{row.name}}
    </template>
  </hp-table>
  </div>
  </div>`,
});

export const Primary = Template.bind({});
Primary.args = {};
