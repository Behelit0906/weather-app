<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input @input="getSearchResults" v-model="searchQuery" type="text" placeholder="Search for a city"
                class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]">
            <ul v-if="searchResults.length > 0"
                class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
                <p v-if="searchError">Sorry, something went wrong, please try again.</p>
                <template v-else>
                    <li @click="previewCity(result)" v-for="result in searchResults" :key="result.id"
                        class="py-2 cursor-pointer">
                        {{ result.name }} - {{ result.country }}
                    </li>
                </template>
            </ul>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const queryTimeOut = ref(0);
const apiKey: string = import.meta.env.VITE_API_KEY;


interface result {
    id: number
    country: string
    lat: number
    local_names?: {}
    lon: number
    name: string
    state?: string
}

const searchResults = ref<result[]>([]);
const searchError = ref(false);


const getSearchResults = () => {
    clearTimeout(queryTimeOut.value);
    queryTimeOut.value = setTimeout(async () => {
        if (searchQuery.value !== '')
            searchResults.value = await getGeographicalCoordinates();

    }, 300);
};

const getGeographicalCoordinates = async () => {
    try {
        const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${toLowerCase(searchQuery.value)}&limit=5&appid=${apiKey}`);

        const data: result[] = [];

        for (let i = 0; i < result.data.length; i++) {
            result.data[i].id = i;
            data.push(result.data[i]);
        }
        return data;

    } catch (error) {
        searchError.value = true;
        console.log(error);
        return [];
    }
}

const toLowerCase = (value: string): string => value.toString();

const previewCity = (value: result) => {
    router.push({
        name: 'cityView',
        params: { country: value.country, city: value.name.replace(' ', '') },
        query: { lat: value.lat, lon: value.lon, preview: 1 }
    })
}


</script>