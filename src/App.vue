<template>
  <div class="flex flex-col min-h-screen font-europa bg-weather-primary">
    <SiteNavigation />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import SiteNavigation from "./components/SiteNavigation.vue";
</script>