import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  TrendingDown, 
  Bot, 
  FileText, 
  Bell, 
  Sliders,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export type TabType = 
  | 'overview'
  | 'live'
  | 'offset-wells'
  | 'intelligence'
  | 'risk'
  | 'depth'
  | 'assistant'
  | 'documents'
  | 'alerts'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadAlerts: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadAlerts
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Drilling', icon: Activity, badge: 'LIVE' },
    { id: 'offset-wells', label: 'Offset Wells GIS', icon: MapPin },
    { id: 'intelligence', label: 'Well Intelligence', icon: Layers },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'depth', label: 'Depth Analysis', icon: TrendingDown },
    { id: 'assistant', label: 'Knowledge Assistant', icon: Bot, badge: 'AI' },
    { id: 'documents', label: 'Reports & Docs', icon: FileText },
    { id: 'alerts', label: 'Drilling Alerts', icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'settings', label: 'System Config', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#0D1724]/95 border-r border-[#1C2A3A] flex flex-col justify-between z-10 backdrop-blur-md shrink-0">
      {/* Navigation List */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          OPERATIONAL MODULES
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#2F80ED]/20 to-transparent border-l-2 border-brand-cyan text-slate-100 shadow-[inset_0_0_10px_rgba(47,128,237,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#16253B]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  item.badge === 'LIVE' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                    : item.badge === 'AI'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Industrial Safety & Disclaimer Footer */}
      <div className="p-3.5 m-3 rounded bg-[#0A121D] border border-[#1C2A3A]/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-mono font-semibold text-[10px] uppercase">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>DECISION SUPPORT ADVISORY</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400 font-sans">
          AI predictions are calibrated probabilistic models based on offset wells. All operational parameters must be verified with certified Wellsite Engineers.
        </p>
        <div className="pt-1 border-t border-[#1C2A3A] flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>BASIN: BARMER BLOCK-A</span>
          <span className="text-emerald-400">STATUS: NOMINAL</span>
        </div>
      </div>
    </aside>
  );
};
