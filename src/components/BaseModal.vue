<template>
    <Teleport to="body">
        <Transition name="modal-outer">
            <div @click="$emit('close-modal')" v-show="modalActive"
                class="absolute w-full h-screen top-0 left-0 flex justify-center px-8 bg-black bg-opacity-30">
                <Transition name="modal-inner">
                    <div v-if="modalActive" class="p-4 bg-white self-start mt-6 max-w-screen-md">
                        <slot />
                        <button @click="$emit('close-modal')"
                            class="text-white mt-8 py-2 px-6 bg-weather-primary">Close</button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">

defineEmits(['close-modal']);

defineProps<{
    modalActive: boolean,
}>();
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active {
    transition: all.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
    transition: all.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}


.modal-inner-enter-from,
.modal-inner-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>