import mitt, { type Emitter } from 'mitt'

const emitter = mitt<EmitTypes>();

export default defineNuxtPlugin((nuxtApp) => {
    const e: Bus = emitter;
    nuxtApp.provide('bus', e);
})

export interface Bus extends Emitter<EmitTypes>{

}

export type EmitTypes = {
    'clear-main-page': void
}