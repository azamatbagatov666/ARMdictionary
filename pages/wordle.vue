<script setup lang="ts">
import { playSound } from "~/utils/sound";

const { t } = useI18n();

const answer = ref("");
const answerArray = ref<string[]>([]);
const currentGuess = ref<string[]>([]);
const connectionError = ref(false);
const won = ref(false);
const lose = ref(false);
const wordleList = ref();
const wordleListBackup = ref();
const armRegex = /^\p{Script=Armenian}+$/u;
const allGuesses = ref<GuessResult[]>([]);
const invalidAnswer = ref(false);
const dialogueOpen = ref(false);
const infoOpen = ref(false);

const RULES_STORAGE_KEY = "wordle_rules_last_seen";
const RULES_COOLDOWN_DAYS = 60;

const currentGuessIndex = ref(1);

const tipKey = ref<string | null>(null);

const tip = computed(() => {
  if (!tipKey.value) return "";
  return t(tipKey.value);
});

const consumedLetters = computed(() => {
  return allGuesses.value
    .map((g) => g.word)
    .flatMap((w) => w.split(""))
    .filter((l, i, arr) => {
      return arr.indexOf(l) === i && !answerArray.value.includes(l);
    });
});

const letterState = computed(() => {
  const map = new Map<string, "green" | "yellow" | "gray">();

  for (const guess of allGuesses.value) {
    guess.word.split("").forEach((letter, i) => {
      const tile = guess.tiles[i];

      const current = map.get(letter);

      if (!current) {
        map.set(letter, tile);
        return;
      }

      // priority upgrade only
      if (current === "yellow" && tile === "green") {
        map.set(letter, "green");
      }

      if (current === "gray") {
        map.set(letter, tile);
      }
    });
  }

  return map;
});

const correctlyPlacedLetters = computed(() =>
  [...letterState.value.entries()]
    .filter(([, v]) => v === "green")
    .map(([k]) => k),
);

const misplacedLetters = computed(() =>
  [...letterState.value.entries()]
    .filter(([, v]) => v === "yellow")
    .map(([k]) => k),
);

onBeforeMount(() => {
  getWordleList();
  document.removeEventListener("keydown", handleDocumentClick);
});

onMounted(() => {
  document.addEventListener("keydown", handleDocumentClick);
});

onMounted(() => {
  [
    "/sfx/wordle/softClick.mp3",
    "/sfx/wordle/erase.mp3",
    "/sfx/wordle/hit.mp3",
    "/sfx/wordle/ding.mp3",
    "/sfx/wordle/noWord.mp3",
  ].forEach((src) => {
    const a = new Audio(src);
    a.preload = "auto";
  });
});

onMounted(() => {
  if (shouldShowRules()) {
    infoOpen.value = true;
  }
});

const handleDialogClose = () => {
  if (infoOpen.value) {
    localStorage.setItem(RULES_STORAGE_KEY, new Date().toISOString());
  }

  dialogueOpen.value = false;
  infoOpen.value = false;
};

const handleDocumentClick = (event: KeyboardEvent) => {
  if (event.repeat) return; // disable press hold

  if (event.key === "Backspace") {
    handleBackspace();
  } else if (event.key.length === 1 && armRegex.test(event.key)) {
    push(event.key.toLowerCase());
  } else if (event.key === "Enter") {
    submitGuess();
  }
};

const getWordleList = async () => {
  try {
    const data = await $fetch(`/api/get/getWordleList`, {
      method: "GET",
    });
    if (data) {
      wordleList.value = data;
      wordleListBackup.value = [...data];
      newGame();
    }
  } catch (error) {
    connectionError.value = true;
    answer.value = "";
  }
};

const handleNewGame = () => {
  if (!lose.value && !won.value && allGuesses.value.length > 0) {
    dialogueOpen.value = true;
  } else {
    newGame();
  }
};

const newGame = () => {
  dialogueOpen.value = false;
  const randomIndex = Math.floor(Math.random() * wordleList.value.length);
  answer.value = wordleList.value[randomIndex];
  wordleList.value.splice(randomIndex, 1);
  answerArray.value = answer.value.split("");
  currentGuess.value = [];
  allGuesses.value = [];
  currentGuessIndex.value = 1;
  won.value = false;
  lose.value = false;
  invalidAnswer.value = false;
  tipKey.value = null;
};

const push = (letter: string) => {
  if (currentGuess.value.length < 5 && !won.value) {
    //playSound("/sfx/wordle/softClick.mp3", 0.4);
    currentGuess.value.push(letter);
  }
  (document.activeElement as HTMLElement | null)?.blur?.();
};

const handleBackspace = () => {
  if (won.value || currentGuess.value.length === 0) return;
  //playSound("/sfx/wordle/erase.mp3", 0.4);

  currentGuess.value.pop();
  (document.activeElement as HTMLElement | null)?.blur?.();
};

type GuessResult = {
  word: string;
  tiles: Tile[];
};

const submitGuess = () => {
  if (won.value || invalidAnswer.value) return;

  if (currentGuess.value.length !== 5) {
    tipKey.value = "wordle.notEnoughLetters";
    return;
  }

  if (
    wordleListBackup.value &&
    !wordleListBackup.value.includes(currentGuess.value.join(""))
  ) {
    //playSound("/sfx/wordle/noWord.mp3", 0.4);
    tipKey.value = "wordle.notInWordList";
    invalid();
    return;
  }

  const word = currentGuess.value.join("");
  const tiles = scoreGuess(answer.value, word);

  allGuesses.value.push({ word, tiles });

  if (word === answer.value) {
    //playSound("/sfx/wordle/ding.mp3", 0.4);
    won.value = true;
    tipKey.value = "wordle.win";
    return;
  } else if (currentGuessIndex.value < 6) {
    tipKey.value = "wordle.tryAgain";
  } else if (currentGuessIndex.value === 6) {
    tipKey.value = "wordle.lose";
    lose.value = true;
  }
  //playSound("/sfx/wordle/hit.mp3", 0.4);

  currentGuess.value = [];
  currentGuessIndex.value++;

  (document.activeElement as HTMLElement | null)?.blur?.();
};

type Tile = "green" | "yellow" | "gray";

function scoreGuess(answer: string, guess: string): Tile[] {
  const result: Tile[] = Array(guess.length).fill("gray");
  const remaining: Record<string, number> = {};

  for (const c of answer) {
    remaining[c] = (remaining[c] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "green";
      remaining[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    const c = guess[i];
    if (result[i] === "gray" && remaining[c] > 0) {
      result[i] = "yellow";
      remaining[c]--;
    }
  }
  return result;
}

let timer: ReturnType<typeof setTimeout> | null = null;

watch(tipKey, (newVal) => {
  if (timer) clearTimeout(timer);

  if (newVal) {
    timer = setTimeout(() => {
      tipKey.value = null;
    }, 2000);
  }
});

function invalid() {
  invalidAnswer.value = true;
  setTimeout(() => {
    invalidAnswer.value = false;
  }, 2000);
}

function shouldShowRules(): boolean {
  const lastSeen = localStorage.getItem(RULES_STORAGE_KEY);
  if (!lastSeen) return true;

  const last = new Date(lastSeen).getTime();
  const now = Date.now();

  const diffDays = (now - last) / (1000 * 60 * 60 * 24);
  return diffDays > RULES_COOLDOWN_DAYS;
}
</script>

<template>
  <div>
    <ElementComponentsLogoBanner class="relative min-[1430px]:!absolute" />

    <div
      class="h-[65dvh] flex items-center justify-center"
      v-if="answer == '' && !connectionError"
    >
      <ElementComponentsLoadingAnimation />
    </div>

    <div v-if="answer.length > 0">
      <div class="flex justify-center">
        <div
          class="select-none relative w-full sm:w-[570px] rounded-t-lg bg-gray-200 dark:bg-[#101010] transition-colors duration-300 px-4 pt-4 mt-2 border-black max-[430px]:w-full dark:border-white border-2 !border-b-0"
        >
          <div v-for="i in 6">
            <div
              class="flex justify-center"
              :class="{ shake: invalidAnswer && i === currentGuessIndex }"
            >
              <div
                v-for="j in 5"
                class="size-12 cells border-2 uppercase text-white border-gray-500 m-1 flex items-center justify-center text-3xl font-bold"
                :class="{
                  '!border-black dark:!border-white':
                    i === currentGuessIndex && currentGuess[j - 1],
                  '!text-black dark:!text-white': i === currentGuessIndex,

                  '!bg-[#538d4e] !border-0':
                    allGuesses[i - 1]?.tiles[j - 1] === 'green',

                  '!bg-[#b59f3b] !border-0':
                    allGuesses[i - 1]?.tiles[j - 1] === 'yellow',

                  '!bg-[#3a3a3c] !border-0':
                    allGuesses[i - 1]?.tiles[j - 1] === 'gray',
                }"
              >
                {{
                  i === currentGuessIndex
                    ? currentGuess[j - 1]
                    : allGuesses[i - 1]?.word[j - 1]
                }}
              </div>
            </div>
          </div>
          <Transition name="slide-fade">
            <div
              v-if="tip != ''"
              class="w-max absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-black dark:border-white border-2 bg-white dark:bg-black p-4 rounded-full font-bold bg-opacity-75"
            >
              {{ tip }}
            </div>
          </Transition>
        </div>
      </div>
      <div class="">
        <ArmenianKeyboard
          class="!m-0 !border-t-0 !rounded-t-none !-mt-1 !mb-0 font-bold"
          @letter-pushed="push"
          @backspace-clicked="handleBackspace"
          @enter-clicked="submitGuess"
          :longPress="false"
          :backSpace="true"
          :uppercase="true"
          :consumedLetters="consumedLetters"
          :misplacedLetters="misplacedLetters"
          :correctlyPlacedLetters="correctlyPlacedLetters"
          :wordle="true"
        >
        </ArmenianKeyboard>

        <div class="text-xl font-bold text-white my-2 min-h-7 text-center">
          <div v-if="lose">
            <span>{{ t("wordle.answer") }}</span>
            <span class="uppercase tracking-widest">{{ answer }}</span>
          </div>
        </div>

        <div class="flex justify-center items-center">
          <ElementComponentsCustomButton
            class=""
            @click="handleNewGame"
            :text="t('wordle.reset')"
          />

          <div class="w-0 flex">
            <button
              @click="infoOpen = true"
              class="rounded-full ml-2  text-black border-gray-300 bg-white info active:!bg-[#ccc] text-3xl"
            >
             <SVGInfo/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DialogModal
    :open="dialogueOpen || infoOpen"
    dialogue-text=""
    @close="handleDialogClose"
  >
    <div v-if="infoOpen" class="">
      <div class="grid gap-4 text-base/10">
        <div class="font-bold text-2xl text-left">
          {{ t("wordle.howToPlay") }}
        </div>
        <div class="text-sm sm:text-base text-left whitespace-pre-line">
          {{ t("wordle.rules") }}
        </div>
      </div>
      <div class="font-bold sm:text-xl text-left mt-3">
        {{ t("wordle.example") }}
      </div>

      <div class="flex justify-left mt-2">
        <div
          v-for="j in ['ա', 'ռ', 'ո', 'ղ', 'ջ']"
          class="!text-black dark:!text-white size-12 select-none cells border-2 uppercase border-gray-500 m-1 flex items-center justify-center text-3xl font-bold"
          :class="{ '!bg-[#538d4e] !border-0 !text-white': j === 'ա' }"
        >
          {{ j }}
        </div>
      </div>
      <div class="text-left text-sm sm:text-base">
        {{ t("wordle.example1") }}
      </div>

      <div class="flex justify-left mt-2">
        <div
          v-for="j in ['թ', 'ա', 'փ', 'ե', 'լ']"
          class="!text-black dark:!text-white size-12 select-none cells border-2 uppercase border-gray-500 m-1 flex items-center justify-center text-3xl font-bold"
          :class="{ '!bg-[#b59f3b] !border-0 !text-white': j === 'փ' }"
        >
          {{ j }}
        </div>
      </div>
      <div class="text-left text-sm sm:text-base">
        {{ t("wordle.example2") }}
      </div>

      <div class="flex justify-left mt-2">
        <div
          v-for="j in ['ա', 'ռ', 'ո', 'ղ', 'ջ']"
          class="!text-black dark:!text-white size-12 select-none cells border-2 uppercase border-gray-500 m-1 flex items-center justify-center text-3xl font-bold"
          :class="{ '!bg-[#3a3a3c] !border-0 !text-white': j === 'ջ' }"
        >
          {{ j }}
        </div>
      </div>
      <div class="text-left text-sm sm:text-base">
        {{ t("wordle.example3") }}
      </div>
    </div>

    <div v-else-if="dialogueOpen">
      <div>{{ t("wordle.areYouSure") }}</div>
      <div class="flex justify-around mt-4">
        <button class="btn btn-success" @click="newGame">
          {{ t("dialog.yes") }}
        </button>
        <button class="btn btn-error" @click="dialogueOpen = false">
          {{ t("dialog.no") }}
        </button>
      </div>
    </div>
  </DialogModal>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  margin-top: 20px;
  opacity: 0;
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.cells {
  transition: border-color 0.3s;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@media (hover: hover) and (pointer: fine) {
  .info:hover {
    @apply !bg-[#ccc];
  }
}
</style>
