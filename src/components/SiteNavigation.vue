<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <router-link :to="{ name: 'home' }">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-2xl">The Local Wheater</p>
                </div>
            </router-link>
            <div class="flex gap-3 flex-1 justify-end">
                <i @click="openModal"
                    class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>

                <i @click="addCity" v-if="route.query.preview"
                    class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
            </div>
            <BaseModalVue :modal-active="modalActive" @close-modal="closeModal">
                <div class="text-black">
                    <h1 class="text-2xl mb-1">About:</h1>
                    <p class="mb-4">
                        The Local Weather allows you to track the current and
                        future weather of cities of your choosing.
                    </p>
                    <h2 class="text-2xl">How it works:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>
                            Search for your city by entering the name into the
                            search bar.
                        </li>
                        <li>
                            Select a city within the results, this will take
                            you to the current weather for your selection.
                        </li>
                        <li>
                            Track the city by clicking on the "+" icon in the
                            top right. This will save the city to view at a
                            later time on the home page.
                        </li>
                    </ol>

                    <h2 class="text-2xl">Removing a city</h2>
                    <p>
                        If you no longer wish to track a city, simply select
                        the city within the home page. At the bottom of the
                        page, there will be am option to delete the city.
                    </p>
                </div>
            </BaseModalVue>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import BaseModalVue from './BaseModal.vue';
import { uid } from 'uid';
import { useRoute, useRouter } from 'vue-router';

const modalActive = ref(false);

const openModal = (): void => {
    modalActive.value = true;
    document.querySelector('body')?.classList.add('overflow-hidden');
}

const closeModal = (): void => {
    modalActive.value = false;
    document.querySelector('body')?.classList.remove('overflow-hidden')
}

interface city {
    id: string
    city: string
    country: string
    coords: { lat: number, lon: number }
}

const savedCities: Ref<city[]> = ref([]);
const route = useRoute();
const router = useRouter();

const addCity = () => {
    const temp = localStorage.getItem('savedCities');
    if (temp) {
        savedCities.value = JSON.parse(temp);
    }
    const city: city = {
        id: uid(),
        city: String(route.params.city),
        country: String(route.params.country),
        coords: { lat: Number(route.query.lat), lon: Number(route.query.lon) }
    }

    savedCities.value.push(city);
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value));

    let query = Object.assign({}, route.query);
    delete query.preview;
    query.id = city.id;
    router.replace({ query });
}

</script>