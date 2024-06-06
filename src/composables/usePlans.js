import { useGet } from "./useHttp";
import useAuth from "./useAuth";
let PLANS = [];

const PAYMENTS = {
  startup: {
    monthly: import.meta.env.VITE_PAYMENT_STARTUP_MONTHLY,
    yearly: import.meta.env.VITE_PAYMENT_STARTUP_YEARLY,
  },
  growth: {
    monthly: import.meta.env.VITE_PAYMENT_GROWTH_MONTHLY,
    yearly: import.meta.env.VITE_PAYMENT_GROWTH_YEARLY,
  },
};

const { plan, quota } = useAuth();

const getPlans = async () => {
  console.log('getPlans')
  const getPlans = useGet("self/plans");
  await getPlans.get();
  PLANS = getPlans.data.value.plans;
};

// getPlans();

const getPlanVariable = (feature) => {
  return quota.value[feature];
};

const getPaymentLink = (plan, billingperiod) => {
  return PAYMENTS[plan][billingperiod];
};

export default () => {
  return {
    getPlanVariable,
    getPaymentLink,
  };
};
