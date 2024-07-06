<script setup lang="ts">
const isMenuOpen = ref(false);

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);

const { $bus } = useNuxtApp();

const homePageClean = () => {
  if (currentRoute.value == "/") {
    $bus.emit("clear-main-page");
  }
};
</script>

<template>
  <div class="md:!hidden">

  <div class="sticky top-0 z-[54] h-12 flex justify-between bg-gray-200 dark:bg-black transition-colors duration-300 select-none">
    <NuxtLink to="/">
      <button
        @click="homePageClean"
        class="bg-gray-200 h-12 w-16 outline-none grid place-items-center transition-colors duration-300 dark:bg-black hover:!bg-red-500"
      >
        <img
          src="/home-white.png"
          class="size-9 hidden dark:flex"
          draggable="false"
        />
        <img src="/home.png" class="size-9 dark:hidden" draggable="false" />
      </button>
    </NuxtLink>
    <div
      class="flex items-center gap-2 cursor-pointer bg-gray-200 px-2 transition-[background-color] duration-300 dark:bg-black hover:!bg-red-500"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span v-text="$t('navBar.menu')" class="transition-none"></span>

      <div>
        <div class="bar1" :class="{ change: isMenuOpen }"></div>
        <div class="bar2" :class="{ change: isMenuOpen }"></div>
        <div class="bar3" :class="{ change: isMenuOpen }"></div>
      </div>
    </div>
  </div>
  <div class="theMenu h-0 z-[999] absolute w-full bg-gray-200 dark:bg-black transition-all duration-300"
  :class="{'h-36':isMenuOpen}">
  <Transition>

    <nav v-show="isMenuOpen">
      <ul class="select-none">
        <li class="flex justify-between"><NavBarLanguageOption /><NavBarToggleSwitch/></li>

        <NuxtLink to="/adamasmaca">
          <li v-text="$t('navBar.hangman')" class="hover:bg-[#ddd] hover:text-black"></li>
        </NuxtLink>

        <NuxtLink to="/iletisim">
          <li v-text="$t('navBar.contact')" class="hover:bg-[#ddd] hover:text-black"></li>
        </NuxtLink>


      </ul>
    </nav>
  </Transition>

  </div>
</div>
</template>

<style scoped>
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

.theMenu li{
    @apply h-12 border-y border-white flex items-center p-2;
}
</style>
