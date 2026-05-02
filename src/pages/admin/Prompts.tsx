import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export default function Prompts() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">提示词库与底层系统指令</h1>
      <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>全局 System Prompt (大模型前置约束)</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <Textarea 
               defaultValue="你是一个虚拟角色扮演AI。你必须严格遵守分配给你的性格设定，不得承认自己是AI..." 
               className="font-mono text-sm min-h-[150px]"
             />
             <Button>保存更新</Button>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
