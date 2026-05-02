import React from 'react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">偏好设置</h1>
      <div className="space-y-6 text-slate-300">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="font-semibold text-lg mb-4">外观</h3>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span>深色模式</span>
            <span className="text-indigo-400">已开启</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span>聊天动画效果</span>
            <span className="text-indigo-400">已开启</span>
          </div>
        </div>
      </div>
    </div>
  );
}
