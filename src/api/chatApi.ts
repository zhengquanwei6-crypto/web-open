import { ChatMessage } from '../types';
import { mockChats, mockCharacters } from '../mock/data';
import { delay } from './utils';

export const chatApi = {
  getChatHistory: async (characterId: string): Promise<ChatMessage[]> => {
    await delay(300);
    return mockChats[characterId] || [];
  },
  sendMessage: async (characterId: string, content: string): Promise<ChatMessage> => {
    await delay(1500);
    
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
