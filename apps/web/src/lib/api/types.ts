export type SignalStatus = 'new' | 'read' | 'done' | 'archived';
export type SignalCollection = 'jobs' | 'freelance' | 'courses' | 'housing' | 'tools' | 'other';
export type SignalSourceType = 'telegram' | 'web' | 'other';

export interface Signal {
  id: string;
  title: string;
  summary: string;
  url?: string;
  sourceType: SignalSourceType;
  sourceLabel: string;
  collection: SignalCollection;
  tags: string[];
  status: SignalStatus;
  note?: string;
  deadline?: string;
  createdAt: string;
}

export interface SignalsListParams {
  collection?: string;
  status?: string;
  q?: string;
  sort?: 'recent' | 'oldest' | 'title';
  page?: number;
  pageSize?: number;
}

export interface SignalsListResult {
  items: Signal[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: {
    total: number;
    byCollection: Record<string, number>;
    byStatus: Record<SignalStatus, number>;
  };
}

export interface CreateSignalInput {
  title: string;
  summary?: string;
  url?: string;
  sourceType: SignalSourceType;
  sourceLabel?: string;
  collection: SignalCollection;
  tags: string[];
  note?: string;
  deadline?: string;
}
