import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { characterApi } from '../../../api';
import { Character } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export default function AdminCharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    characterApi.getCharacters().then(setCharacters);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">角色管理</h1>
        <Button asChild>
          <Link to="/admin/characters/create"><Plus className="w-4 h-4 mr-2" /> 新建角色</Link>
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-black/20 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">头像</th>
              <th className="px-6 py-4">角色名</th>
              <th className="px-6 py-4">模型/引擎</th>
              <th className="px-6 py-4">热度</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {characters.map(char => (
              <tr key={char.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <img src={char.avatar} className="w-10 h-10 rounded-lg object-cover" />
                </td>
                <td className="px-6 py-4 font-medium text-slate-200">{char.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                     <Badge variant="outline" className="w-fit">{char.modelId}</Badge>
                     {(char.workflowIds || []).map(wId => (
                       <Badge key={wId} variant="secondary" className="w-fit border-purple-500/50 text-purple-400">{wId}</Badge>
                     ))}
                  </div>
                </td>
                <td className="px-6 py-4">{char.hotness}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="text-indigo-400 hover:text-indigo-300"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
