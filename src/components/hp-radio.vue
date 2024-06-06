<template>
  <div class="hp-radio" @click="handleChange">
    <input
      class="hp-radio__input"
      type="radio"
      :name="name"
      :checked="checked"
      v-bind="$attrs"
    />
    <label class="hp-radio__label" htmlFor="name">{{ label }}</label>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  checked: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["update:checked"]);

const handleChange = () => {
  emits("update:checked", !props.checked);
};
</script>

<style lang="scss">
.hp-radio {
  &:hover > .hp-radio__label:before {
    border: 1px solid var(--color-accent-background);
  }
  &__input {
    opacity: 0;
  }
  &__label {
    position: relative;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      left: -24px;

      top: 0;

      border-radius: 50%;
      border: 1px solid var(--color-border);
      width: 16px;
      height: 16px;
    }

    &::after {
      content: "";
      transition: all 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      position: absolute;
      left: -20px;
      top: 4px;
      border-radius: 50%;
      width: 10px;
      height: 10px;
    }
  }
}

.hp-radio:hover {
  > .hp-radio__label:before {
    outline: 4px solid var(--color-focus);
  }
}

.hp-radio:focus {
  + .hp-radio__label:before {
    outline: 4px solid var(--color-focus);
  }
}

.hp-radio__input:checked + .hp-radio__label:after {
  background-color: var(--color-accent-background);
}
</style>
