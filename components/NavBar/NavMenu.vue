<script setup lang="ts">
import { useUserStore } from '~/store/user.store';


const dropDownOn = ref(false);
const adminDropDownOn = ref(false);






const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);
const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

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

const logoutClicked = () => {
    userStore.logout();
    navigateTo('/');
}

</script>

<template>
      <div
    class="sticky top-0 z-[55] bg-gray-200 h-12 hidden md:!flex justify-between dark:bg-black transition-colors duration-300 w-full select-none"
  >
  <div class="inline-block">
        <div class="max-h-12 flex">
            <NuxtLink to="/">
                <button @click="homePageClean"
                    class="bg-gray-200 h-12 w-16 outline-none grid place-items-center transition-colors duration-300 dark:bg-black supports-[hover:hover]:hover:!bg-red-500">
                    <img
          src="/home-white.png"
          class="size-9 hidden dark:flex"
          draggable="false"
        />
        <img src="/home.png" class="size-9 dark:hidden" draggable="false" />
                </button>
            </NuxtLink>
            <div @mouseover="toggleDropdown($event, 'regular')" @mouseleave="toggleDropdown($event, 'regular')"
                class="dropDownMenu">
                <button
                    class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-colors duration-300 dark:bg-black dark:text-white"
                    v-text="$t('navBar.menu') + ' &#9660'"></button>
                <div class="dropDownOn relative" v-if="dropDownOn">
                    <nav>
                        <ul @click="toggleDropdown($event, 'regular')" class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">
                            <NuxtLink to="/adamasmaca">
                                <li v-text="$t('navBar.hangman')">
                                </li>
                            </NuxtLink>

                                 <NuxtLink to="/faydalibilgiler">
                                <li v-text="$t('navBar.documents')">
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/iletisim">
                                <li v-text="$t('navBar.contact')">
                                </li>
                            </NuxtLink>
                        </ul>
                    </nav>
                </div>
            </div>
            <div @mouseover="toggleDropdown($event, 'admin')" @mouseleave="toggleDropdown($event, 'admin')" v-if="isLogged"
                class="dropDownMenu">
                <button
                    class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-colors duration-300 dark:bg-black dark:text-white"
                    v-text="'Yönetici ' + '&#9660'"></button>
                <div class="dropDownOn relative" v-if="adminDropDownOn">
                    <nav>
                        <ul @click="toggleDropdown($event, 'admin')" class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">
                            <NuxtLink to="/account/addNewWord">
                                <li>
                                    Yeni Sonuç Ekle
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/account/editWord">
                                <li>
                                    Sonuç Düzenle
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/account/modifyWords">
                                <li>
                                    Yeni Sözcük Ekle
                                </li>
                            </NuxtLink>
                            <NuxtLink to="/account/removeWord">
                                <li>
                                    Sözcük/Sonuç Sil
                                </li>
                            </NuxtLink>
                            <NuxtLink to="/account/lostAndFound">
                                <li>
                                    Bulunamayan Sözcükler
                                </li>
                            </NuxtLink>
                            <NuxtLink to="/account/wordOfTheDay">
                                <li>
                                    Günün Kelimesi
                                </li>
                            </NuxtLink>
                                <li class="cursor-pointer" @click="logoutClicked()">
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
}


.dropDownOn ul li {
    @apply p-4 transition-colors duration-300;
}</style>
