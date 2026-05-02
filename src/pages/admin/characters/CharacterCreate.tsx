import React, { useState } from 'react';
import { adminApi } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Sparkles, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CharacterCreate() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    greeting: ''
  });
  const nav = useNavigate();

  const handleAIGenerate = async () => {
    if(!prompt) return;
    setIsGenerating(true);
    const result = await adminApi.generateCharacterWithAI(prompt);
    setFormData(prev => ({ ...prev, ...result }));
    setIsGenerating(false);
  };

  const handleSave = () => {
    // mock save
    nav('/admin/characters');
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">创建角色</h1>
      
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5"/> AI 辅助生成设定
        </h3>
        <div className="flex gap-4">
          <Input 
            value={prompt} onChange={e => setPrompt(e.target.value)} 
            placeholder="描述你想要的角色，例如：一个赛博朋克风格的医生..." 
            className="border-indigo-500/30"
          />
          <Button onClick={handleAIGenerate} disabled={isGenerating || !prompt}>
            {isGenerating ? '生成中...' : '生成'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">角色名称</label>
          <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">角色简介</label>
          <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[80px]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">性格设定</label>
          <Textarea value={formData.personality} onChange={e => setFormData({...formData, personality: e.target.value})} className="min-h-[100px]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">开场白</label>
          <Textarea value={formData.greeting} onChange={e => setFormData({...formData, greeting: e.target.value})} className="min-h-[100px]" />
        </div>
        
        <Button onClick={handleSave} className="w-full" size="lg"><Save className="w-4 h-4 mr-2" /> 保存角色</Button>
      </div>
    </div>
  );
}
