import type { Bus } from "./plugins/bus";

declare module '#app' {
    interface NuxtApp {
        '$bus': Bus
    }
}