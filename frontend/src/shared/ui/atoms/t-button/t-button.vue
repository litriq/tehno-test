<script lang="ts" setup>
import { defineEmits, defineProps, toRefs, computed } from "vue";

const emits = defineEmits<{
    (event: "click"): void;
}>();

const props = defineProps<{
    disabled?: boolean;
    block?: boolean;
}>();

const { block, disabled } = toRefs(props);

const computedClass = computed(() => ({
    root: true,
    block: block.value,
    disabled: disabled.value,
}));

const onClick = () => emits("click");
</script>

<template>
    <button :class="computedClass" @click="onClick">
        <slot />
    </button>
</template>

<style lang="scss" scoped>
.root {
    all: unset;
    padding: 1rem 1.6rem;
    border-radius: 10px;
    text-align: center;
    color: var(--t-tertiary);
    background-color: var(--t-primary);

    transition: all 125ms ease;
    &:hover {
        background-color: var(--t-primary-h);
    }

    cursor: pointer;
}

.block {
    width: calc(100% - 3.2rem);
}

.disabled {
    opacity: 0.8;
    pointer-events: none;
}
</style>
