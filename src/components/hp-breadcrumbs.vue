<template>
  <div class="hp-breadcrumbs">
    <transition-group
      name="hp-breadcrumbs__list-transition"
      class="hp-breadcrumbs__list"
      tag="ol"
    >
      <li class="hp-breadcrumbs__crumb" v-for="(crumb, i) in crumbs" :key="i">
        <hp-icon
          class="hp-breadcrumbs__crumb__icon"
          name="chevron-right"
        ></hp-icon>
        <router-link class="hp-breadcrumbs__link" :to="crumb.to">{{
          crumb.label
        }}</router-link>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
import HpIcon from "@/components/hp-icon.vue";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";

const { crumbs } = useBreadcrumbs();
</script>

<style lang="scss" scoped>
.hp-breadcrumbs {
  display: none;
}

@media (min-width: $breakpoint-tablet) {
  .hp-breadcrumbs {
    display: block;
    &__list {
      display: flex;
    }
    &__crumb {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 24px;
      margin-right: 2px;
      transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      .hp-breadcrumbs__link {
        color: var(--color-text-secondary);
      }
      &:last-child {
        font-weight: 500;
        .hp-breadcrumbs__link {
          color: var(--color-text-primary);
        }
      }
      &:first-child {
        .hp-breadcrumbs__crumb__icon {
          display: none;
        }
      }
    }
  }
}

.hp-breadcrumbs__list-transition-item {
  display: inline-block;
  margin-right: 10px;
}
.hp-breadcrumbs__list-transition-enter-active,
.hp-breadcrumbs__list-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.hp-breadcrumbs__list-transition-enter-from,
.hp-breadcrumbs__list-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
