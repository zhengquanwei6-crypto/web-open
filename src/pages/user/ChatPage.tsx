import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Character, ChatMessage, Workflow } from '../../types';
import { characterApi, chatApi, workflowApi } from '../../api';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, RefreshCw, Trash2, Box, Cpu, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { cn } from '../../utils/cn';

export default function ChatPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Right panel states
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [workflowParams, setWorkflowParams] = useState<Record<string, any>>({});
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      characterApi.getCharacterById(id).then(c => {
        if (c) {
          setCharacter(c);
          if (c.workflowId) {
            workflowApi.getWorkflowById(c.workflowId).then(w => {
              if (w) setWorkflow(w);
            });
          }
        }
      });
      chatApi.getChatHistory(id).then(history => {
        setMessages(history);
      });
    }
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputMsg.trim() || !id) return;
    
    const newMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: inputMsg,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);
    
    const reply = await chatApi.sendMessage(id, newMsg.content);
    setMessages(prev => [...prev, reply]);
    setIsTyping(false);
  };

  const handleClear = async () => {
    if(!id) return;
    await chatApi.clearChatHistory(id);
    setMessages([]);
  };

  const handleRunWorkflow = async () => {
    if(!workflow || !id) return;
    setIsGeneratingImg(true);
    const result = await workflowApi.runWorkflow(workflow.id, workflowParams);
    
    const msg: ChatMessage = {
      id: `img-${Date.now()}`,
      role: 'ai',
      content: '图像已生成完毕：',
      timestamp: new Date().toISOString(),
      images: result.images
    };
    
    setMessages(prev => [...prev, msg]);
    setIsGeneratingImg(false);
  };

  if (!character) return <div className="h-screen bg-[#05060f] text-white flex items-center justify-center">加载中...</div>;

  return (
    <div className="h-screen bg-[#05060f] flex overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#0a0b1e] flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
            <Link to="/characters"><ArrowLeft className="w-5 h-5"/></Link>
          </Button>
          <div className="font-medium text-slate-200">返回广场</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
           {/* Session List Mock */}
           <div className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">历史对话</div>
           <div className="bg-white/5 rounded-xl p-3 text-sm text-indigo-400 font-medium cursor-pointer">
             当前会话 (最新)
           </div>
        </div>
        <div className="p-4 border-t border-white/5 space-y-2">
          <Button variant="outline" className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" /> 清空会话
          </Button>
        </div>
      </div>

      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#05060f] to-[#05060f]">
        
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img src={character.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
            <div>
              <div className="font-semibold text-slate-100">{character.name}</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> 在线
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <img src={character.avatar} className="w-24 h-24 rounded-full grayscale opacity-50" />
               <p className="text-slate-400">{character.greeting}</p>
             </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-auto rounded-br-sm shadow-lg shadow-indigo-500/20" 
                    : "bg-white/5 text-slate-200 border border-white/10 rounded-bl-sm"
                )}
              >
                {msg.content}
                {msg.images && msg.images.length > 0 && (
                   <div className="mt-4 grid gap-2">
                     {msg.images.map((img, i) => (
                        <img key={i} src={img} className="rounded-xl max-w-sm border border-white/10" />
                     ))}
                   </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 rounded-bl-sm max-w-[80%] flex gap-1 items-center w-16">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"/>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"/>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 pt-2">
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md focus-within:ring-2 ring-indigo-500/50 transition-all flex items-end">
            <Textarea 
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`和 ${character.name} 说点什么... (Enter 发送, Shift+Enter 换行)`}
              className="resize-none border-none bg-transparent shadow-none focus-visible:ring-0 min-h-[50px] py-3 max-h-32"
            />
            <Button size="icon" onClick={handleSend} disabled={!inputMsg.trim() || isTyping} className="ml-2 mb-1 shrink-0 rounded-xl">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Character Info & Workflow */}
      <div className="w-80 border-l border-white/5 bg-[#0a0b1e] hidden lg:flex flex-col overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 font-semibold text-slate-200">
             <Cpu className="w-4 h-4 text-purple-400" /> 特性配置
          </div>
          <div className="space-y-4 text-sm text-slate-400">
             <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-slate-300 font-medium mb-1">能力列表</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {character.capabilities.map(c => <span key={c} className="px-2 py-1 bg-black/20 rounded-md text-xs">{c}</span>)}
                </div>
             </div>
          </div>
          
          {workflow && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 font-semibold text-slate-200">
                 <Box className="w-4 h-4 text-indigo-400" /> 动态工作流参数
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-indigo-400 mb-4">{workflow.name}</div>
                <div className="space-y-4">
                  {workflow.parameterSchema.map((param) => (
                    <div key={param.name}>
                      <label className="text-xs text-slate-400 mb-1 block">{param.label}</label>
                      {param.type === 'textarea' ? (
                        <Textarea 
                          className="min-h-[60px] text-xs py-1.5" 
                          placeholder={param.defaultValue}
                          onChange={e => setWorkflowParams({...workflowParams, [param.name]: e.target.value})}
                        />
                      ) : param.type === 'number' || param.type === 'slider' ? (
                        <input 
                          type="range" min={param.min} max={param.max} step={param.step} 
                          className="w-full accent-indigo-500" 
                          onChange={e => setWorkflowParams({...workflowParams, [param.name]: e.target.value})}
                        />
                      ) : (
                        <Input 
                          className="h-8 text-xs px-2" 
                          placeholder={`Type: ${param.type}`}
                          onChange={e => setWorkflowParams({...workflowParams, [param.name]: e.target.value})}
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-white border-0 shadow-lg"
                    onClick={handleRunWorkflow}
                    disabled={isGeneratingImg}
                  >
                    {isGeneratingImg ? '生成中...' : <><ImageIcon className="w-4 h-4 mr-2" /> 运行节点</>}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
