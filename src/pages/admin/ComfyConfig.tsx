import React, { useState } from 'react';
import { comfyApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Box, Server, RefreshCcw, CheckCircle2 } from 'lucide-react';

export default function ComfyConfig() {
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await comfyApi.testComfyConnection();
    setTesting(false);
    alert('ComfyUI 连接正常 (Mock)');
  };

  const handleSync = async () => {
    setSyncing(true);
    const res = await comfyApi.syncComfyResources();
    setSyncing(false);
    alert(`同步成功，发现 ${res.count} 个资源`);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">ComfyUI / 康复UI 配置</h1>
      
      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm p-4 rounded-xl mb-8 leading-relaxed">
        <strong>架构说明：</strong> ComfyUI 部署在远程 Cloud Studio 中。前端不直接与 ComfyUI 通信，请在此处配置通过 Cloud Studio 端口外链暴露的 API 地址。 后端服务将通过此地址与 ComfyUI 进行交互。
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Box className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">ComfyUI API Base URL (外链地址)</label>
                <Input defaultValue="https://xxxxx-8188.asia-east1.run.app" />
                <p className="text-xs text-slate-500 mt-2">确保该地址允许来自后端的 API 请求。</p>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={handleTest} disabled={testing} variant="default" className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                   {testing ? '连接中...' : <><Server className="w-4 h-4 mr-2" /> 测试连接</>}
                </Button>
                <Button onClick={handleSync} disabled={syncing} variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                   {syncing ? '同步中...' : <><RefreshCcw className="w-4 h-4 mr-2" /> 同步资源库</>}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500 w-5 h-5"/> 当前状态</h3>
         <div className="space-y-4 text-sm text-slate-400">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>连接状态</span><span className="text-green-400 font-medium">正常在线</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>最后检测时间</span><span className="text-slate-300">2026-05-02 00:45:12</span>
            </div>
            <div className="flex justify-between pb-2">
              <span>本地已记录资源数</span><span className="text-slate-300">16 个模型文件</span>
            </div>
         </div>
      </div>
    </div>
  );
}
