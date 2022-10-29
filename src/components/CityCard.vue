<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer">
        <div class="flex flex-col flex-1">
            <h2 class="text-2xl">{{ city.city }}</h2>
            <h3>{{ city.country }}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p class="text-2xl self-end">
                {{ Math.round(city.data.main.temp) }}&deg;
            </p>
            <div class="flex gap-2">
                <span class="text-xs">
                    H: {{ Math.round(city.data.main.temp_max) }}&deg;
                </span>
                <span class="text-xs">
                    L: {{ Math.round(city.data.main.temp_min) }}&deg;
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface city {
    id: string
    city: string
    country: string
    coords: { lat: number, lon: number }
    data?: any
}

defineProps<{
    city: city
}>()
</script>