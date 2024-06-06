<template>
  <li class="organization-member">
    <div class="organization-member__name" v-if="member.name">
      {{ member.name }}
      <span class="organization-member__email">{{ member.email }}</span>
    </div>
    <div class="organization-member__name" v-else>{{ member.email }}</div>
    <div class="organization-member__actions">
      <hp-dropdown-list
        :label="member.role"
        :options="promotionList(member.role)"
        :isDisabled="
          promotionList(member.role).length === 0 || user.email === member.email
        "
        @handleChange="
          (value) => emits('handleRoleChange', { member, role: value })
        "
      ></hp-dropdown-list>
      <hp-button
        icon="trash"
        v-if="deletePermission"
        danger
        @handleClick="emits('handleRemovalRequest', member)"
      ></hp-button>
    </div>
  </li>
</template>

<script setup>
// Components
import HpButton from "@/components/hp-button.vue";
import HpDropdownList from "@/components/hp-dropdown-list.vue";

// Composables
import usePermissions from "@/composables/usePermissions";
import useAuth from "@/composables/useAuth";

const { user } = useAuth();
const { ROLES } = usePermissions();

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
  deletePermission: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["handleRoleChange", "handleRemovalRequest"]);

const promotionList = (role) => {
  if (role === "founder") {
    return [];
  }

  if (role === "owner" && user.value.organization.role === "owner") {
    return [];
  }

  const filteredRoles = Object.keys(ROLES)
    .filter((r) => r !== role)
    .filter(
      (r) => ROLES[r].hierarchy > ROLES[user.value.organization.role].hierarchy
    );

  const formattedRoles = filteredRoles.map((r) => ({
    value: r,
    description: ROLES[r].description,
  }));

  return formattedRoles;
};
</script>

<styles lang="scss">
.organization-member {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &__name {
    display: flex;
    flex-direction: column;
    @include text-h5;
  }
  &__email {
    color: var(--color-text-secondary);
    @include text-h6;
  }
  &__role {
    margin-right: 12px;
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
  }
}
</styles>
