import { Character, Workflow, ModelConfig, ComfyResource, ChatMessage, User, DashboardStats } from '../types';
import { mockCharacters, mockWorkflows, mockModels, mockResources, mockChats, mockUsers, mockDashboardStats } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const characterApi = {
  getCharacters: async (): Promise<Character[]> => {
    await delay(500);
    return mockCharacters;
  },
  getCharacterById: async (id: string): Promise<Character | undefined> => {
    await delay(300);
    return mockCharacters.find(c => c.id === id);
  },
  createCharacter: async (data: Partial<Character>): Promise<Character> => {
    await delay(800);
    const newChar = { ...data, id: `c${Date.now()}` } as Character;
    mockCharacters.push(newChar);
    return newChar;
  },
  updateCharacter: async (id: string, data: Partial<Character>): Promise<Character> => {
    await delay(500);
    return { ...data, id } as Character;
  },
  deleteCharacter: async (id: string): Promise<boolean> => {
    await delay(400);
    return true;
  }
};

export const chatApi = {
  getChatHistory: async (characterId: string): Promise<ChatMessage[]> => {
    await delay(300);
    return mockChats[characterId] || [];
  },
  sendMessage: async (characterId: string, content: string): Promise<ChatMessage> => {
    await delay(1500); // Simulate AI thinking
    
    // Hardcode a dynamic AI response based on character
    const char = mockCharacters.find(c => c.id === characterId);
    let reply = `这是来自 ${char?.name || 'AI'} 的模拟回复。我听到了你说：${content}`;
    
    if (char && char.capabilities.includes('文生图')) {
       reply = `这听起来像是一个绘画请求，请在右侧面板配置工作流参数后执行生成。`;
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'ai',
      content: reply,
      timestamp: new Date().toISOString()
    };
  },
  regenerateMessage: async (characterId: string, messageId: string): Promise<ChatMessage> => {
    await delay(1500);
    return {
      id: `msg-${Date.now()}`,
      role: 'ai',
      content: `这是重新生成的模拟回复。`,
      timestamp: new Date().toISOString()
    };
  },
  clearChatHistory: async (characterId: string): Promise<boolean> => {
    await delay(300);
    mockChats[characterId] = [];
    return true;
  }
};

export const workflowApi = {
  getWorkflows: async (): Promise<Workflow[]> => {
    await delay(400);
    return mockWorkflows;
  },
  getWorkflowById: async (id: string): Promise<Workflow | undefined> => {
    await delay(300);
    return mockWorkflows.find(w => w.id === id);
  },
  uploadWorkflow: async (file: File): Promise<{ success: boolean; data: any }> => {
    await delay(2000);
    return {
      success: true,
      data: {
        type: 'Image Workflow',
        nodeCount: Math.floor(Math.random() * 50) + 10,
        detectedDependencies: ['Model A', 'Lora B']
      }
    };
  },
  runWorkflow: async (workflowId: string, params: any): Promise<any> => {
    await delay(3000); // Simulate ComfyUI generation
    return {
      success: true,
      images: [
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=500&q=80'
      ],
      message: '生成成功'
    };
  }
};

export const modelApi = {
  getModels: async (): Promise<ModelConfig[]> => {
    await delay(300);
    return mockModels;
  },
  testModelConnection: async (id: string): Promise<boolean> => {
    await delay(1000);
    return true;
  }
};

export const comfyApi = {
  getComfyResources: async (): Promise<ComfyResource[]> => {
    await delay(400);
    return mockResources;
  },
  testComfyConnection: async (): Promise<boolean> => {
    await delay(1500);
    return true;
  },
  syncComfyResources: async (): Promise<{ count: number }> => {
    await delay(2500);
    return { count: mockResources.length };
  }
};

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
  }
};
