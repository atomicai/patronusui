import { atom } from 'jotai'
import { PlotParams } from 'react-plotly.js'
import { ViewPayload } from '../@types/view'

export const plotCount = atom<number>(0)

export const plot = atom({})

export const file = atom<string>('')

export const plots = atom<PlotParams[]>([])

export const viewPayload = atom<ViewPayload[]>([])
