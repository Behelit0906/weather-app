<template>
    <main>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <p class="text-center text-white pt-5">Loading...</p>
            </template>
        </Suspense>
    </main>
</template>

<script setup lang="ts">
import AsyncCityView from '../components/AsyncCityView.vue';
</script>