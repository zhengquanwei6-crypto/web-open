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
    let nodeCount = 0;
    let parameterSchema: WorkflowParameter[] = [];
    let detectedDependencies: string[] = [];
    let outputNodes: string[] = [];
    
    try {
      const data = JSON.parse(fileContent);
      if (data && typeof data === 'object') {
         // ComfyUI workflow format usually has either root nodes or a flat Object map (API format)
         const nodes = data.nodes || data; // Handle both UI json and API json roughly
         if(Array.isArray(nodes)) {
            // UI Format roughly
            nodeCount = nodes.length;
            // Simplified parsing for Array format...
         } else {
            // API Format (Record<string, { class_type, inputs }>)
            const keys = Object.keys(nodes);
            nodeCount = keys.length;
            keys.forEach(key => {
               const node = nodes[key];
               if(node && typeof node === 'object' && node.class_type && node.inputs) {
                  const cType = node.class_type;
                  const inputs = node.inputs;
                  
                  if (cType === 'CLIPTextEncode') {
                     parameterSchema.push({ name: `prompt_${key}`, label: '正向提示词', type: 'textarea', required: true });
                  } else if (cType === 'KSampler') {
                     parameterSchema.push({ name: `seed_${key}`, label: '随机种子', type: 'seed', required: false });
                     if(inputs.steps) parameterSchema.push({ name: `steps_${key}`, label: '采样步数', type: 'slider', max: 150, min: 1, step: 1, defaultValue: inputs.steps, required: false });
                     if(inputs.cfg) parameterSchema.push({ name: `cfg_${key}`, label: 'CFG Scale', type: 'slider', max: 30, min: 1, step: 0.5, defaultValue: inputs.cfg, required: false });
                  } else if (cType === 'CheckpointLoaderSimple') {
                     parameterSchema.push({ name: `ckpt_${key}`, label: '大模型', type: 'checkpoint', required: true });
                     if(typeof inputs.ckpt_name === 'string') detectedDependencies.push(inputs.ckpt_name);
                  } else if (cType === 'LoraLoader') {
                     parameterSchema.push({ name: `lora_${key}`, label: 'Lora 模型', type: 'lora', required: false });
                     if(typeof inputs.lora_name === 'string') detectedDependencies.push(inputs.lora_name);
                  } else if (cType === 'VAELoader') {
                     parameterSchema.push({ name: `vae_${key}`, label: 'VAE', type: 'vae', required: false });
                     if(typeof inputs.vae_name === 'string') detectedDependencies.push(inputs.vae_name);
                  } else if (cType === 'EmptyLatentImage') {
                     if(inputs.width) parameterSchema.push({ name: `width_${key}`, label: '宽度', type: 'number', defaultValue: inputs.width, required: true });
                     if(inputs.height) parameterSchema.push({ name: `height_${key}`, label: '高度', type: 'number', defaultValue: inputs.height, required: true });
                  } else if (cType === 'LoadImage') {
                     parameterSchema.push({ name: `image_${key}`, label: '上传图片', type: 'image', required: true });
                  } else if (cType === 'SaveImage' || cType === 'PreviewImage') {
                     outputNodes.push(`${cType}_${key}`);
                  }
               }
            });
         }
      }
    } catch(e) {
       console.error("Parse JSON error", e);
    }
    
    // Fallback if no schema generated
    if(parameterSchema.length === 0) {
       parameterSchema = [
         { name: 'prompt', type: 'textarea', label: '正向提示词', required: true },
         { name: 'seed', type: 'seed', label: '随机种子', required: false }
       ];
    }
    if(outputNodes.length === 0) outputNodes = ['SaveImage_1'];
    
    // De-duplicate array values
    detectedDependencies = Array.from(new Set(detectedDependencies));
    
    return {
      success: true,
      data: {
        type: '自定义解析图像流',
        nodeCount,
        inputParamsCount: parameterSchema.length,
        parameterSchema,
        detectedDependencies,
        outputNodes
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
