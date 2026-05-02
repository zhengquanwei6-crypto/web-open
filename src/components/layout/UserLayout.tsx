import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, User, Bot, LayoutGrid } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function UserLayout() {
  const location = useLocation();
  
  const navItems = [
    { name: '广场', path: '/characters', icon: <LayoutGrid className="w-5 h-5" /> },
    { name: '工作台', path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: '设置', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="fixed top-0 inset-x-0 h-16 border-b border-white/5 bg-black/20 backdrop-blur-xl z-50 flex items-center px-6 justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            AETHERIA
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                location.pathname.startsWith(item.path)
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <Link to="/admin" className="ml-4 px-4 py-2 rounded-xl text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
            后台管理
          </Link>
        </nav>
      </div>
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
