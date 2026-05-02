import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workflowApi } from '../../../api';
import { Workflow } from '../../../types';
import { ArrowLeft, Box, Sparkles, Database } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function WorkflowDetail() {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    if (id) {
      workflowApi.getWorkflowById(id).then(setWorkflow);
    }
  }, [id]);

  if (!workflow) return <div>加载中...</div>;

  return (
    <div className="max-w-5xl">
       <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/workflows" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5"/></Link>
          <h1 className="text-2xl font-bold text-white">工作流详情</h1>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left col - info */}
         <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{workflow.name}</h2>
                    <p className="text-slate-400 text-sm">{workflow.description}</p>
                  </div>
                  <Badge variant="default">{workflow.status}</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                   <div>
                     <div className="text-xs text-slate-500 mb-1">节点数</div>
                     <div className="text-lg font-semibold text-white">{workflow.nodeCount}</div>
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 mb-1">工作流类型</div>
                     <div className="text-lg font-semibold text-white">{workflow.type}</div>
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 mb-1">输出节点</div>
                     <div className="text-sm font-semibold text-slate-300 font-mono truncate">{workflow.outputNodes.join(', ')}</div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> AI 分析摘要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                  基于工作流节点拓扑分析，该工作流主要用于 {workflow.type}。
                  模型依赖明确且参数可控，建议在前端暴露 {workflow.parameterSchema.length} 个核心参数节点（如提示词、长宽、权重）供用户交互。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Database className="w-5 h-5 text-indigo-400" /> 资源依赖检测
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-2">
                   {workflow.resourceDependencies.map(dep => (
                     <li key={dep} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 text-sm">
                       <span className="text-slate-200">{dep}</span>
                       <Badge variant="glass" className="text-green-400">已就绪</Badge>
                     </li>
                   ))}
                 </ul>
              </CardContent>
            </Card>
         </div>

         {/* Right col - Parameter visualizer */}
         <div className="space-y-6">
            <Card className="bg-black/20 border-indigo-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2 text-indigo-400">
                    <Box className="w-5 h-5" /> 暴露参数 (Schema)
                 </CardTitle>
                 <p className="text-xs text-slate-500 mt-1">前端将基于此结构动态渲染表单</p>
              </CardHeader>
              <CardContent className="space-y-4">
                 {workflow.parameterSchema.map(param => (
                   <div key={param.name} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-200 text-sm">{param.label}</span>
                        <Badge variant="outline" className="text-[10px] py-0">{param.type}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">key: {param.name}</div>
                   </div>
                 ))}
              </CardContent>
            </Card>
         </div>
       </div>
    </div>
  );
}
