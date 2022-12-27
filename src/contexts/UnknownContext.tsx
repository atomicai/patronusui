import { atom } from 'jotai'
import { Doc } from '../@types/search'

export const unknownPassages = atom<Doc[]>([])
