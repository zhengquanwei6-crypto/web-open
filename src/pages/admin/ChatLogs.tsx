import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function ChatLogs() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">全站对话记录追踪 (Mock)</h1>
      <Card>
        <CardContent className="p-6 text-center text-slate-500 py-20">
           由于涉及隐私，当前仅展示数据脱敏后的宏观统计或需最高权限解密查看内容。
           (此页面为占位)
        </CardContent>
      </Card>
    </div>
  );
}
