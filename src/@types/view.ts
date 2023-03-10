import { PlotParams } from 'react-plotly.js';

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
  text_columns?: string[];
  datetime_columns?: string[];
}

export type ColumnCandidates = Record<string, string[]>;

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

export interface KeywordsData {
  data: string[];
  title: string;
}

export interface LazyFigureApi {
  api: string;
  title: string;
}

export interface PlotPayload {
  figure: PlotParams;
  lazy_figure_api?: LazyFigureApi[];
}
