import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../types';
import { characterApi } from '../../api';
import { motion } from 'motion/react';
import { Search, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    characterApi.getCharacters().then(data => {
      setCharacters(data);
      setLoading(false);
    });
  }, []);

  const filtered = characters.filter(c => c.name.includes(search) || c.tags.some(t => t.includes(search)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">角色广场</h1>
          <p className="text-slate-400">选择你想要对话的AI虚拟角色</p>
        </div>
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input 
            className="pl-9 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-indigo-500" 
            placeholder="搜索角色名字或标签..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex space-x-2 justify-center items-center h-64">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex gap-4 mb-4">
                  <img src={char.avatar} alt={char.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10" />
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{char.name}</h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" /> 热度 {char.hotness}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">{char.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {char.tags.slice(0,3).map(t => (
                    <Badge key={t} variant="glass" className="text-[10px] py-1">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 relative z-10 w-full mt-auto">
                <Button className="flex-1" variant="glass" asChild>
                  <Link to={`/characters/${char.id}`}>详情</Link>
                </Button>
                <Button className="flex-1 flex gap-2" variant="default" asChild>
                  <Link to={`/chat/${char.id}`}>
                    <MessageCircle className="w-4 h-4" /> 聊天
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
