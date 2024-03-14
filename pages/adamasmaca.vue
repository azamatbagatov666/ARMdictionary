<script setup lang="ts">
import { getHangman } from "~/services/getHangman";
const hangmanVis = ref(0);
const answer = ref();
const answerArray = ref<string[]>([]);
const guesses = ref<string[]>([]);

const letters = ["է", "թ", "փ", "ձ", "ջ", "ր", "չ", "ճ", "ժ", "ծ",
  "ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "ա", "ս", "դ", "ֆ",
  "գ", "հ", "յ", "կ", "լ", "խ", "զ", "ղ", "ց", "վ", "բ", "ն", "մ", "շ"];


const push = (letter: string) => {
  if (!guesses.value.includes(letter) && hangmanVis.value < 8 && !(answerArray.value.every(value => guesses.value.includes(value)))) {
    guesses.value.push(letter)
    if (answerArray.value.every(value => guesses.value.includes(value))) {
      console.log("kazandınız")
    }
    if (!answer.value.includes(letter)) {
      hangmanVis.value += 1;
    }
  }
  if (hangmanVis.value == 8 && !(answerArray.value.every(value => guesses.value.includes(value)))) {
    guesses.value = guesses.value.concat(answerArray.value);
  console.log('dfdf')



  }


};

onBeforeMount(async () => {
  newGame();

});

const isUsedButton = (letter: string) => {
  return guesses.value.includes(letter);
};

const isCorrectButton = (letter: string) => {

  return answer.value.includes(letter) && guesses.value.includes(letter);
};



const newGame = async () => {
  try {
    const data = await getHangman();
    if (data) {
      answer.value = data;
      answerArray.value = answer.value.split('')
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log(answer.value)

};



</script>

<template>
  <div class="hangman relative ml-2 border-2 border-white h-[375px] w-[270px] inline-block">
    <div class="absolute">
      <div class="gallows relative inline-block">
        <div class="gallowsbody" v-if="hangmanVis > 0"></div>
        <div class="gallowsstand" v-if="hangmanVis > 0"></div>
        <div class="gallowstop" v-if="hangmanVis > 0"></div>
        <div class="gallowscorner" v-if="hangmanVis > 0"></div>
        <div class="gallowsrope" v-if="hangmanVis > 1"></div>


      </div>
    </div>
    <div class="absolute left-[70px] top-[40px]">

      <div class="stickman relative inline-block">
        <div class="head" v-if="hangmanVis > 2"></div>
        <div class="torso" v-if="hangmanVis > 3"></div>
        <div class="leftarm" v-if="hangmanVis > 4"></div>
        <div class="rightarm" v-if="hangmanVis > 5"></div>
        <div class="leftleg" v-if="hangmanVis > 6"></div>
        <div class="leftfoot" v-if="hangmanVis > 6"></div>
        <div class="rightleg" v-if="hangmanVis > 7"></div>
        <div class="rightfoot" v-if="hangmanVis > 7"></div>
      </div>
    </div>
  </div>



  <div v-if="answer">
    <div class="inline-block" v-for="(character, index) in answerArray" :key="index">
      <div class="w-8" v-text="character" v-if="guesses.includes(character)"></div>
      <div class="w-8">_</div>
    </div>
  </div>


  <div class="keyboard" v-if="answer">
    <div
      class="inline-block left-1/2 -translate-x-1/2 relative border-2 border-black my-3 p-2 rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300">

      <div v-for="(letter, index) in letters" :key="index" class="text-center">
        <button v-if="index % 10 === 0" v-for="(letter) in letters.slice(index, index + 10)" class="armenian-button"
          :class="{ 'used-button': isUsedButton(letter), 'correct-button': isCorrectButton(letter) }" v-text="letter"
          @click="push(letter)"></button>
      </div>


    </div>

  </div>

  <div>
Kalan hakkınız {{ 8 - hangmanVis }}

  </div>

</template>

<style scoped>
.used-button {
  background-color: #ff0000 !important;
}

.correct-button {
  background-color: green !important;
}

.armenian-button {
  margin: 5px;
  padding: 10px;
  width: 35px;
  height: 35px;
  font-size: 16px;
  background-color: #3490dc;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding-top: 5px;

}

.gallowscorner {
  width: 100px;
  height: 10px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 30px;
  transform: rotate(-40deg);
  transform-origin: 100%;
  background-color: black;
}

.gallowsbody {
  width: 10px;
  height: 330px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 47px;
  background-color: black;
}

.gallowsrope {
  width: 2px;
  height: 40px;
  display: block;
  position: absolute;
  left: 170px;
  background-color: black;
}

.gallowstop {
  width: 150px;
  height: 10px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 47px;
  background-color: black;
}

.gallowsstand {
  width: 100px;
  height: 22px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 330px;
  background-color: black;
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
  left: 2px;
  transform: rotate(-50deg);
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
  left: 102px;
  transform: rotate(50deg);
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
