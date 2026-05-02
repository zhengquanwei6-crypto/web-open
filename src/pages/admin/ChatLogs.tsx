import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { adminApi, characterApi } from '../../api';
import { ChatLog, Character, User } from '../../types';
import { Search, Loader2, Trash } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ChatLogs() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logsData, charsData, usersData] = await Promise.all([
         adminApi.getChatLogs(1, 100),
         characterApi.getCharacters(),
         adminApi.getUsers()
      ]);
      setLogs(logsData.logs);
      setTotal(logsData.total);
      setCharacters(charsData);
      setUsers(usersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getCharName = (id: string) => characters.find(c => c.id === id)?.name || id;
  const getUserName = (id: string) => users.find(u => u.id === id)?.username || id;

  const filteredLogs = logs.filter(log => {
      if (selectedCharacter && log.characterId !== selectedCharacter) return false;
      if (selectedUser && log.userId !== selectedUser) return false;
      if (searchTerm && !log.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
  });

  const handleDelete = (id: string) => {
     if(window.confirm('确定删除该记录吗？')) {
        setLogs(prev => prev.filter(l => l.id !== id));
     }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">全站对话记录追踪</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="搜索对话内容..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
         >
            <option value="">所有角色</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
         </select>
         <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
         >
            <option value="">所有用户</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
         </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4">时间</th>
                      <th className="px-6 py-4">用户</th>
                      <th className="px-6 py-4">角色</th>
                      <th className="px-6 py-4">内容</th>
                      <th className="px-6 py-4">状态</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{log.timestamp}</td>
                        <td className="px-6 py-4">{getUserName(log.userId)}</td>
                        <td className="px-6 py-4">{getCharName(log.characterId)}</td>
                        <td className="px-6 py-4 max-w-sm truncate" title={log.content}>{log.content}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs ${
                             (log as any).status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                           }`}>
                             {(log as any).status || 'success'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
			   <Button variant="ghost" size="sm" onClick={() => alert(log.content)}>详情</Button>
                           <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDelete(log.id)}>
                             <Trash className="w-4 h-4"/>
                           </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500 block w-full">暂无记录</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
