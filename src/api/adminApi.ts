import { DashboardStats, User, Character, ChatLog } from '../types';
import { mockDashboardStats, mockUsers } from '../mock/data';
import { delay } from './utils';

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return mockDashboardStats;
  },
  getUsers: async (): Promise<User[]> => {
    await delay(400);
    return mockUsers;
  },
  generateCharacterWithAI: async (prompt: string): Promise<Partial<Character>> => {
    await delay(2500);
    return {
      name: 'AI生成的角色',
      description: '根据您的提示词自动生成的背景。',
      personality: '智能、多变',
      greeting: '你好，我是根据你的想法诞生的虚拟生命。'
    };
  },
  getChatLogs: async (page = 1, limit = 20): Promise<{ logs: ChatLog[], total: number }> => {
    await delay(500);
    return {
      logs: [],
      total: 0
    };
  },
  analyzeWorkflowWithAI: async (workflowContent: string): Promise<any> => {
    await delay(3000);
    return {
      success: true,
      analysis: 'This workflow generates anime-styled images. It has basic text and image components.'
    };
  }
};
