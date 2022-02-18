import { writable } from 'svelte/store'

export let children = writable([])
export let groups = writable([])
export let childrenForArchive = writable([])