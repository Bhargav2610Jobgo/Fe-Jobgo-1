<template>
  <div class="upgrade">
    <h1 class="upgrade__title">Upgrade</h1>
    <div class="upgrade__header">
      <p class="upgrade__header__plan">
        <hp-badge icon="diamond" :content="plan"></hp-badge>
        <hp-badge
          v-if="openings.length > 0"
          icon="template"
          :type="
            openings.length > getPlanVariable('openings')
              ? 'negative'
              : 'positive'
          "
          :content="`${openings.length}/${getPlanVariable(
            'openings'
          )} openings`"
        ></hp-badge>
      </p>
    </div>
    <hp-tabs
      class="upgrade__header__toggle"
      :options="[
        { value: 'yearly', label: 'Yearly' },
        { value: 'monthly', label: 'Monthly' },
      ]"
      v-model="billingPeriod"
    />
    <ol class="upgrade__grid">
      <li
        :class="`upgrade__tier upgrade__tier--startup ${
          plan === 'startup' && `upgrade__tier upgrade__tier--current`
        }`"
      >
        <h2 class="upgrade__tier__title">Startup</h2>
        <p class="upgrade__tier__description">
          Hiring managers or early-stage startups
        </p>
        <div class="upgrade__tier__price">
          {{ `${dictionary[billingPeriod].startup.price}€` }}
        </div>
        <a
          v-if="isAllowedToPurchase"
          :href="getPaymentLink('startup', billingPeriod)"
        >
          <hp-button
            fullWidth
            variant="plan"
            icon="diamond"
            label="Upgrade to Startup"
          ></hp-button>
        </a>
        <hp-button
          v-else
          fullWidth
          primary
          label="Ask your Organization admin"
          :isDisabled="true"
        ></hp-button>
        <ul class="upgrade__tier__features">
          <li class="upgrade__tier__feature">Up to 5 active job openings</li>
          <li class="upgrade__tier__feature">Unlimited interviews</li>
          <li class="upgrade__tier__feature">Unlimited candidates</li>
          <li class="upgrade__tier__feature">Unlimited interviewers</li>
          <li class="upgrade__tier__feature">
            Ready to use interview templates
          </li>
          <li class="upgrade__tier__feature">In depth candidate comparison</li>
          <li class="upgrade__tier__feature">Single sign on (SSO)</li>
          <li class="upgrade__tier__feature">Help Center / Knowledge base</li>
        </ul>
      </li>
      <li class="upgrade__tier">
        <h2 class="upgrade__tier__title">Growth</h2>
        <p class="upgrade__tier__description">
          Scaleups with a growing hiring volume
        </p>
        <div class="upgrade__tier__price">
          {{ `${dictionary[billingPeriod].growth.price}€` }}
        </div>
        <hp-button
          fullWidth
          primary
          label="Talk to us"
          @handleClick="
            openIntercom(`Hey Neea, I'm interested in Jobgo growth plan!`)
          "
        ></hp-button>
        <ul class="upgrade__tier__features">
          <li class="upgrade__tier__feature">Up to 20 active job openings</li>
          <li class="upgrade__tier__feature">Unlimited interviews</li>
          <li class="upgrade__tier__feature">Unlimited candidates</li>
          <li class="upgrade__tier__feature">Unlimited interviewers</li>
          <li class="upgrade__tier__feature">
            Ready to use interview templates
          </li>
          <li class="upgrade__tier__feature">In depth candidate comparison</li>
          <li class="upgrade__tier__feature">Single sign on (SSO)</li>
          <li class="upgrade__tier__feature">Help Center / Knowledge base</li>
          <li class="upgrade__tier__feature">Panel interviewing</li>
          <li class="upgrade__tier__feature">
            Organization / Multi-user platform
          </li>
          <li class="upgrade__tier__feature">Integrations</li>
          <li class="upgrade__tier__feature">Customer support</li>
        </ul>
      </li>
      <li class="upgrade__tier">
        <h2 class="upgrade__tier__title">Enterprise</h2>
        <p class="upgrade__tier__description">
          Global companies with a high hiring volume
        </p>
        <div class="upgrade__tier__price--enterprise">
          <p class="upgrade__tier__text">
            Reach out, we are open to new enterprise opportunities
          </p>
        </div>
        <hp-button
          fullWidth
          primary
          label="Talk to us"
          @handleClick="
            openIntercom(
              `Hey Neea, I'm interested in Jobgo enterprise plan!`
            )
          "
        ></hp-button>
        <ul class="upgrade__tier__features">
          <li class="upgrade__tier__feature">Unlimited openings</li>
          <li class="upgrade__tier__feature">Unlimited interviews</li>
          <li class="upgrade__tier__feature">Unlimited candidates</li>
          <li class="upgrade__tier__feature">Unlimited interviewers</li>
          <li class="upgrade__tier__feature">
            Ready to use interview templates
          </li>
          <li class="upgrade__tier__feature">In depth candidate comparison</li>
          <li class="upgrade__tier__feature">Single sign on (SSO)</li>
          <li class="upgrade__tier__feature">Help Center / Knowledge base</li>
          <li class="upgrade__tier__feature">Panel interviewing</li>
          <li class="upgrade__tier__feature">
            Organization / Multi-user platform
          </li>
          <li class="upgrade__tier__feature">Integrations</li>
          <li class="upgrade__tier__feature">
            Dedicated Customer Support / CSM
          </li>
        </ul>
      </li>
    </ol>
    <div class="upgrade__manage">
      <a
        target="_blank"
        href="https://billing.stripe.com/p/login/3cs3e39et5QC2Qw288"
        >Manage your subscription here</a
      >
    </div>
  </div>
</template>

<script setup>
// Vendor
import { onMounted, ref, computed } from "vue";

// Components
import HpButton from "@/components/hp-button.vue";
import HpBadge from "@/components/hp-badge.vue";
import HpTabs from "@/components/hp-tabs.vue";

// Composables
import useOpenings from "@/composables/useOpenings";
import useAuth from "@/composables/useAuth";
import usePlans from "@/composables/usePlans";

const { openings, fetchOpenings } = useOpenings();
const { plan, organization } = useAuth();
const { getPlanVariable, getPaymentLink } = usePlans();

const billingPeriod = ref("yearly");

const dictionary = {
  yearly: {
    billing: "per month, billed annually",
    startup: { price: 21 },
    growth: { price: 416 },
  },
  monthly: {
    billing: "per month, billed monthly",
    startup: { price: 25 },
    growth: { price: 499 },
  },
};

const openIntercom = (message) => {
  window.Intercom("showNewMessage", message);
};

onMounted(() => {
  fetchOpenings();
});

const isAllowedToPurchase = computed(() => {
  if (!organization.value?.role) {
    return true;
  }
  if (
    organization &&
    (organization.value.role === "founder" ||
      organization.value.role === "owner")
  ) {
    return true;
  }

  return false;
});
</script>

<styles lang="scss">
.upgrade {
  @include pageContainer;
  overflow: visible;
  margin-bottom: 120px;
  &__manage {
    text-decoration: underline;
    margin-top: 124px;
    padding-bottom: 124px;
    text-align: center;
    margin: auto;
  }
  &__title {
    @include text-h1;
    margin-bottom: 12px;
  }
  &__header {
    display: flex;
    flex-direction: column;
    &__number {
      font-weight: bold;
    }
    &__openings {
      @include text-h3;
    }
    &__plan {
      display: flex;
      align-items: center;
      text-transform: capitalize;
      gap: 6px;
      @include text-h2;
      margin-bottom: 12px;
    }
    &__toggle {
      margin-top: 12px;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 64px;
  }
  &__tier {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    border-radius: $border-radius-md;
    border: $border;
    padding: 24px;
    &__title {
      @include text-h1;
    }
    &__description {
      @include text-h5;
      color: var(--color-text-secondary);
      margin-bottom: 12px;
    }
    &__price {
      font-weight: 600;
      font-size: 48px;
      margin-bottom: 12px;
      &--enterprise {
        display: flex;
        min-height: 56px;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 12px;
      }
    }
    &__text {
      font-size: 14px;
      font-weight: 400;
    }
    &__features {
      padding-top: 24px;
    }
    &__feature {
      text-align: left;
      background: url("@/assets/icons/check-circle.svg") no-repeat 0 0px;
      padding-left: 28px;
      padding-right: 28px;
      background-size: 18px;
      margin-bottom: 12px;
      font-size: 14px;
      padding-bottom: 4px;
    }
    &--current {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}
</styles>
