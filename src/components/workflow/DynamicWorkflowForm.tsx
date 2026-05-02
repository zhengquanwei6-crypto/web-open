import React, { useState, useEffect } from 'react';
import { WorkflowParameter, ComfyResource } from '../../types';
import { comfyApi } from '../../api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Save, UploadCloud } from 'lucide-react';

interface DynamicWorkflowFormProps {
  parameters: WorkflowParameter[];
  onSubmit: (values: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export function DynamicWorkflowForm({ parameters, onSubmit, isSubmitting }: DynamicWorkflowFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [resources, setResources] = useState<ComfyResource[]>([]);

  useEffect(() => {
    // Check if we need to fetch resources
    const needsResources = parameters.some(p => ['checkpoint', 'lora', 'vae', 'controlnet'].includes(p.type));
    if (needsResources) {
      comfyApi.getComfyResources().then(setResources).catch(console.error);
    }
  }, [parameters]);

  useEffect(() => {
    // Initialize default values
    const initialValues: Record<string, any> = {};
    parameters.forEach(p => {
      if (p.defaultValue !== undefined) {
        initialValues[p.name] = p.defaultValue;
      }
    });
    setValues(initialValues);
  }, [parameters]);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomSeed = (name: string) => {
    handleChange(name, Math.floor(Math.random() * 999999999));
  };

  const renderField = (param: WorkflowParameter) => {
    switch (param.type) {
      case 'textarea':
        return (
          <Textarea
            value={values[param.name] || ''}
            onChange={(e) => handleChange(param.name, e.target.value)}
            placeholder={param.label}
            className="min-h-[80px]"
          />
        );
      case 'text':
        return (
          <Input
            type="text"
            value={values[param.name] || ''}
            onChange={(e) => handleChange(param.name, e.target.value)}
            placeholder={param.label}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={values[param.name] || ''}
            onChange={(e) => handleChange(param.name, e.target.value)}
            min={param.min}
            max={param.max}
            step={param.step}
          />
        );
      case 'slider':
        return (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={param.min || 0}
              max={param.max || 100}
              step={param.step || 1}
              value={values[param.name] || 0}
              onChange={(e) => handleChange(param.name, Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="text-sm font-mono text-slate-400 w-12">{values[param.name] || 0}</span>
          </div>
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!values[param.name]}
              onChange={(e) => handleChange(param.name, e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">启用</span>
          </label>
        );
      case 'select':
        return (
          <select
            value={values[param.name] || ''}
            onChange={(e) => handleChange(param.name, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="">请选择...</option>
            {param.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'image':
        return (
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
            {values[param.name] ? (
              <div className="text-sm text-indigo-400 font-medium break-all">
                已选择文件 (模拟)
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                <UploadCloud className="w-8 h-8 text-slate-500" />
                <span>点击或拖拽上传图片</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Simulate file path for mockup
                  handleChange(param.name, file.name);
                }
              }}
            />
          </div>
        );
      case 'seed':
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              value={values[param.name] || ''}
              onChange={(e) => handleChange(param.name, e.target.value)}
              placeholder="0 = 随机"
              className="flex-1"
            />
            <Button variant="outline" onClick={() => handleRandomSeed(param.name)}>
              随机
            </Button>
          </div>
        );
      case 'checkpoint':
      case 'lora':
      case 'vae':
      case 'controlnet':
        const filteredRes = resources.filter(r => r.type === param.type);
        return (
          <select
            value={values[param.name] || ''}
            onChange={(e) => handleChange(param.name, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="">{`选择 ${param.type}`}</option>
            {filteredRes.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        );
      default:
        return <div className="text-red-400 text-xs">不支持的字段类型: {param.type}</div>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parameters.map(param => (
        <div key={param.name}>
          <label className="text-xs text-slate-400 mb-1.5 block">
            {param.label}
            {param.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {renderField(param)}
        </div>
      ))}
      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isSubmitting}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? '执行中...' : '启动工作流'}
      </Button>
    </form>
  );
}
