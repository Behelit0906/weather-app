<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)" />
    </div>
    <p class="text-center" v-if="savedCities.length === 0">
        No locations added. To start tracking a location, search in the field above.
    </p>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import axios from 'axios';
import CityCard from './CityCard.vue';
import { useRouter } from 'vue-router';

interface city {
    id: string
    city: string
    country: string
    coords: { lat: number, lon: number }
    data?: any
}

const router = useRouter();
const apiKey: string = import.meta.env.VITE_API_KEY;
const savedCities: Ref<city[]> = ref([]);

const getCitiesFromLocalStorage = () => {
    const temp = localStorage.getItem('savedCities');
    if (temp)
        savedCities.value = JSON.parse(temp);
}

const getCitiesInfoFromApi = async () => {
    const requests: any[] = [];
    savedCities.value.forEach(city => {
        requests.push(axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${apiKey}&units=metric`));
    });

    const weatherData = await Promise.all(requests);

    weatherData.forEach((value, index) => {
        savedCities.value[index].data = value.data;
    });
}

getCitiesFromLocalStorage();
await getCitiesInfoFromApi();

const goToCityView = (city: city) => {
    router.push({
        name: 'cityView',
        params: { country: city.country, city: city.city },
        query: { id: city.id, lat: city.coords.lat, lon: city.coords.lon }
    })
}

</script>