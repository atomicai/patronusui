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

export type DocPart = {
  lo: number;
  hi: number;
  score?: string;
}

export type Doc = {
  title?: string
  text: string
  score: string
  timestamp?: string
  upvote?: number
  highlight?: DocPart[];
  colorify?: string[];
}

export type DataFromServer = {
  query: Query
  passage: Passage
}
