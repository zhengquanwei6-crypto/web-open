import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { DashboardStats } from '../../types';
import { Users, Activity, Image as ImageIcon, MessageCircle, Server, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">平台数据概览</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 ml:grid-cols-4 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/50 to-transparent border-indigo-500/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-indigo-400 flex items-center gap-2"><Users className="w-4 h-4"/>总用户数</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-white">{stats.totalUsers}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/50 to-transparent border-purple-500/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2"><MessageCircle className="w-4 h-4"/>今日消息数</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-white">{stats.todayChats}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-transparent border-green-500/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2"><ImageIcon className="w-4 h-4"/>今日图像生成</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-white">{stats.todayGenerations}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-900/50 to-transparent border-amber-500/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2"><Activity className="w-4 h-4"/>总角色数</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-white">{stats.totalCharacters}</div></CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-white mt-10 mb-4">系统状态</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6 gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.lmConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <Server className="w-6 h-6" />
            </div>
            <div>
               <div className="text-sm text-slate-400">大语言模型 API</div>
               <div className="font-semibold text-white">{stats.lmConnected ? '已连接 (在线)' : '断开连接'}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6 gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.comfyConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <Box className="w-6 h-6" />
            </div>
            <div>
               <div className="text-sm text-slate-400">ComfyUI 工作流引擎</div>
               <div className="font-semibold text-white">{stats.comfyConnected ? '已连接 (在线)' : '断开连接'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
