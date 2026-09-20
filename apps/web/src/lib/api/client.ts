import { mockStore } from './mock';
import { Signal, SignalsListParams, SignalsListResult, CreateSignalInput, SignalStatus } from './types';

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
    return mockStore.create(input);
  },
  async updateStatus(id, status) {
    return mockStore.updateStatus(id, status);
  },
  async delete(id) {
    return mockStore.delete(id);
  },
};
