<template>
  <div>
    <div class="settings" v-if="!isLoading">
      <hp-modal
        :isOpen="isConfirmMemberRemovalOpen"
        @close="isConfirmMemberRemovalOpen = false"
      >
        <div class="settings__modal">
          <h4 class="settings__card__title">Remove member</h4>
          <p class="settings__card__subtitle">
            This member will lose access to your organizations interviews,
            results, and templates
          </p>
          <div class="settings__modal__actions">
            <hp-button
              @handleClick="isConfirmMemberRemovalOpen = false"
              label="Cancel"
            ></hp-button>
            <hp-button
              class="settings__modal__button"
              destructive
              :isLoading="isRemovingMember"
              label="Remove member"
              @handleClick="handleRemoveMember"
            ></hp-button>
          </div></div
      ></hp-modal>
      <hp-modal
        :isOpen="isAddMemberModalOpen"
        @close="isAddMemberModalOpen = false"
      >
        <invite-member-modal @memberInvited="memberInvited" />
      </hp-modal>
      <h2 class="settings__title">
        {{ organization.name }}
      </h2>
      <p class="settings__subtitle">Manage your organization</p>
      <div class="settings__card">
        <h4 class="settings__card__title">Member information</h4>
        <p class="settings__card__subtitle">Manage your members</p>
        <ol class="settings__card__memberlist">
          <OrganizationMember
            v-for="member in members"
            :deletePermission="hasOrganizationMemberDeletePermission(member)"
            @handleRoleChange="handleRoleChange"
            :member="member"
            :key="member.reference"
            @handleRemovalRequest="handleRemovalRequest"
          ></OrganizationMember>
        </ol>
      </div>
      <div
        v-if="hasInviteOrganizationMemberPermission()"
        class="settings__card"
      >
        <h4 class="settings__card__title">Invite new member</h4>
        <p class="settings__card__subtitle">
          They will receive an email at the entered address, they will be added
          to the organization
        </p>
        <hp-button
          @handleClick="isAddMemberModalOpen = true"
          label="Add member"
          name="email"
          primary
        ></hp-button>
      </div>
    </div>
    <div v-if="isLoading" class="settings__spinner">
      <hp-spinner :content="true" size="32" />
    </div>
  </div>
</template>

<script setup>
// Vendor
import { ref, onMounted } from "vue";

// Components
import HpButton from "@/components/hp-button.vue";
import HpModal from "@/components/hp-modal.vue";
import HpSpinner from "@/components/hp-spinner.vue";
import OrganizationMember from "./organization-member.vue";
import InviteMemberModal from "./invite-member-modal.vue";

// Composables
import { usePut, useDelete } from "@/composables/useHttp";
import useAuth from "@/composables/useAuth";
import useToast from "@/composables/useToast";
import usePermissions from "@/composables/usePermissions";

const {
  hasInviteOrganizationMemberPermission,
  hasOrganizationMemberDeletePermission,
  fetchMembers,
  members,
} = usePermissions();

const { organization, refreshToken } = useAuth();
const { setToast } = useToast();

const isAddMemberModalOpen = ref(false);
const memberToRemove = ref(null);
const isRemovingMember = ref(false);
const isConfirmMemberRemovalOpen = ref(false);
const isChangingRole = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  await fetchMembers();
  isLoading.value = false;
});

const handleRemoveMember = async () => {
  isRemovingMember.value = true;
  const deleteMember = useDelete(`users/${memberToRemove.value.reference}`);
  await deleteMember.remove();
  await fetchMembers();
  isRemovingMember.value = false;
  isConfirmMemberRemovalOpen.value = false;
  setToast({
    type: "positive",
    title: "Member removed",
    message: `The member will no longer have access to your organization`,
  });
  memberToRemove.value = null;
};

const handleRemovalRequest = (member) => {
  memberToRemove.value = member;
  isConfirmMemberRemovalOpen.value = true;
};

const memberInvited = () => {
  setToast({
    type: "positive",
    title: "Invitation sent",
    message: `They will be able to accept this invitation from their email`,
  });
  isAddMemberModalOpen.value = false;
};

const handleRoleChange = async (payload) => {
  if (payload.role === payload.member.role) {
    return;
  }
  isChangingRole.value = true;
  const formattedPayload = {
    role: payload.role,
  };
  const updateMember = usePut(`users/${payload.member.reference}/role`);
  await updateMember.put(formattedPayload);
  setToast({
    type: "positive",
    title: "Member permission changed",
  });
  await fetchMembers();
  refreshToken();
};
</script>

<styles lang="scss">
.settings {
  &__modal {
    padding: 24px;
    &__button {
      margin-left: 12px;
    }
    &__actions {
      display: flex;
      justify-content: flex-end;
    }
  }
  &__spinner {
    margin: auto;
  }
  &__card {
    &__add-member {
      display: flex;
      align-items: baseline;
    }
    &__memberlist {
      display: flex;
      flex-direction: column;
    }
  }
}
</styles>
