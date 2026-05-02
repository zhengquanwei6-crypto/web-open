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
    // 模拟解析过程，尝试解析JSON以获取真实的nodeCount等（可根据内容进行分析）
    let nodeCount = 30;
    try {
      const data = JSON.parse(fileContent);
      if (data && typeof data === 'object') {
         nodeCount = Object.keys(data).length || 30;
      }
    } catch(e) {}
    
    return {
      success: true,
      data: {
        type: '图片生成 (Image Generation)',
        nodeCount: nodeCount,
        inputParamsCount: 4,
        parameterSchema: [
          { name: 'prompt', type: 'textarea', label: '正向提示词' },
          { name: 'seed', type: 'seed', label: '随机种子' },
          { name: 'checkpoint', type: 'checkpoint', label: '大模型' }
        ],
        detectedDependencies: ['GhostMix', 'Cyberpunk Lora'],
        outputNodes: ['SaveImage_1', 'PreviewImage_3']
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
