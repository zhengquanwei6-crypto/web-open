import { ModelConfig } from '../types';
import { mockModels } from '../mock/data';
import { delay } from './utils';

export const modelApi = {
  getModels: async (): Promise<ModelConfig[]> => {
    await delay(300);
    return mockModels;
  },
  testModelConnection: async (id: string): Promise<boolean> => {
    await delay(1000);
    return true;
  },
  createModel: async (data: Partial<ModelConfig>): Promise<ModelConfig> => {
    await delay(500);
    const newModel = { ...data, id: `m${Date.now()}` } as ModelConfig;
    mockModels.push(newModel);
    return newModel;
  },
  updateModel: async (id: string, data: Partial<ModelConfig>): Promise<ModelConfig> => {
    await delay(500);
    return { ...data, id } as ModelConfig;
  },
  setDefaultModel: async (id: string): Promise<void> => {
    await delay(300);
    mockModels.forEach(m => m.isDefault = m.id === id);
  }
};
