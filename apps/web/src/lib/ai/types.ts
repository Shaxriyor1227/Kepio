import { SignalCollection, SignalSourceType } from '../api/types';

export interface ParsedSignalData {
  title: string;
  summary: string;
  collection: SignalCollection;
  sourceType: SignalSourceType;
  sourceLabel: string;
  tags: string[];
  note?: string;
  deadline?: string;
  keyDetails?: {
    salaryOrPrice?: string;
    location?: string;
    contact?: string;
    requirements?: string[];
  };
}
