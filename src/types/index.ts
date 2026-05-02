export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  backgroundIntro: string;
  personality: string;
  greeting: string;
  tags: string[];
  capabilities: string[];
  modelId: string;
  workflowIds?: string[];
  hotness: number;
  exampleDialogues: { user: string; ai: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  images?: string[];
  workflowResult?: any;
}

export interface Workflow {
  id: string;
  name: string;
  type: string;
  description: string;
  nodeCount: number;
  parameterSchema: WorkflowParameter[];
  resourceDependencies: string[];
  outputNodes: string[];
  status: 'active' | 'inactive';
}

export type WorkflowParameterType = 'text' | 'textarea' | 'number' | 'slider' | 'boolean' | 'select' | 'image' | 'seed' | 'checkpoint' | 'lora' | 'vae' | 'controlnet';

export interface WorkflowParameter {
  name: string;
  label: string;
  type: WorkflowParameterType;
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  type: string;
  apiBaseUrl: string;
  apiKey: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface ComfyResource {
  id: string;
  name: string;
  type: 'checkpoint' | 'lora' | 'vae' | 'controlnet' | 'embedding' | 'upscale';
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalUsers: number;
  totalCharacters: number;
  todayChats: number;
  todayGenerations: number;
  lmConnected: boolean;
  comfyConnected: boolean;
  activeWorkflows: number;
}

export interface ComfyConfig {
  baseUrl: string;
  lastChecked?: string;
  status: 'active' | 'inactive';
}

export interface ChatLog {
  id: string;
  characterId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'active' | 'inactive';
  usageCount: number;
  lastLogin: string;
}
