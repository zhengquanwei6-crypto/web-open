import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Character } from '../../types';
import { characterApi } from '../../api';
import { ArrowLeft, MessageSquarePlus, Sparkles, Cpu, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (id) {
      characterApi.getCharacterById(id).then(data => {
        if (data) setCharacter(data);
      });
    }
  }, [id]);

  if (!character) return <div className="p-8 text-center text-slate-400">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/characters" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回广场
      </Link>
      
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="shrink-0 flex flex-col items-center">
            <img src={character.avatar} alt={character.name} className="w-48 h-48 rounded-3xl object-cover shadow-2xl ring-4 ring-white/10" />
            <Button size="lg" className="w-full mt-6 shadow-lg shadow-indigo-500/20" asChild>
               <Link to={`/chat/${character.id}`}>
                 <MessageSquarePlus className="w-5 h-5 mr-2" /> 开始对话
               </Link>
            </Button>
          </div>
          
          <div className="flex-1 text-slate-300 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
              <p className="text-xl text-indigo-400 font-medium">{character.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {character.tags.map(t => <Badge key={t} variant="glass">{t}</Badge>)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-slate-500 text-xs font-semibold mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> 绑定模型
                </div>
                <div className="text-white font-medium">{character.modelId === 'm1' ? 'GPT-4o' : 'Claude 3.5'}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-slate-500 text-xs font-semibold mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> 绑定工作流
                </div>
                <div className="text-white font-medium">{character.workflowId || '无关联'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> 特长与设定
              </h3>
              <div className="space-y-4 text-sm leading-relaxed">
                <p><span className="text-slate-500 block mb-1">背景故事</span>{character.backgroundIntro}</p>
                <p><span className="text-slate-500 block mb-1">性格设定</span>{character.personality}</p>
                <p><span className="text-slate-500 block mb-1">核心能力</span>{character.capabilities.join(' / ')}</p>
                <p><span className="text-slate-500 block mb-1">默认开场白</span>"{character.greeting}"</p>
              </div>
            </div>
            
            {(character.exampleDialogues || []).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">示例对话</h3>
                <div className="bg-black/30 rounded-2xl p-4 space-y-3 border border-white/10 text-sm">
                  {character.exampleDialogues.map((dialog, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="text-indigo-400">User: <span className="text-slate-300">{dialog.user}</span></div>
                      <div className="text-purple-400">AI: <span className="text-slate-300">{dialog.ai}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
