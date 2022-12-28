export interface Figure {
  data: Plotly.Data[]
  layout: Partial<Plotly.Layout>
  frames: Plotly.Frame[] | null
}

export interface UploadPayload {
  filename: string
  is_suffix_ok: boolean
  is_file_corrupted: boolean
  is_prompt_required: boolean
}

export interface File {
  name: string
  type: string | undefined
  size: number | undefined
  url: string
  deleteUrl: string | undefined
  deleteType: string | undefined
}

export interface ViewPayload {
  figure: string
  title: string
  premium: boolean
}
