<script setup lang="ts">
const isMenuOpen = ref(false);

const { t } = useI18n();


import { useUserStore } from '~/store/user.store';

const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);

const { $bus } = useNuxtApp();

const homePageClean = () => {
  isMenuOpen.value = false;
  if (currentRoute.value == "/") {
    $bus.emit("clear-main-page");
  }
};

const logoutClicked = () => {
  userStore.logout();
  navigateTo('/');
}



const adminDropDownOn = ref(false);

const toggleDropdown = (event: Event) => {

  if (event.type == 'mouseover') {
    adminDropDownOn.value = true;
  }
  else if (event.type == 'mouseleave' || event.type == 'click') {
    adminDropDownOn.value = false;
  }

};
</script>

<template>
  <div class="lg:!hidden">

    <div class="sticky top-0 z-[60] h-12 flex justify-between bg-gray-200 dark:bg-black transition-colors  select-none">
      <NuxtLink to="/">
        <button @click="homePageClean" aria-label="Ana Sayfa"
          class="bg-gray-200 h-12 w-16 homePage outline-none grid place-items-center transition-colors duration-75 dark:bg-black active:!bg-red-500">
          <img src="/home-white.png" alt="" class="size-9 hidden dark:flex" draggable="false" />
          <img src="/home.png" alt="" class="size-9 dark:hidden" draggable="false" />
        </button>
      </NuxtLink>
      <div @mouseover="toggleDropdown($event)" @mouseleave="toggleDropdown($event)" v-if="isLogged"
        class="dropDownMenu">
        <button
          class="dropDownOnButton bg-gray-200  h-12 w-36 text-black text-lg transition-colors duration-300 dark:bg-black dark:text-white"
          v-text="'Yönetici ' + '&#9660'"></button>
        <div class="dropDownOn relative" v-if="adminDropDownOn">
          <nav>
            <ul @click="toggleDropdown($event)"
              class="bg-white border-l-2 border-b-2 border-r-2 w-36 border-[#ddd] text-black rounded-b-lg">
            
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
                                  {{"Yönlendirme/\nSözcük Sil"}}
                                </NuxtLink>
                                </li>   




                                <li  class="p-4 cursor-pointer" @click="logoutClicked()">
                                    Oturumu Kapat
                                </li>

            </ul>
          </nav>
        </div>
      </div>
      <div
        class="flex items-center gap-2 homePage cursor-pointer bg-gray-200 px-2 transition-[background-color] duration-75  dark:bg-black active:!bg-red-500"
        @click="isMenuOpen = !isMenuOpen">
        <span v-text="t('navBar.menu')" class="transition-none"></span>

        <div>
          <div class="bar1" :class="{ change: isMenuOpen }"></div>
          <div class="bar2" :class="{ change: isMenuOpen }"></div>
          <div class="bar3" :class="{ change: isMenuOpen }"></div>
        </div>
      </div>
    </div>
    <div class="theMenu h-0 z-[59] absolute w-full bg-gray-200 dark:bg-black transition-all duration-300"
      :class="{ 'h-48': isMenuOpen }">
      <Transition>

        <nav v-show="isMenuOpen">
          <ul class="select-none">
            <li class="flex justify-between p-2">
              <NavBarLanguageOption />
              <NavBarToggleSwitch />
            </li>

              <li  class="hover:bg-[#ddd] hover:text-black" @click="isMenuOpen = false">
            <NuxtLink to="/adamasmaca">
                  {{ t('navBar.hangman') }}

            </NuxtLink>

              </li>

              <li  class="hover:bg-[#ddd] hover:text-black" @click="isMenuOpen = false">
            <NuxtLink to="/faydalibilgiler">
                       {{ t('navBar.documents') }}
            </NuxtLink>

              </li>


              <li class="hover:bg-[#ddd] hover:text-black" @click="isMenuOpen = false">
            <NuxtLink to="/iletisim">
                       {{ t('navBar.contact') }}
            </NuxtLink>

              </li>


          </ul>
        </nav>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .homePage:hover {
    background-color: rgb(239 68 68) !important;
  }

  .dropDownMenu:hover .dropDownOnButton {
    background-color: rgb(239 68 68);
  }

  .dropDownOn ul li:hover {
    background-color: #ddd;
  }


}

.v-enter-active {
  transition-delay: 0.3s;

}

.v-leave-active {
  transition-delay: 0.0s;

}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bar1,
.bar2,
.bar3 {
  @apply w-[35px] h-[5px] bg-black m-[6px] transition-all duration-[400ms] dark:bg-white;

}

.bar1.change {
  transform: translate(0, 11px) rotate(-45deg);
}

.bar2.change {
  opacity: 0;
}

.bar3.change {
  transform: translate(0, -11px) rotate(45deg);
}

.theMenu li {
  @apply h-12 border-y border-white flex items-center;
}

.theMenu li a {
  @apply size-full block p-2 content-center;
}




.dropDownOn ul li {
    @apply transition-colors duration-300;
}

.dropDownOn ul li :deep(a) {
  @apply p-4 block size-full;
}


</style>
