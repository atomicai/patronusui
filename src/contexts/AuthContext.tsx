import { atom } from 'jotai'
import { SuperUser } from '../@types/auth'

export const currentUser = atom<SuperUser | null>(null)
