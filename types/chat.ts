export type Citation = {
  id: string
  text: string
  document: {
    id: string
    title: string
    source: string
  }
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
}

