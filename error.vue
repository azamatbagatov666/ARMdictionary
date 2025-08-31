<script setup lang="ts">



onBeforeMount(() => {
      navigateTo("/");
});




</script>

<template>
  <div class="hidden">

<NavBarNavMenu class="hidden md:flex"/>

<NavBarMobileNavMenu/>

        <ElementComponentsLogoBanner />


  <div class="text-3xl grid items-center text-center justify-center h-[85vh]">
        <div>Aradığınız sayfa bulunamadı.</div>
        <div>Ձեր պահանջած էջը չգտնուեցաւ։</div>
        <div>The page you requested was not found.</div>
      </div>

      </div>
   
      
      </template>
