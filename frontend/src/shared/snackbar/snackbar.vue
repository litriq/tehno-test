<script lang="ts" setup>
import { computed } from "vue";
import { useSnackbar } from "./api";

const { message, type, isVisible } = useSnackbar();

const classList = computed(() => ({
  snackbar: true,
  [type.value]: true,
  show: isVisible.value
}));
</script>

<template>
  <div :class="classList">{{ message }}</div>
</template>

<style lang="scss" scoped>
.snackbar {
  padding: 1rem;
  border-radius: 10px;
  background-color: var(--t-surface);
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 200px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 6px 15px -3px rgba(29, 29, 29, 0.137);
  transform: translateY(200%) rotateX(90deg);
  opacity: 0;
}

.show {
  transform: translateY(0) rotateX(0);
  opacity: 1;
}

.success {
  outline: 1px solid var(--t-success);
}

.danger {
  outline: 1px solid var(--t-danger);
}
</style>
