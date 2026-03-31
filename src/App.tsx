import { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  Activity, 
  Wifi, 
  Cpu,
  ChevronRight,
  Code,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Config {
  id: string;
  name: string;
  type: 'VLESS' | 'Sing-box';
  content: string;
  createdAt: number;
}

interface ConnectionStats {
  ping: number;
  speed: string;
  uptime: string;
}

// --- Main App ---
export default function App() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigContent, setNewConfigContent] = useState('');
  const [stats, setStats] = useState<ConnectionStats>({ ping: 0, speed: '0 KB/s', uptime: '00:00:00' });

  // Load configs
  useEffect(() => {
    const saved = localStorage.getItem('sni_configs');
    if (saved) setConfigs(JSON.parse(saved));
  }, []);

  // Save configs
  useEffect(() => {
    localStorage.setItem('sni_configs', JSON.stringify(configs));
  }, [configs]);

  // Simulation of stats
  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setStats({
          ping: Math.floor(Math.random() * 150) + 50,
          speed: (Math.random() * 5 + 1).toFixed(1) + ' MB/s',
          uptime: '00:05:23' // Mock uptime
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleAddConfig = () => {
    if (!newConfigName || !newConfigContent) return;
    const newConfig: Config = {
      id: Math.random().toString(36).substr(2, 9),
      name: newConfigName,
      type: newConfigContent.includes('vless') ? 'VLESS' : 'Sing-box',
      content: newConfigContent,
      createdAt: Date.now()
    };
    setConfigs([...configs, newConfig]);
    setNewConfigName('');
    setNewConfigContent('');
    setShowAddModal(false);
  };

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsConnecting(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    }
  };

  const deleteConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
    if (activeConfigId === id) {
      setActiveConfigId(null);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#F27D26]/30">
      {/* Mobile Container Simulation */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col border-x border-[#1F1F23] bg-[#0F0F12] shadow-2xl">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-bottom border-[#1F1F23]">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SNI Connect</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8E9299] font-mono">Secure Tunnel v1.0</p>
          </div>
          <button className="p-2 rounded-full hover:bg-[#1F1F23] transition-colors">
            <Settings size={20} className="text-[#8E9299]" />
          </button>
        </header>

        {/* Main Status Area */}
        <main className="flex-1 p-6 flex flex-col gap-8">
          
          {/* Connection Visualizer */}
          <div className="relative flex flex-col items-center justify-center py-12 bg-[#151619] rounded-3xl border border-[#1F1F23] overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isConnected ? 'opacity-10' : 'opacity-0'}`} 
                 style={{ background: 'radial-gradient(circle, #F27D26 0%, transparent 70%)' }} />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={isConnected ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 3 }}
                className={`w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isConnected ? 'border-[#F27D26] shadow-[0_0_30px_rgba(242,125,38,0.2)]' : 'border-[#2D2D33]'
                }`}
              >
                {isConnected ? (
                  <ShieldCheck size={48} className="text-[#F27D26]" />
                ) : (
                  <Shield size={48} className="text-[#2D2D33]" />
                )}
              </motion.div>

              <div className="mt-6 text-center">
                <h2 className={`text-2xl font-bold tracking-tight ${isConnected ? 'text-white' : 'text-[#8E9299]'}`}>
                  {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                </h2>
                <p className="text-xs font-mono text-[#8E9299] mt-1">
                  {activeConfigId ? configs.find(c => c.id === activeConfigId)?.name : 'No Config Selected'}
                </p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-10 grid grid-cols-3 gap-8 w-full px-8 border-t border-[#1F1F23] pt-6">
              <div className="text-center">
                <p className="text-[9px] uppercase text-[#8E9299] font-mono mb-1">Ping</p>
                <p className="text-sm font-bold text-white">{isConnected ? `${stats.ping}ms` : '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase text-[#8E9299] font-mono mb-1">Speed</p>
                <p className="text-sm font-bold text-white">{isConnected ? stats.speed : '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase text-[#8E9299] font-mono mb-1">Uptime</p>
                <p className="text-sm font-bold text-white">{isConnected ? stats.uptime : '--'}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={toggleConnection}
            disabled={!activeConfigId || isConnecting}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-95 ${
              !activeConfigId ? 'bg-[#1F1F23] text-[#4A4A52] cursor-not-allowed' :
              isConnected ? 'bg-[#1F1F23] text-white hover:bg-[#2D2D33]' : 
              'bg-[#F27D26] text-black hover:bg-[#FF8E3D]'
            }`}
          >
            {isConnecting ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isConnected ? (
              <><Square size={18} fill="currentColor" /> Disconnect</>
            ) : (
              <><Play size={18} fill="currentColor" /> Connect Now</>
            )}
          </button>

          {/* Config List */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E9299]">Configurations</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="text-[#F27D26] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {configs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-[#1F1F23] rounded-2xl">
                  <p className="text-xs text-[#4A4A52]">No configurations added yet.</p>
                </div>
              ) : (
                configs.map((config) => (
                  <div 
                    key={config.id}
                    onClick={() => !isConnected && setActiveConfigId(config.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      activeConfigId === config.id 
                        ? 'bg-[#1F1F23] border-[#F27D26]' 
                        : 'bg-[#151619] border-[#1F1F23] hover:border-[#2D2D33]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${activeConfigId === config.id ? 'bg-[#F27D26]/10 text-[#F27D26]' : 'bg-[#1F1F23] text-[#8E9299]'}`}>
                        <Wifi size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{config.name}</p>
                        <p className="text-[10px] font-mono text-[#8E9299]">{config.type} • REALITY</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteConfig(config.id); }}
                        className="p-2 text-[#4A4A52] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={16} className="text-[#2D2D33]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="p-6 border-t border-[#1F1F23] bg-[#0A0A0B]">
          <div className="flex items-center gap-3 text-[#4A4A52]">
            <Info size={14} />
            <p className="text-[10px] leading-relaxed">
              SNI Connect uses advanced TLS fragmentation and REALITY SNI masking to ensure privacy.
            </p>
          </div>
        </footer>
      </div>

      {/* Add Config Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#151619] w-full max-w-md rounded-3xl border border-[#1F1F23] p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6">Import Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8E9299] mb-2">Config Name</label>
                  <input 
                    type="text" 
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                    placeholder="e.g. My Reality Server"
                    className="w-full bg-[#0F0F12] border border-[#1F1F23] rounded-xl p-3 text-sm focus:outline-none focus:border-[#F27D26] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8E9299] mb-2">JSON / VLESS Link</label>
                  <textarea 
                    rows={6}
                    value={newConfigContent}
                    onChange={(e) => setNewConfigContent(e.target.value)}
                    placeholder='{"outbounds": [...]}'
                    className="w-full bg-[#0F0F12] border border-[#1F1F23] rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#F27D26] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#1F1F23] text-sm font-bold hover:bg-[#1F1F23] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddConfig}
                  className="flex-1 py-3 rounded-xl bg-[#F27D26] text-black text-sm font-bold hover:bg-[#FF8E3D] transition-colors"
                >
                  Save Config
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1F1F23;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2D2D33;
        }
      `}</style>
    </div>
  );
}
