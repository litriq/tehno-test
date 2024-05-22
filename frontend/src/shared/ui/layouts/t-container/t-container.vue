<template>
    <div class="root">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.root {
    width: 700px;
    max-width: 100%;
    margin: 0 auto;
    @media (max-width: 700px) {
        margin: 1rem;
        width: calc(100% - 2rem);
    }
}
</style>
