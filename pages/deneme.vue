<script setup lang="ts">
//
</script>

<template>
<div class="wrapper">
    <div class="head"></div>
    <div class="torso"></div>
    <div class="leftarm"></div>
    <div class="rightarm"></div>
    <div class="leftleg"></div>
    <div class="leftfoot"></div>
    <div class="rightleg"></div>
    <div class="rightfoot"></div>
</div>
  </template>
  
  <style scoped>


.wrapper {
  width: 214px;
  height: 267px;
  position: relative;
  border-width: 5px;
  border-color: white;
}

.head {
  width: 50px;
  height: 60px;
  border: 5px solid black;
  border-radius: 50%;
  display: block;
  position: absolute;
  left: 76px;
}


.torso {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 59px;
  left: 99px;
  background-color: black;
}

.leftleg {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 154px;
  left: 99px;
  transform: rotate(12deg);
  transform-origin: top;
  background-color: black;

}

.rightleg {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 154px;
  left: 99px;
  transform: rotate(-12deg);
  transform-origin: top;
  background-color: black;

}

.leftarm {
  width: 100px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 65px;
  transform: rotate(-25deg);
  transform-origin: 100%;
  background-color: black;

}



.rightarm {
  width: 100px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 65px;
  left: 104px;
  transform: rotate(25deg);
  transform-origin: 0%;
  background-color: black;

}


.leftfoot {
  width: 30px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 249px;
  left: 53px;
  transform: rotate(8deg);
  background-color: black;

}

.rightfoot {
  width: 30px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 249px;
  left: 121px;
  transform: rotate(-8deg);
  background-color: black;

}
  </style>
  