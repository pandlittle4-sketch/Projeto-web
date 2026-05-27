import React from 'react';
import { Home, Award, BookOpen, FileText, LogOut, Menu } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
  userEmail,
  userName
}) => {
  // No layout:
  // - Dashboard utiliza Home
  // - Os estados de Unidade/Aula/Quiz também se enquadram na categoria Dashboard/Home para mapeamento limpo
  // - Boletim mapeia para o ícone de folha de texto (FileText)
  // - Prêmios/Conquistas mapeiam para o ícone de medalha (Award)
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home, views: ['dashboard', 'unit', 'lesson', 'quiz'] },
    { id: 'grades', label: 'Boletim', icon: FileText, views: ['grades'] },
    { id: 'achievements', label: 'Prêmios', icon: Award, views: ['achievements'] },
  ];

  return (
    <aside className="w-20 bg-white border-r border-slate-100 text-slate-800 flex flex-col justify-between h-screen fixed top-0 left-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Área do Cabeçalho Superior / Menu Hambúrguer */}
      <div>
        <div className="h-20 flex items-center justify-center border-b border-slate-100">
          <button 
            id="btn-sidebar-hamburger"
            className="p-3 rounded-xl text-[#00702c] hover:bg-green-50 transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Itens de Navegação (Apenas ícones, centralizados verticalmente) */}
        <nav className="p-4 space-y-4 flex flex-col items-center pt-8">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.views.includes(currentView);
            
            return (
              <div key={item.id} className="relative group">
                <button
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-250 cursor-pointer ${
                    isActive
                      ? 'bg-[#e8f5e9] text-[#00702c] shadow-[0_4px_12px_rgba(0,112,44,0.06)]'
                      : 'text-slate-400 hover:text-[#00702c] hover:bg-[#f1fbf3]'
                  }`}
                >
                  <IconComponent className="w-5 h-5 stroke-[2.2px]" />
                </button>
                
                {/* Micro tooltip ao passar o mouse */}
                <span className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] uppercase font-mono tracking-wider rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Área de Logout Inferior */}
      <div className="p-4 border-t border-slate-100 flex flex-col items-center">
        <div className="relative group">
          <button
            id="btn-sidebar-logout"
            onClick={onLogout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 stroke-[2.2px]" />
          </button>
          
          <span className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] uppercase font-mono tracking-wider rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
            Sair da Conta
          </span>
        </div>
      </div>
    </aside>
  );
};

