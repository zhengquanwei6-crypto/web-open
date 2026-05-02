import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { User } from '../../types';
import { Badge } from '../../components/ui/Badge';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    adminApi.getUsers().then(setUsers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">用户管理</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-black/20 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">头像</th>
              <th className="px-6 py-4">用户名 (ID)</th>
              <th className="px-6 py-4">使用频次</th>
              <th className="px-6 py-4">最后活跃</th>
              <th className="px-6 py-4 text-right">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4"><img src={u.avatar} className="w-8 h-8 rounded-full" /></td>
                <td className="px-6 py-4 font-medium text-slate-200">{u.username} <span className="text-xs text-slate-500 font-mono ml-2">{u.id}</span></td>
                <td className="px-6 py-4">{u.usageCount} 次</td>
                <td className="px-6 py-4">{u.lastLogin}</td>
                <td className="px-6 py-4 text-right">
                  {u.status === 'active' ? <Badge variant="default" className="bg-green-500/20 text-green-400 border-none">活跃</Badge> : <Badge variant="secondary">封禁/休眠</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
