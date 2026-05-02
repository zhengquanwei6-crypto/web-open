import { Character } from '../types';
import { mockCharacters } from '../mock/data';
import { delay } from './utils';

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
