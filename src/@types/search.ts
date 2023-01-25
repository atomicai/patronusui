export type Data = {
  docs: Doc[]
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
  score?: number;
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
