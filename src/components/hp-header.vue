<template>
  <div class="hp-header">
    <div class="hp-header__left">
      <router-link class="hp-header__logo" to="/openings"><Logo /></router-link>
      <hp-breadcrumbs />
    </div>
    <div class="hp-header__right">
      <div id="teleport-target-header" class="hp-header__save-container"></div>
      <div v-if="!isDismissed" class="hp-header__getting-started">
        <!-- <hp-getting-started /> -->
      </div>
      <div
        class="hp-header__dropdown-container"
        ref="dropdownTarget"
        v-if="user"
      >
        <div
          :class="dropdownClasses"
          @click="isAccountMenuOpen = !isAccountMenuOpen"
        >
          <div class="hp-header__dropdown-target__info">
            <hp-avatar
              :class="`hp-header__dropdown-target__info__avatar
            ${
              hasHeaderSaveButton &&
              'hp-header__dropdown-target__info__avatar--save-button'
            }`"
              size="sm"
              :user="user"
              v-if="user.name"
            />
            <div class="hp-header__dropdown__deets" v-if="!hasHeaderSaveButton">
              {{ user.name ? user.name : user.email }}
            </div>
          </div>
        </div>
        <transition name="hp-header__dropdown-transition">
          <div v-if="isAccountMenuOpen" class="hp-header__dropdown">
            <div v-if="user.name" class="hp-header__dropdown__info">
              <hp-avatar
                :user="user"
                class="hp-header__dropdown__info__avatar"
              />
              <div class="hp-header__dropdown__info__name">
                <div>{{ user.name }}</div>
                <div class="hp-header__dropdown__info__email">
                  {{ user.email }}
                </div>
              </div>
            </div>
            <div v-if="canUpgradePlan" class="hp-header__dropdown__options">
              <router-link
                to="/upgrade"
                tag="div"
                class="
                  hp-header__dropdown__options__option
                  hp-header__dropdown__options__option--upgrade
                "
                @click="isAccountMenuOpen = false"
              >
                <hp-icon
                  name="diamond"
                  class="
                    hp-header__dropdown__options__option__icon
                    hp-header__dropdown__options__option__icon--upgrade
                  "
                />
                Upgrade
              </router-link>
            </div>
            <div v-if="organization" class="hp-header__dropdown__options">
              <router-link
                to="/organization"
                tag="div"
                class="hp-header__dropdown__options__option"
                @click="isAccountMenuOpen = false"
              >
                <hp-icon
                  name="candidates"
                  class="hp-header__dropdown__options__option__icon"
                />
                Organization
              </router-link>
            </div>
            <div class="hp-header__dropdown__options">
              <router-link
                to="/settings"
                tag="div"
                class="hp-header__dropdown__options__option"
                @click="isAccountMenuOpen = false"
              >
                <hp-icon
                  name="cog"
                  class="hp-header__dropdown__options__option__icon"
                />
                Account Settings
              </router-link>
            </div>
            <div class="hp-header__dropdown__options">
              <a
                href="https://help.hireproof.io"
                class="hp-header__dropdown__options__option"
                target="_blank"
              >
                <hp-icon
                  name="help"
                  class="hp-header__dropdown__options__option__icon"
                />
                Help center
              </a>
            </div>
            <div class="hp-header__dropdown__options">
              <div
                @click.prevent="handleDarkModeToggle"
                class="
                  hp-header__dropdown__options__option
                  hp-header__dropdown__options__option--toggle
                "
              >
                <div class="hp-header__dropdown__options__dark-mode">
                  <hp-icon
                    name="moon"
                    class="hp-header__dropdown__options__option__icon"
                  />
                  Dark mode
                </div>
                <hp-switch v-model="isDarkmode" :standalone="true" />
              </div>
            </div>
            <div @click="handleLogout" class="hp-header__dropdown__options">
              <div class="hp-header__dropdown__options__option">Logout</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { useRouter } from "vue-router";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";
// Components
import HpGettingStarted from "@/components/getting-started/hp-getting-started.vue";
import HpAvatar from "@/components/hp-avatar.vue";
import HpIcon from "@/components/hp-icon.vue";
import HpSwitch from "@/components/hp-switch.vue";
import HpBreadcrumbs from "@/components/hp-breadcrumbs.vue";
import useContextSave from "@/composables/useContextSave";
// Composables
import useAuth from "@/composables/useAuth";
import useDarkMode from "@/composables/useDarkMode";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import { useGettingStarted } from "@/composables/useGettingStarted";

// Svg
import Logo from "@/assets/logo.svg";

const { logout, organization, user } = useAuth();
const router = useRouter();

const { isDarkmode, handleDarkModeToggle } = useDarkMode();

const dropdownTarget = ref(null);
const isAccountMenuOpen = ref(false);

const { isDismissed } = useGettingStarted();

onClickOutside(dropdownTarget, (event) => {
  if (!isAccountMenuOpen.value) {
    return;
  }

  isAccountMenuOpen.value = false;
});

const { isDirty } = useContextSave();

const promptAreYouSure = (e) => {
  if (!isDirty.value) {
    return undefined;
  }

  const dialogText =
    "You have unsaved changes, are you sure you want to leave?";
  e.returnValue = dialogText;
  return dialogText;
};

const canUpgradePlan = computed(() => {
  if (!user.value.organization) {
    return true;
  }

  return user.value.organization.role !== "member";
});

onMounted(() => {
  window.addEventListener("beforeunload", promptAreYouSure);
});
onUnmounted(() => window.removeEventListener("beforeunload", promptAreYouSure));

const handleLogout = () => {
  logout();
  router.push("/signin");
};

const dropdownClasses = computed(() => {
  return {
    "hp-header__dropdown-target": true,
    "hp-header__dropdown-target--open": isAccountMenuOpen.value,
  };
});

const { hasHeaderSaveButton } = useBreadcrumbs();
</script>

<style lang="scss" scoped>
.hp-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  position: fixed;
  z-index: $z-index-501;
  background-color: var(--color-background);
  &__save-container {
    padding-right: 16px;
    border-right: $border;
    margin-right: 8px;
    display: flex;
    align-items: center;
    &__dropdown-container {
      &__item {
        display: flex;
        align-items: center;
        padding: 8px;
        border-radius: $border-radius-sm;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          background-color: var(--color-forground-floating);
        }
        &__icon {
          margin-right: 6px;
        }
      }
    }
  }
  &__logo {
    margin-right: 24px;
    display: flex;
    height: 34px;
    width: 53px !important;
  }
  &__right {
    display: flex;
    align-items: center;
  }
  &__left {
    display: flex;
    align-items: center;
  }
  &__dropdown-container {
    position: relative;
  }
  &__getting-started {
    margin-right: 8px;
  }
  &__dropdown-target {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: $border-radius-lg;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    &:hover {
      background-color: var(--color-panel);
      border: 1px solid var(--color-border);
    }
    &__info {
      display: flex;
      align-items: center;
      &__avatar {
        margin-right: 8px;
        &--save-button {
          margin-right: 0;
        }
      }
    }
    &--open {
      background-color: var(--color-panel);
      border: 1px solid var(--color-border);
    }
  }
  &__dropdown {
    z-index: $z-index-100;
    background-color: var(--color-background);
    position: absolute;
    top: calc(100% + 8px);
    left: 100%;
    width: 256px;
    transform: translateX(-100%);
    display: flex;
    flex-direction: column;
    box-shadow: 0px 16px 24px rgba(33, 44, 51, 0.06),
      0px 2px 6px rgba(33, 44, 51, 0.04), 0px 0px 1px rgba(33, 44, 51, 0.04);
    border-radius: $border-radius-lg;
    border: 1px solid var(--color-border-subtle);

    &__personal-deets {
      display: flex;
    }
    &__options {
      padding: 8px;
      border-bottom: 1px dashed var(--color-border);
      &:last-child {
        border-bottom: none;
      }
      &__option {
        display: flex;
        align-items: center;
        padding: 8px;
        border-radius: $border-radius-sm;
        line-height: 20px;
        cursor: pointer;
        transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        &:hover {
          background-color: var(--color-forground-floating);
        }
        &__icon {
          margin-right: 8px;
          color: var(--color-text-secondary);
          &--upgrade {
            color: var(--color-accent-forground);
          }
        }
        &--toggle {
          justify-content: space-between;
        }
        &--upgrade {
          background-color: var(--yellow--500);
          color: var(--color-accent-forground);
          &:hover {
            background-color: var(--yellow--400);
          }
        }
      }
      &__dark-mode {
        display: flex;
        align-items: center;
      }
    }

    &__info {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px dashed var(--color-border);
      &__avatar {
        margin-left: 12px;
        margin-right: 12px;
      }
      &__name {
        padding: 12px 0;
        display: flex;
        flex-direction: column;
        word-break: break-all;
      }
      &__email {
        color: var(--color-text-secondary);
        font-weight: 300;
      }
    }
  }
}

.hp-header__dropdown-transition-item {
  transform: translateX(-100%) translateY(0);
}
.hp-header__dropdown-transition-enter-active,
.hp-header__dropdown-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-header__dropdown-transition-enter-from,
.hp-header__dropdown-transition-leave-to {
  opacity: 0;
  transform: translateX(-100%) translateY(-10px);
}
</style>
