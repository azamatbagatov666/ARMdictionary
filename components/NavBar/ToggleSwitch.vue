<script setup lang="ts">
const checked = ref();

watchEffect(() => {
  const currentColorMode = useColorMode().value;
  checked.value = currentColorMode === "dark";
});

type Theme = "light" | "dark";

const setColorTheme = (newTheme: Theme) => {
  useColorMode().preference = newTheme;
};
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="h-[34px] p-4 relative flex items-center">
      <div class="size-4 bg-black dark:bg-white absolute  transition-colors duration-300"></div>
      <div class="size-4 bg-black dark:bg-white rotate-45 absolute  transition-colors duration-300"></div>
      <div
        class="h-[14px] w-[7px] mt-[0.5px] ml-[8px] bg-white dark:bg-black rounded-r-full absolute  transition-colors duration-300"
      ></div>
    </div>

    <div class="inline-block">
      <label class="switch">
        <input
          @click="
            setColorTheme($colorMode.preference == 'dark' ? 'light' : 'dark')
          "
          v-model="checked"
          type="checkbox"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.top-left {
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
