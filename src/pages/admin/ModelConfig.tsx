import React, { useEffect, useState } from 'react';
import { ModelConfig as ModelType } from '../../types';
import { modelApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle2, Server, Plus } from 'lucide-react';

export default function ModelConfig() {
  const [models, setModels] = useState<ModelType[]>([]);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    modelApi.getModels().then(setModels);
  }, []);

  const handleTest = async (id: string) => {
    setTesting(id);
    await modelApi.testModelConnection(id);
    setTesting(null);
    alert('连接测试成功 (Mock)');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">大语言模型配置</h1>
         <Button><Plus className="w-4 h-4 mr-2" /> 新增模型</Button>
      </div>

      <div className="grid gap-6">
        {models.map(model => (
          <Card key={model.id}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <Server className="w-8 h-8 text-indigo-400" />
               </div>
               <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{model.name}</h3>
                    {model.isDefault && <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30">当前默认</span>}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-400">
                    <div><span className="block text-slate-500 text-xs">厂商</span>{model.type}</div>
                    <div><span className="block text-slate-500 text-xs">模型 ID</span>{model.modelId}</div>
                    <div><span className="block text-slate-500 text-xs">Max Tokens</span>{model.maxTokens}</div>
                    <div><span className="block text-slate-500 text-xs">Temperature</span>{model.temperature}</div>
                  </div>
                  <div className="pt-2">
                    <Input value={model.apiBaseUrl} readOnly className="h-8 text-xs font-mono bg-black/50 text-slate-500" />
                  </div>
               </div>
               <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                 <Button variant="outline" onClick={() => handleTest(model.id)} disabled={testing === model.id}>
                    {testing === model.id ? '测试中...' : <><CheckCircle2 className="w-4 h-4 mr-2" /> 测试连接</>}
                 </Button>
                 {!model.isDefault && <Button variant="ghost" className="text-slate-400">设为默认</Button>}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
