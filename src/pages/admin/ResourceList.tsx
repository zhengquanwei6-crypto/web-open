import React, { useEffect, useState } from 'react';
import { comfyApi } from '../../api';
import { ComfyResource } from '../../types';
import { HardDrive, RefreshCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export default function ResourceList() {
  const [resources, setResources] = useState<ComfyResource[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    comfyApi.getComfyResources().then(setResources);
  }, []);

  const filtered = resources.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-indigo-400" /> 资源库
          </h1>
          <div className="flex gap-4">
             <Input 
               placeholder="搜索资源..." 
               value={search} onChange={e => setSearch(e.target.value)} 
               className="w-64"
             />
             <Button variant="outline"><RefreshCcw className="w-4 h-4 mr-2" /> 强制同步</Button>
          </div>
       </div>

       <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-black/20 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">模型名称</th>
                <th className="px-6 py-4">类型 (Type)</th>
                <th className="px-6 py-4">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(res => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{res.name}</td>
                  <td className="px-6 py-4">
                     <Badge variant="glass" className="uppercase">{res.type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                     <span className="flex items-center gap-2 text-green-400 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> 就绪
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
}
