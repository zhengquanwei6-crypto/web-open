import { ComfyResource, ComfyConfig } from '../types';
import { mockResources } from '../mock/data';
import { delay } from './utils';

let mockComfyConfig: ComfyConfig = {
  baseUrl: 'http://127.0.0.1:8188',
  status: 'active',
  lastChecked: '2026-05-02 00:00:00',
  resourceCount: mockResources.length
};

export const comfyApi = {
  getComfyResources: async (): Promise<ComfyResource[]> => {
    await delay(400);
    return mockResources;
  },
  testComfyConnection: async (): Promise<boolean> => {
    await delay(1500);
    mockComfyConfig.status = 'active';
    mockComfyConfig.lastChecked = new Date().toLocaleString();
    return true;
  },
  syncComfyResources: async (): Promise<{ count: number }> => {
    await delay(2500);
    return { count: mockResources.length };
  },
  getComfyConfig: async (): Promise<ComfyConfig> => {
    await delay(300);
    return mockComfyConfig;
  },
  updateComfyConfig: async (data: Partial<ComfyConfig>): Promise<ComfyConfig> => {
    await delay(500);
    mockComfyConfig = { ...mockComfyConfig, ...data };
    return mockComfyConfig;
  }
};
