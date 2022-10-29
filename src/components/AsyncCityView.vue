<template>
    <div class="flex flex-col flex-1 items-center">

        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>You are currently previewing this city, click the "+" icon to start tracking this city.</p>
        </div>

        <!-- Weather Overview -->
        <div class="flex flex-col items-center text-white py-12">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-6">{{ currentDate }} {{ currentTime }}</p>
            <p class="text-8xl mb-8"> {{ currentTemp }}&deg;</p>

            <p>Feels like {{ feelsLike }}&deg;</p>
            <p class="capitalize">
                {{ weatherData?.data.current.weather[0].description }}
            </p>
            <img :src="img" alt="weather img" class="w-[150px] h-auto">
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- Hourly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hour in weatherData?.data.hourly" :key="hour.dt"
                        class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap">
                            {{ hour.currentTime }}
                        </p>
                        <img :src="hour.img" alt="weather img" class="w-auto h-[50px] object-cover" />
                        <p class="text-xl">{{ Math.round(hour.temp) }}&deg;</p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- Weekly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">7 Days Forecast</h2>
                <div v-for="day in days" :key="day.dt" class="flex items-center">
                    <p class="flex-1">{{ day.dayName }}</p>
                    <img class="w-auto h-[50px] object-cover" :src="day.img" alt="weather icon">
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>H: {{ day.maxTemp }}&deg;</p>
                        <p>L: {{ day.minTemp }}&deg;</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="route.query.id" @click="removeCity"
            class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500">
            <i class="fa-solid fa-trash"></i>
            <p>Remove city</p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const apiKey: string = import.meta.env.VITE_API_KEY;


const getCurrentWeather = async () => {
    try {
        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lon}&exclude={part}&appid=${apiKey}&units=metric`);

        // calculate current date and time
        const localOffSet = new Date().getTimezoneOffset() * 60000
        const utc = weatherData.data.current.dt * 1000 + localOffSet;
        weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

        // calculate hourly weather offset
        weatherData.data.hourly.map((hour: any) => {
            const utc = hour.dt * 1000 + localOffSet;
            const currentTime = new Date(utc + 1000 * weatherData.data.timezone_offset).toLocaleTimeString("en-us", { hour: "numeric" });
            hour.currentTime = currentTime;
            hour.img = `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`
        });

        return weatherData;
    } catch (error) {
        console.log(error);
    }
}

const weatherData = ref(await getCurrentWeather());

const currentDate = computed(() => {
    let date = '';
    if (weatherData.value) {
        date = new Date(weatherData.value.data.currentTime).toLocaleDateString(
            "en-us",
            {
                weekday: "short",
                day: "2-digit",
                month: "long",
            }
        )
    }

    return date;
});

const currentTime = computed(() => {
    let time = '';
    if (weatherData.value) {
        time = new Date(weatherData.value.data.currentTime).toLocaleTimeString(
            "en-us",
            {
                timeStyle: "short",
            }
        )
    }

    return time;
})

const currentTemp = computed(() => {
    let temp = 0

    if (weatherData.value)
        temp = Math.round(weatherData.value.data.current.temp);

    return temp
})

const feelsLike = computed(() => {
    let feel = 0;
    if (weatherData.value)
        feel = Math.round(weatherData.value.data.current.feels_like)

    return feel;
})

const img = computed(() => {
    let img = '';
    if (weatherData.value)
        img = `http://openweathermap.org/img/wn/${weatherData.value.data.current.weather[0].icon}@2x.png`

    return img;
})

const days = computed(() => {
    interface day {
        dt: number
        dayName: string
        img: string
        minTemp: number
        maxTemp: number
    }

    if (weatherData.value) {
        const daysInfo: day[] = [];
        weatherData.value.data.daily.forEach((element: any) => {
            const day: day = { dt: 0, dayName: '', img: '', minTemp: 0, maxTemp: 0 };
            day.dt = element.dt;
            day.dayName = new Date(element.dt * 1000).toLocaleDateString("en-us", { weekday: "long" });
            day.img = `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`
            day.minTemp = Math.round(element.temp.min);
            day.maxTemp = Math.round(element.temp.max);
            daysInfo.push(day);
        });
        return daysInfo;
    }
    return [];
})


const removeCity = () => {
    const temp = localStorage.getItem('savedCities');
    let cities: any[] = []
    if (temp) {
        cities = JSON.parse(temp);
        cities = cities.filter(e => e.id !== route.query.id);
        localStorage.setItem('savedCities', JSON.stringify(cities));
        router.push({ name: 'home' });
    }
}

</script>
