import { Signal, SignalsListParams, SignalsListResult, CreateSignalInput, SignalStatus } from './types';
import { seedSignals } from './seed';

class InMemorySignalsStore {
  private signals: Signal[] = [];

  constructor() {
    this.signals = [...seedSignals];
  }

  async list(params: SignalsListParams = {}): Promise<SignalsListResult> {
    const {
      collection,
      status,
      q,
      sort = 'recent',
      page = 1,
      pageSize = 6,
    } = params;

    let filtered = [...this.signals];

    // Compute raw counts before collection/status filter, but respecting total store
    const counts: SignalsListResult['counts'] = {
      total: this.signals.length,
      byCollection: {
        all: this.signals.length,
        jobs: 0,
        freelance: 0,
        courses: 0,
        housing: 0,
        tools: 0,
        other: 0,
      },
      byStatus: {
        new: 0,
        read: 0,
        done: 0,
        archived: 0,
      },
    };

    for (const item of this.signals) {
      if (counts.byCollection[item.collection] !== undefined) {
        counts.byCollection[item.collection]++;
      }
      if (counts.byStatus[item.status] !== undefined) {
        counts.byStatus[item.status]++;
      }
    }

    // Filter by collection
    if (collection && collection !== 'all') {
      filtered = filtered.filter((s) => s.collection === collection);
    }

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter((s) => s.status === status);
    }

    // Search query
    if (q && q.trim().length > 0) {
      const cleanQ = q.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        const titleMatch = s.title.toLowerCase().includes(cleanQ);
        const summaryMatch = s.summary.toLowerCase().includes(cleanQ);
        const noteMatch = s.note ? s.note.toLowerCase().includes(cleanQ) : false;
        const tagMatch = s.tags.some((t) => t.toLowerCase().includes(cleanQ));
        const sourceMatch = s.sourceLabel.toLowerCase().includes(cleanQ);
        return titleMatch || summaryMatch || noteMatch || tagMatch || sourceMatch;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: 'recent'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (currentPage - 1) * pageSize;
    const items = filtered.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page: currentPage,
      pageSize,
      totalPages,
      counts,
    };
  }

  async get(id: string): Promise<Signal | null> {
    const item = this.signals.find((s) => s.id === id);
    return item ? { ...item } : null;
  }

  async create(input: CreateSignalInput): Promise<Signal> {
    const newSignal: Signal = {
      id: `sig-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title: input.title.trim(),
      summary: (input.summary || '').trim(),
      url: input.url?.trim(),
      sourceType: input.sourceType,
      sourceLabel: input.sourceLabel?.trim() || (input.sourceType === 'telegram' ? 'Telegram' : 'Web'),
      collection: input.collection,
      tags: input.tags.map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean),
      status: 'new',
      note: input.note?.trim(),
      deadline: input.deadline,
      createdAt: new Date().toISOString(),
    };

    this.signals.unshift(newSignal);
    return { ...newSignal };
  }

  async updateStatus(id: string, status: SignalStatus): Promise<Signal | null> {
    const index = this.signals.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.signals[index] = {
      ...this.signals[index],
      status,
    };
    return { ...this.signals[index] };
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.signals.length;
    this.signals = this.signals.filter((s) => s.id !== id);
    return this.signals.length < initialLen;
  }
}

// Global in-memory singleton instance for development/mock
declare global {
  // eslint-disable-next-line no-var
  var __kepio_signals_store__: InMemorySignalsStore | undefined;
}

export const mockStore = globalThis.__kepio_signals_store__ ?? new InMemorySignalsStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__kepio_signals_store__ = mockStore;
}
