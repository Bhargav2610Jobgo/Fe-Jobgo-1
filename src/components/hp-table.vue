<template>
  <div class="hp-table">
    <table v-if="!isLoading" class="hp-table__table">
      <thead class="hp-table__table__head">
        <tr class="hp-table__table__head__row">
          <th
            @click="handleHeaderColClick(header)"
            :class="headerClasses(header)"
            v-for="(header, index) in headers"
            :key="index"
          >
            <div class="hp-table__table__head__col__content">
              <div class="hp-table__table__head__col__content__content">
                {{ header.label }}
              </div>
              <div
                class="hp-table__table__head__col__icon"
                :class="
                  header.sortable &&
                  selectedRow === header.value &&
                  'hp-table__table__head__col__icon--visible'
                "
              >
                <hp-icon
                  v-show="sortDirection === 'desc'"
                  size="18"
                  name="chevron-down"
                ></hp-icon>
                <hp-icon
                  v-show="sortDirection === 'asc'"
                  size="18"
                  name="chevron-up"
                ></hp-icon>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="hp-table__table__body">
        <tr
          v-if="sortedData.length > 0"
          class="hp-table__table__body__row"
          v-for="(row, index) in sortedData"
          :key="index"
        >
          <td
            class="hp-table__table__body__col"
            v-for="(header, index) in headers"
            :key="index"
          >
            <slot :name="header.value" :row="row">
              <span >
                {{ row[header.value] }}
              </span>
          
            </slot>
          </td>
        </tr>
        <tr v-else>
          <td :colspan="headers.length" class="hp-table__no-data">
            <div class="hp-table__no-data__image">
              <EmptyState class="hp-table__no-data__src" />
              <div>There is no data</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isLoading" class="hp-table__loading">
      <hp-spinner size="32"></hp-spinner>
    </div>
  </div>
</template>

<script setup>
// Vendor
import { ref, computed, watch } from "vue";

// Components
import EmptyState from "@/assets/abstracts/empty-state.svg";

// Composables
import HpIcon from "@/components/hp-icon.vue";
import HpSpinner from "@/components/hp-spinner.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const sortDirection = ref("off");
const selectedRow = ref(null);

const handleHeaderColClick = (header) => {
  if (header.sortable && selectedRow.value !== header.value) {
    sortDirection.value = "off";
    selectedRow.value = null;
  }
  if (header.sortable) {
    switch (sortDirection.value) {
      case "off":
        selectedRow.value = header.value;
        sortDirection.value = "asc";
        break;
      case "asc":
        selectedRow.value = header.value;
        sortDirection.value = "desc";
        break;
      case "desc":
        sortDirection.value = "off";
        selectedRow.value = null;
        break;
    }
  }
};

const headerClasses = (header) => {
  const classes = ["hp-table__table__head__col"];
  if (header.sortable) {
    classes.push("hp-table__table__head__col--sortable");
    if (header.value === selectedRow.value) {
      classes.push("hp-table__table__head__col--active");
    }
  }
  return classes;
};

const sortedData = computed(() => {
  const isSortable = props.headers.find((header) => header.sortable);
  if (!isSortable || !selectedRow.value) {
    return props.data;
  }

  const selectedHeader = props.headers.find(
    (header) => header.value === selectedRow.value
  );

  const isAscended = sortDirection.value === "asc";

  const ascSortedData = props.data.sort((a, b) => {
    const aValue = a[selectedHeader.value] || 0;
    const bValue = b[selectedHeader.value] || 0;
    if (aValue < bValue) {
      return isAscended ? -1 : 1;
    }
    if (aValue > bValue) {
      return isAscended ? 1 : -1;
    }
    return 0;
  });

  return ascSortedData;
});

watch(
  () => props.headers,
  () => {
    if (!props.headers.some((h) => h.value === selectedRow.value)) {
      selectedRow.value = null;
    }
  }
);
const emit = defineEmits(["deleteRow"]);
</script>

<style lang="scss">
.hp-table {
  &__table {
    table-layout: fixed;
    width: 100%;
    text-align: center;
    border-spacing: 0;
    &__head {
      position: sticky;
      top: 0;
      display: table-header-group;
      &__col {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
        border-right: none;
        border-left: none;
        background-color: var(--color-panel);
        text-transform: uppercase;
        letter-spacing: 0.01em;
        position: relative;
        &:first-child {
          padding: 12px 12px;
          text-align: left;
          border-top-left-radius: 12px;
          border: 1px solid var(--color-border);
          border-right: none;
          .hp-table__table__head__col__content {
            justify-content: start;
          }
        }
        &:last-child {
          padding: 12px 24px;
          border-top-right-radius: 12px;
          border: 1px solid var(--color-border);
          border-left: none;
        }
        &__content {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 12px;
          &__content {
            display: block;
            overflow: hidden;
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        &__icon {
          transition: opacity 0.15s ease-in-out;
          opacity: 0;
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translateY(-50%);
          &--visible {
            opacity: 1;
          }
        }
        &--sortable {
          cursor: pointer;
          user-select: none;
          &:hover {
            background-color: var(--color-underground);
          }
        }
        &--active {
          background-color: var(--color-underground);
        }
      }
      &__row {
        width: 100%;
      }
    }
    &__body {
      padding: 24px 12px;
      display: table-row-group;
      &__row {
        transition: background-color 0.15s ease-in-out;
        &:hover {
          background-color: var(--color-panel);
        }
        width: 100%;
        &:last-child {
          .hp-table__table__body__col {
            border-bottom: 1px solid var(--color-border);
            &:first-child {
              border-bottom-left-radius: 12px;
            }
            &:last-child {
              border-bottom-right-radius: 12px;
            }
          }
        }
      }
      &__col {
        border-bottom: 1px dashed var(--color-border);
        &:first-child {
          padding: 16px 24px;
          text-align: left;
          border-left: 1px solid var(--color-border);
        }
        &:last-child {
          padding: 16px 24px;
          border-right: 1px solid var(--color-border);
        }
        &__action {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  &__loading {
    padding: 120px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__no-data {
    padding: 120px;
    width: 100%;
    &__image {
      width: 100%;
      text-align: center;
    }
    &__src {
      max-width: 300px;
    }
  }
}
</style>
