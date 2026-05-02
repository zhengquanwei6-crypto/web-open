import React from 'react';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function Profile() {
  const { currentUser } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">个人工作台</h1>
      
      <div className="flex items-center gap-6 mb-8">
        <img src={currentUser?.avatar} alt="avatar" className="w-24 h-24 rounded-full ring-4 ring-white/10" />
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{currentUser?.name}</h2>
          <div className="text-purple-400 text-sm font-medium">✨ PRO 会员</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>累计对话</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-indigo-400">1,205</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>生成图片</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-purple-400">84</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>收藏角色</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-green-400">12</div></CardContent>
        </Card>
      </div>
    </div>
  );
}
