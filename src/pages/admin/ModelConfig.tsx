import React, { useEffect, useState } from 'react';
import { ModelConfig as ModelType } from '../../types';
import { modelApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle2, Server, Plus, X } from 'lucide-react';

export default function ModelConfig() {
  const [models, setModels] = useState<ModelType[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Partial<ModelType> | null>(null);

  const loadModels = () => {
     modelApi.getModels().then(setModels);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleTest = async (id: string) => {
    setTesting(id);
    await modelApi.testModelConnection(id);
    setTesting(null);
    alert('连接测试成功 (Mock)');
  };

  const handleSetDefault = async (id: string) => {
    await modelApi.setDefaultModel(id);
    loadModels();
  };

  const openAddModal = () => {
    setEditingModel({
       name: '', type: 'OpenAI', apiBaseUrl: '', apiKey: '', modelId: '', temperature: 0.7, maxTokens: 2048, topP: 1
    });
    setModalOpen(true);
  };

  const openEditModal = (model: ModelType) => {
    setEditingModel({ ...model });
    setModalOpen(true);
  };

  const handleSave = async () => {
     if(!editingModel) return;
     if(editingModel.id) {
        await modelApi.updateModel(editingModel.id, editingModel);
     } else {
        await modelApi.createModel(editingModel);
     }
     setModalOpen(false);
     loadModels();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">大语言模型配置</h1>
         <Button onClick={openAddModal}><Plus className="w-4 h-4 mr-2" /> 新增模型</Button>
      </div>

      <div className="grid gap-6">
        {models.map(model => (
          <Card key={model.id}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center cursor-pointer hover:bg-white/[0.02]" onClick={() => openEditModal(model)}>
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
                    <Input value={model.apiBaseUrl} readOnly className="h-8 text-xs font-mono bg-black/50 text-slate-500" onClick={e => e.stopPropagation()}/>
                  </div>
               </div>
               <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto" onClick={e => e.stopPropagation()}>
                 <Button variant="outline" onClick={() => handleTest(model.id)} disabled={testing === model.id}>
                    {testing === model.id ? '测试中...' : <><CheckCircle2 className="w-4 h-4 mr-2" /> 测试连接</>}
                 </Button>
                 {!model.isDefault && <Button variant="ghost" className="text-slate-400" onClick={() => handleSetDefault(model.id)}>设为默认</Button>}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modalOpen && editingModel && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-xl bg-[#0a0a0f] border-white/10">
               <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">{editingModel.id ? '编辑模型' : '新增模型'}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </Button>
               </div>
               <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs text-slate-400 mb-1 block">模型名称</label>
                       <Input value={editingModel.name || ''} onChange={e => setEditingModel({...editingModel, name: e.target.value})} placeholder="例如: GPT-4" />
                     </div>
                     <div>
                       <label className="text-xs text-slate-400 mb-1 block">厂商</label>
                       <select value={editingModel.type || ''} onChange={e => setEditingModel({...editingModel, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                          <option value="OpenAI">OpenAI</option>
                          <option value="Anthropic">Anthropic</option>
                          <option value="Google">Google</option>
                          <option value="Local">Local (Ollama/VLLM)</option>
                       </select>
                     </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">API Base URL</label>
                    <Input value={editingModel.apiBaseUrl || ''} onChange={e => setEditingModel({...editingModel, apiBaseUrl: e.target.value})} placeholder="https://api.openai.com/v1" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">API Key (Mock 环境不会保存真实Key)</label>
                    <Input type="password" value={editingModel.apiKey || ''} onChange={e => setEditingModel({...editingModel, apiKey: e.target.value})} placeholder="sk-..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Model ID</label>
                    <Input value={editingModel.modelId || ''} onChange={e => setEditingModel({...editingModel, modelId: e.target.value})} placeholder="gpt-4o" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                       <label className="text-xs text-slate-400 mb-1 block">Temperature</label>
                       <Input type="number" step="0.1" value={editingModel.temperature || 0} onChange={e => setEditingModel({...editingModel, temperature: Number(e.target.value)})} />
                     </div>
                     <div>
                       <label className="text-xs text-slate-400 mb-1 block">Max Tokens</label>
                       <Input type="number" value={editingModel.maxTokens || 0} onChange={e => setEditingModel({...editingModel, maxTokens: Number(e.target.value)})} />
                     </div>
                     <div>
                       <label className="text-xs text-slate-400 mb-1 block">Top P</label>
                       <Input type="number" step="0.1" value={editingModel.topP || 0} onChange={e => setEditingModel({...editingModel, topP: Number(e.target.value)})} />
                     </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-4">
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>取消</Button>
                    <Button onClick={handleSave}>保存配置</Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      )}
    </div>
  );
}
