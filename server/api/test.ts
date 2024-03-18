
export default defineEventHandler(async event => {
    console.log('here')
    const z = await $fetch('https://localhost:7109/getRandom');
    console.log(z);
});