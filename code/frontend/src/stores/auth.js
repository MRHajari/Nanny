import { writable } from "svelte/store"

export const authenticated = writable(false)
export const usernameCheck = writable(false)