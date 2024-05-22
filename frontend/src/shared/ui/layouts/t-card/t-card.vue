<script setup lang="ts">
import { ref, onMounted } from "vue";

const show = ref(false);

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 0);
});
</script>

<template>
  <div class="t-card shadow" :class="{ show: show }">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.t-card {
  padding: 2rem;
  background-color: var(--t-surface);
  border-radius: 1rem;
  transition: all 0.5s ease;
  opacity: 0;
}

.shadow {
  // -webkit-box-shadow: 0px 6px 33px -3px rgba(75, 75, 75, 0.32);
  // -moz-box-shadow: 0px 6px 33px -3px rgba(75, 75, 75, 0.32);
  box-shadow: 0px 6px 15px -3px rgba(61, 61, 61, 0.137);
}

.show {
  opacity: 1;
}
</style>
