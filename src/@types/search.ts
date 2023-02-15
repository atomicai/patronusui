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
  label?: string
  text: string
  score?: string
  doc_score?: string
  timestamp?: string
  upvote?: number
  highlight?: DocPart[];
  highlight_idx?: number;
}

export type DataFromServer = {
  query: Query
  passage: Passage
}
