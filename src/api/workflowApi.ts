import { Workflow, WorkflowParameter } from '../types';
import { mockWorkflows } from '../mock/data';
import { delay } from './utils';

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
    await delay(3000);
    return {
      success: true,
      images: [
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=500&q=80'
      ],
      message: '生成成功'
    };
  },
  analyzeWorkflow: async (fileContent: string): Promise<any> => {
    await delay(1000);
    return {
      success: true,
      data: {
        type: 'Image Generation',
        nodeCount: 30,
        detectedDependencies: ['GhostMix', 'Cyberpunk Lora']
      }
    };
  },
  getWorkflowSchema: async (id: string): Promise<{ parameterSchema: WorkflowParameter[], resourceDependencies: string[], outputNodes: string[] }> => {
    await delay(500);
    const wf = mockWorkflows.find(w => w.id === id);
    if (!wf) throw new Error('Workflow not found');
    return {
      parameterSchema: wf.parameterSchema,
      resourceDependencies: wf.resourceDependencies,
      outputNodes: wf.outputNodes
    };
  }
};
