import { ref } from "vue";
import { useGet } from "./useHttp";
import useAuth from "./useAuth";

const { organization } = useAuth();

const members = ref([]);

const COLLABORATORS = {
  creator: {
    label: "Creator",
    description: "Administrator of the opening",
    hierarchy: 1,
  },
  owner: {
    label: "Hiring manager",
    description:
      "Can view opening, create  and edit interviews, create, view, and edit candidates",
    hierarchy: 2,
  },
  member: {
    label: "Interview editor",
    description: "Can view opening, create interviews, and edit interviews",
    hierarchy: 3,
  },
};

export default () => {
  const fetchMembers = async (query = "") => {
    const getOrganization = useGet(
      `organizations/${organization.value.slug}/users${query}`
    );
    await getOrganization.get();
    members.value = getOrganization.data.value.users;
  };

 
  return {
    fetchMembers,
    members,
    COLLABORATORS,
  };
};
