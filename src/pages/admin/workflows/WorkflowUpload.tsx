import React, { useState } from 'react';
import { workflowApi } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { UploadCloud, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkflowUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const nav = useNavigate();

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      await processFile(file);
    } else {
      alert('请上传 .json 文件');
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    const res = await workflowApi.uploadWorkflow(file);
    setResult(res.data);
    setIsUploading(false);
  };

  return (
    <div className="max-w-3xl">
       <h1 className="text-2xl font-bold text-white mb-6">解析与上传工作流</h1>
       
       {!result ? (
        <div 
          onDragOver={e => e.preventDefault()} 
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-white/20 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <UploadCloud className={`w-16 h-16 text-indigo-500 mb-6 ${isUploading ? 'animate-bounce' : ''}`} />
          <div className="text-xl font-bold text-white mb-2">
             {isUploading ? '正在解析 API Format...' : '拖拽 ComfyUI JSON 文件至此处'}
          </div>
          <p className="text-slate-400 text-sm">
             支持标准 ComfyUI Save (API Format) 工作流格式。系统将自动提取依赖和节点。
          </p>
        </div>
       ) : (
         <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-4 text-green-400 mb-8 pb-8 border-b border-white/5">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                 <h2 className="text-xl font-bold">解析成功</h2>
                 <p className="text-sm text-slate-400">已成功提取工作流参数和资源信息</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-sm text-slate-300">
               <div>
                 <div className="text-slate-500 mb-1">工作流类型</div>
                 <div className="font-semibold text-white text-base">{result.type}</div>
               </div>
               <div>
                 <div className="text-slate-500 mb-1">包含节点数</div>
                 <div className="font-semibold text-white text-base">{result.nodeCount}</div>
               </div>
               <div className="col-span-2">
                 <div className="text-slate-500 mb-2">检测到的资源依赖</div>
                 <div className="flex flex-wrap gap-2">
                    {result.detectedDependencies.map((dep: string) => (
                      <span key={dep} className="px-3 py-1 bg-white/10 rounded-lg">{dep}</span>
                    ))}
                 </div>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
              <Button onClick={() => setResult(null)} variant="outline">重新上传</Button>
              <Button onClick={() => nav('/admin/workflows')} className="flex-1">
                 保存并进入详情图谱 <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
         </div>
       )}
    </div>
  );
}
