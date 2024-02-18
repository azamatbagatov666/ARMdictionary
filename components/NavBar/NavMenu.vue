<script setup lang="ts">

const dropDownOn = ref(false);
const adminDropDownOn = ref(false);
const languageState = useLanguageState();


const navBarItems = computed(() => {
  switch (languageState.value) {
    case "eng":
      return {
        menu: 'Menu',
      };
    case "am":
      return {
        menu: "Փնտռցէք",
      };
    case "tr":
      return {
        menu: 'Menü',
      };
    default:
      return {
        menu: 'Menü',
      };
  }
});


const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);


const emit = defineEmits<{
  (e: "cleaning-time"): void;
}>();

const homePageClean = () => {
if (currentRoute.value == "/") {
    emit("cleaning-time");
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
    <div class="inline-block">
        <div class="menubar max-h-12 flex">
            <NuxtLink to="/">
                <button @click="homePageClean"
                    class="bg-gray-200 h-12 w-16 grid place-items-center transition-color duration-300 dark:bg-black hover:!bg-red-500">
                    <img v-if="useColorMode().preference == 'dark'" src="/home-white.png" class="size-9" />
                    <img v-else="useColorMode().preference == 'light'" src="/home.png" class="size-9" />
                </button>
            </NuxtLink>
            <div @mouseover="toggleDropdown($event, 'regular')" @mouseleave="toggleDropdown($event, 'regular')"
                class="dropDownMenu">
                <button
                    class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-color duration-300 dark:bg-black dark:text-white"
                    v-text="navBarItems.menu + ' &#9660'"></button>
                <div class="dropDownOn relative" v-if="dropDownOn">
                    <nav>
                        <ul @click="toggleDropdown($event, 'regular')" class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">
                            <NuxtLink to="/">
                                <li>
                                    About
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/">
                                <li>
                                    Post 1
                                </li>
                            </NuxtLink>
                            <NuxtLink to="/">
                                <li class="rounded-b-sm">
                                    Post 2
                                </li>
                            </NuxtLink>
                        </ul>
                    </nav>
                </div>
            </div>
            <div @mouseover="toggleDropdown($event, 'admin')" @mouseleave="toggleDropdown($event, 'admin')"
                class="dropDownMenu">
                <button
                    class="dropDownOnButton bg-gray-200  h-12 w-56 text-black text-lg transition-color duration-300 dark:bg-black dark:text-white"
                    v-text="'Yönetici ' + '&#9660'"></button>
                <div class="dropDownOn relative" v-if="adminDropDownOn">
                    <nav>
                        <ul @click="toggleDropdown($event, 'admin')" class="bg-white border-l-2 border-b-2 border-r-2 border-[#ddd] text-black rounded-b-lg">
                            <NuxtLink to="/account/addNewWord">
                                <li>
                                    Yeni Sonuç Ekle
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
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/*aaa*/
.dropDownMenu:hover .dropDownOnButton {
    background-color: rgb(239 68 68);
}

.dropDownOn ul li:hover {
    background-color: #ddd;
}


.dropDownOn ul li {
    @apply p-4 transition-colors duration-300;
}</style>
