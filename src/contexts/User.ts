import { atom } from 'jotai'

export const usernameAtom = atom<string>('')
export const isSignedInAtom = atom<boolean>(false)
