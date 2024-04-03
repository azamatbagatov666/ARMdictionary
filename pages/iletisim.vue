<script lang="ts" setup>

const name = ref("");
const nameError = ref();
const email = ref("");
const emailError = ref();
const subject = ref("");
const subjectError = ref();
const message = ref("");
const messageError = ref();

const sending = ref(false);

const mailError = ref();

const messageLength = computed(() => message.value.trim().length);
const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const mail = useMail();

const login = async () => {
  if (
    nameError.value == false &&
    emailError.value == false &&
    subjectError.value == false &&
    messageError.value == false
  ) {
    const mailSent = await sendMail();
    if (mailSent) {
      clearAll();
      mailError.value = false;
    } else {
      mailError.value = true;
    }
  } else {
    validateAll();
  }
};

const sendMail = async () => {
  sending.value = true;
  try {
  console.log("nazem")

    await mail.send({
      from: `${name.value} <${email.value}>`,
      subject: "Avedikyan Sözlük: " + subject.value,
      text: "Gönderen kişinin adı: " + name.value + "\n" + "Gönderen kişinin e-posta adresi: " + email.value + "\n\n\n" + message.value});
    return true;
  } catch (error) {
    return false;
  } finally {
    sending.value = false;
  }
};

const validateAll = () => {
  if (!regex.test(email.value.toLowerCase())) {
    emailError.value = true;
  }
  if (message.value.trim().length < 30) {
    messageError.value = true;
  }
  if (subject.value.trim().length < 3) {
    subjectError.value = true;
  }
  if (name.value.trim().length < 3) {
    nameError.value = true;
  }
};

const clearAll = () => {
  name.value = "";
  nameError.value = undefined;
  email.value = "";
  emailError.value = undefined;
  subject.value = "";
  subjectError.value = undefined;
  message.value = "";
  messageError.value = undefined;
};

const validateEmail = () => {
  if (!regex.test(email.value.toLowerCase())) {
    emailError.value = true;
  } else {
    emailError.value = false;
  }
};

const validateInput = (source: string, value: string) => {
  if (value.trim().length >= 3) {
    if (source == "name") {
      nameError.value = false;
    } else if (source == "subject") {
      subjectError.value = false;
    }
  } else {
    if (source === "name") {
      nameError.value = true;
    } else if (source === "subject") {
      subjectError.value = true;
    }
  }
};

const validateMessage = () => {
  if (message.value.trim().length >= 30) {
    messageError.value = false;
  } else {
    messageError.value = true;
  }
};
</script>

<template>
  <div class="sm:h-[90vh] h-full w-full flex items-center justify-center">
    <div
      class="p-2 sm:p-8 w-full sm:w-max bg-gray-200 sm:border-2 border-black rounded-lg dark:bg-[#101010] dark:border-white transition-colors duration-300"
    >
      <div class="grid gap-8 sm:gap-4">
        <div class="h-14">
          <span class="w-40 inline-block">Adınız Soyadınız</span>
          <ElementComponentsCustomInput
            @blur="validateInput('name', name)"
            maxlength="50"
            v-model="name"
            class="h-14 w-full sm:w-72 border-4"
            :class="{ 'border-red-600': nameError }"
          />
          <div
            v-if="nameError"
            class="sm:ml-40 text-red-600 font-bold text-sm pt-1"
          >
            Lütfen geçerli bir isim giriniz
          </div>
        </div>
        <div class="h-14">
          <span class="w-40 inline-block">e-posta</span>
          <ElementComponentsCustomInput
            @blur="validateEmail"
            maxlength="320"
            v-model="email"
            class="h-14 w-full sm:w-72 border-4"
            :class="{ 'border-red-600': emailError }"
          />
          <div
            v-if="emailError"
            class="sm:ml-40 text-red-600 font-bold text-sm pt-1"
          >
            Lütfen geçerli bir e-posta adresi giriniz
          </div>
        </div>
        <div class="h-14">
          <span class="w-40 inline-block">Konu</span>
          <ElementComponentsCustomInput
            @blur="validateInput('subject', subject)"
            v-model="subject"
            maxlength="237"
            class="h-14 w-full sm:w-72 border-4"
            :class="{ 'border-red-600': subjectError }"
          />
          <div
            v-if="subjectError"
            class="sm:ml-40 text-red-600 font-bold text-sm pt-1"
          >
            Lütfen geçerli konu başlığı giriniz
          </div>
        </div>
        <div>
          <div class="sm:flex">
            <div class="w-40">
            <span class="w-40 inline-block">Mesaj</span>
          </div>
            <textarea
              v-model="message"
              @blur="validateMessage"
              maxlength="2000"
              :class="{ 'border-red-600': messageError && messageLength < 30 }"
              class="bg-white p-2 rounded-lg text-black border-4 border-[rgb(128,128,128)] resize-none md:resize w-full md:w-[500px]"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div class="sm:flex justify-between">
            <div class="h-0">
              <div
                v-if="messageError && messageLength < 30"
                class="md:ml-40 w-[82%] text-red-600 font-bold text-sm pt-1"
              >
                Lütfen en az 30 karakter uzunluğunda bir mesaj yazınız
              </div>
            </div>
            <div
              class="text-end font-bold pt-1"
              v-text="messageLength + '/2000'"
              :class="{ 'text-green-500': messageLength >= 30 }"
            ></div>
          </div>
          <div class="h-6"><span v-if="mailError" class="text-red-600">Bağlantı Sorunu</span><span v-if="mailError == false" class="text-green-600">Mesajınız tarafımıza başarıyla ulaşmıştır.</span></div>
        </div>
        <ElementComponentsCustomButton
          class="hover:bg-red-500 w-36 mx-auto block disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:bg-white"
          text="Gönder"
          @click="login()"
          :disabled="sending"
        />

        <div
          class="bg-white text-black inline-block w-64 px-3 rounded-md font-bold border-4 border-[rgb(128,128,128)] dark:border-white transition-colors duration-300"
        >
          e-posta:
          <a class="text-[#0000EE] underline" href="mailto:info@avedikyan.com"
            >info@avedikyan.com</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


span {
  @apply font-bold;
}
</style>
