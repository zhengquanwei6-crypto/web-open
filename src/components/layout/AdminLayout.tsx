import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Box, Cpu, Workflow, HardDrive, MessageSquareText, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { name: '角色管理', path: '/admin/characters', icon: <Users className="w-5 h-5" /> },
    { name: '模型配置', path: '/admin/models', icon: <Cpu className="w-5 h-5" /> },
    { name: 'ComfyUI 节点', path: '/admin/comfy', icon: <Box className="w-5 h-5" /> },
    { name: '工作流管理', path: '/admin/workflows', icon: <Workflow className="w-5 h-5" /> },
    { name: '资源库 (Lora/CKPT)', path: '/admin/resources', icon: <HardDrive className="w-5 h-5" /> },
    { name: '提示词库', path: '/admin/prompts', icon: <MessageSquareText className="w-5 h-5" /> },
    { name: '聊天记录', path: '/admin/chat-logs', icon: <MessageSquareText className="w-5 h-5" /> },
    { name: '用户管理', path: '/admin/users', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-200 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#0a0b1e] flex flex-col fixed inset-y-0 left-0">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回前台
          </Link>
        </div>
        <div className="px-6 py-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">平台管理</h2>
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
                
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <span className={cn(
                    "transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur flex items-center px-8 sticky top-0 z-10">
          <div className="font-medium text-slate-300">后台管理系统</div>
        </header>
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
