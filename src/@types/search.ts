export type Data = {
  docs: Doc[]
}

export type Query = {
  docs: Doc[]
}

export type Passage = {
  docs: Doc[]
}

export type Doc = {
  title: string
  text: string
  score: string
  timestamp?: string
  upvote?: number
}

export type DataFromServer = {
  query: Query
  passage: Passage
}
