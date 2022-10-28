<template>
    <main>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <p>Loading...</p>
            </template>
        </Suspense>
    </main>
</template>

<script setup lang="ts">
import AsyncCityView from '../components/AsyncCityView.vue';
</script>