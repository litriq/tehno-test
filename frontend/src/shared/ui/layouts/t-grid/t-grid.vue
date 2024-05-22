<template>
    <div class="t-grid">
        <slot></slot>
    </div>
</template>
<style>
.t-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    width: 100%;
}
</style>
