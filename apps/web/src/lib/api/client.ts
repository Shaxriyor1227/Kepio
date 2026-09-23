import { mockStore } from './mock';
import { Signal, SignalsListParams, SignalsListResult, CreateSignalInput, SignalStatus } from './types';

const STORAGE_KEY = 'kepio_saved_signals';

function readPersistedSignals(): Signal[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as Signal[]) : [];
  } catch {
    return [];
  }
}

function persistSignal(signal: Signal) {
  if (typeof window === 'undefined') return;
  const signals = readPersistedSignals().filter((item) => item.id !== signal.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([signal, ...signals]));
}

export function getPersistedSignals(): Signal[] {
  return readPersistedSignals();
}

export interface SignalsApiClient {
  list(params?: SignalsListParams): Promise<SignalsListResult>;
  get(id: string): Promise<Signal | null>;
  create(input: CreateSignalInput): Promise<Signal>;
  updateStatus(id: string, status: SignalStatus): Promise<Signal | null>;
  delete(id: string): Promise<boolean>;
}

export const api: SignalsApiClient = {
  async list(params) {
    return mockStore.list(params);
  },
  async get(id) {
    return mockStore.get(id);
  },
  async create(input) {
    const signal = await mockStore.create(input);
    persistSignal(signal);
    return signal;
  },
  async updateStatus(id, status) {
    const signal = await mockStore.updateStatus(id, status);
    if (signal) persistSignal(signal);
    return signal;
  },
  async delete(id) {
    return mockStore.delete(id);
  },
};
