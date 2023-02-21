export type Data = {
  docs: Doc[]
  title?: string;
  keywords?: KeywordDistributionData;
}

export type Query = {
  docs: Doc[]
}

export type Passage = {
  docs: Doc[]
}

export enum DocPartColor {
  highlighted = 'highlighted',
  color1 = 1,
  color2 = 2,
  color3 = 3,
  color4 = 4,
  color5 = 5,
}

export type DocPart = {
  lo: number;
  hi: number;
  score?: string;
  color?: DocPartColor;
}

export type Doc = {
  title?: string
  text: string
  score: string
  timestamp?: string
  upvote?: number
  highlight?: DocPart[];
}

export type DataFromServer = {
  query: Query
  passage: Passage
}

export interface TimestampedValue {
  timestamp: string;
  value: number;
}

export type KeywordDistributionData = Record<string, TimestampedValue[]>
