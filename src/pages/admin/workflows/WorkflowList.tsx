import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workflowApi } from '../../../api';
import { Workflow } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Plus, Settings2, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    workflowApi.getWorkflows().then(setWorkflows);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">工作流管理</h1>
        <Button asChild>
          <Link to="/admin/workflows/upload"><Plus className="w-4 h-4 mr-2" /> 上传工作流</Link>
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-black/20 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">名称</th>
              <th className="px-6 py-4">类型</th>
              <th className="px-6 py-4">节点数</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {workflows.map(wf => (
              <tr key={wf.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{wf.id}</td>
                <td className="px-6 py-4 font-medium text-slate-200">{wf.name}</td>
                <td className="px-6 py-4"><Badge variant="glass">{wf.type}</Badge></td>
                <td className="px-6 py-4">{wf.nodeCount}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="text-indigo-400 hover:text-indigo-300" asChild>
                    <Link to={`/admin/workflows/${wf.id}`}><Settings2 className="w-4 h-4" /></Link>
                  </Button>
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
