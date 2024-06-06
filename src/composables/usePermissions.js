import { ref } from "vue";
import useAuth, { state } from "./useAuth";
import { useGet } from "./useHttp";

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

const ROLES = {
  founder: {
    hierarchy: 1,
    label: "Founder",
    description: "Can appoint a new founder",
  },
  owner: {
    hierarchy: 2,
    label: "Owner",
    description:
      "Promote members & administrator to owners, has access to all openings, can edit organization and billing details",
  },
  administrator: {
    hierarchy: 3,
    label: "Admin",
    description:
      "Invite new users, can promote members to administrators, can create openings",
  },
  member: {
    hierarchy: 4,
    label: "Member",
    description: "Only has access to explicitly permissioned openings",
  },
};

const { organization } = useAuth();

const members = ref([]);

export const hasEditPermission = (entity) => {
  return state.organization?.slug === entity.author.organization?.slug;
};

export const hasOrganizationMemberDeletePermission = (entity) => {
  if (entity.role === "founder") {
    return false;
  }

  if (entity.role === state.user.organization.role) {
    return false;
  }

  if (
    ROLES[state.user.organization.role].hierarchy <=
    ROLES[entity.role].hierarchy
  ) {
    return true;
  }
};

export const hasInviteOrganizationMemberPermission = () => {
  return ROLES[state.user.organization.role].hierarchy <= 3;
};

const fetchMembers = async (query = "") => {
  const getOrganization = useGet(
    `organizations/${organization.value.slug}/users${query}`
  );
  await getOrganization.get();
  members.value = getOrganization.data.value.users;
};

export default () => {
  return {
    hasInviteOrganizationMemberPermission,
    hasOrganizationMemberDeletePermission,
    ROLES,
    fetchMembers,
    members,
    COLLABORATORS,
  };
};
