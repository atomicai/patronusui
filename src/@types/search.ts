export type Data = {
  docs: Doc[]
  title?: string;
}

export type Query = {
  docs: Doc[]
}

export type Passage = {
  docs: Doc[]
}

export enum DocPartColor {
  highlighted = 'highlighted',
  color1 = 'color1',
  color2 = 'color2',
  color3 = 'color3',
  color4 = 'color4',
  color5 = 'color4',
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
