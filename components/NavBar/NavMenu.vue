<script setup lang="ts">



const { t } = useI18n();

const dropDownOn = ref(false);
const adminDropDownOn = ref(false);



const { logout, session } = useAuth()


const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);

const { $bus } = useNuxtApp();

const homePageClean = () => {
    if (currentRoute.value == "/") {

        $bus.emit('clear-main-page')
    }
};


const toggleDropdown = (event: Event, id: string) => {
    if (id == 'regular') {


        if (event.type == 'mouseover') {
            dropDownOn.value = true;
        }
        else if (event.type == 'mouseleave' || event.type == 'click') {
            dropDownOn.value = false;
        }
    }
    else if (id == 'admin') {
        if (event.type == 'mouseover') {
            adminDropDownOn.value = true;
        }
        else if (event.type == 'mouseleave' || event.type == 'click') {
            adminDropDownOn.value = false;
        }
    }
};



</script>

<template>
    <div
        class="sticky top-0 z-[55] bg-gray-200 h-12 hidden lg:!flex justify-between dark:bg-black transition-colors duration-300 w-full select-none">
        <div class="inline-block">
            <div class="max-h-12 flex">
                <NuxtLink to="/">
                    <button @click="homePageClean" aria-label="Ana Sayfa"
                        class="bg-gray-200 h-12 w-16 outline-none grid place-items-center transition-colors homePage duration-300 dark:bg-black ">
                        <svg  width="38px" height="38px" viewBox="0 0 1024 1024" class="fill-current text-black dark:text-white transition-colors duration-300">
  <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"/>
</svg>
                    </button>
                </NuxtLink>
                <div @mouseover="toggleDropdown($event, 'regular')" @mouseleave="toggleDropdown($event, 'regular')"
                    class="dropDownMenu">
                    <button
                        class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-colors duration-300 dark:bg-black dark:text-white"
                        v-text="t('navBar.menu') + ' &#9660'" :class="{ '!bg-red-500': dropDownOn }"></button>
                    <div class="dropDownOn relative" v-if="dropDownOn">
                        <nav>
                            <ul @click="toggleDropdown($event, 'regular')"
                                class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">
                                <li>
                                <NuxtLink to="/adamasmaca" >
                                    {{ t('navBar.hangman') }}
                                </NuxtLink>

                                </li>

                                                                <li>
                                <NuxtLink to="/faydalibilgiler">
                                    {{ t('navBar.documents') }}
                                </NuxtLink>

                                </li>

                                                                <li>
                                <NuxtLink to="/iletisim" >
                       {{ t('navBar.contact') }}
                                </NuxtLink>

                                </li>


                            </ul>
                        </nav>
                    </div>
                </div>
                <div @mouseover="toggleDropdown($event, 'admin')" @mouseleave="toggleDropdown($event, 'admin')"
                    v-if="session" class="dropDownMenu">
                    <button
                        class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-colors duration-300 dark:bg-black dark:text-white"
                        v-text="'Yönetici ' + '&#9660'"></button>
                    <div class="dropDownOn relative" v-if="adminDropDownOn">
                        <nav>
                            <ul @click="toggleDropdown($event, 'admin')"
                                class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">

  <li>
                                <NuxtLink to="/account/stats">
                                  İstatistikler
                                </NuxtLink>
                                </li>

                                <li>
                                <NuxtLink to="/account/wordOfTheDay">
                                  Günün Sözcüğü
                                </NuxtLink>
                                </li>

                                <li>
                                <NuxtLink to="/account/lostAndFound">
                                  Bulunamayan Sözcükler
                                </NuxtLink>
                                </li>                                

                                <li>
                                <NuxtLink to="/account/addNewWord"  >
                                  Yeni Sözcük Ekle
                                </NuxtLink>
                                </li>                                


                                <li>
                                <NuxtLink to="/account/editWord" >
                                  Sözcük Düzenle
                                </NuxtLink>
                                </li>        

                                <li>
                                <NuxtLink to="/account/modifyWords" >
                                  Yönlendirme Ekle
                                </NuxtLink>
                                </li>   

                                <li>
                                <NuxtLink to="/account/removeWord" >
                                  Yönlendirme/Sözcük Sil
                                </NuxtLink>
                                </li>   




                                <li  class="p-4 cursor-pointer" @click="logout()">
                                    Oturumu Kapat
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="justify-end items-center flex gap-2">
            <NavBarToggleSwitch />
            <NavBarLanguageOption />
        </div>
    </div>


</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
    .dropDownMenu:hover .dropDownOnButton {
        background-color: rgb(239 68 68);
    }

    .dropDownOn ul li:hover {
        background-color: #ddd;
    }

    .homePage:hover {
        background-color: rgb(239 68 68);
    }


}


.homePage:active {
    background-color: rgb(239 68 68);
    transition-duration: 75ms !important;
}


.dropDownOn ul li {
    @apply transition-colors duration-300;
}

.dropDownOn ul li :deep(a) {
  @apply p-4 block size-full;
}


</style>
