import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  userName: string;
  userXp: number;
  userLevel: number;
}

export const Header: React.FC<HeaderProps> = ({ userName, userXp, userLevel }) => {
  // Verificação simples para o primeiro nome
  const firstName = userName ? userName.split(' ')[0] : 'Estudante';

  // Cálculo da progressão de XP: 80 XP por nível
  const totalXpNeeded = userLevel * 80;
  const currentLevelXp = userXp % 80;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / totalXpNeeded) * 100));

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      {/* Título da marca correspondente ao mockup */}
      <div className="flex items-center space-x-2">
        <h1 id="header-brand-title" className="text-2xl font-black tracking-tight text-[#00702c]">
          Matemagic
        </h1>
        <span className="hidden sm:inline-block px-2 py-0.5 bg-green-50 text-xs font-semibold text-[#00702c] rounded-md font-mono border border-green-100">
          Olá, {firstName}!
        </span>
      </div>

      {/* Rastreador de nível e XP */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#00702c] font-mono flex items-center bg-green-50/80 px-2.5 py-1 rounded-lg border border-green-100">
              <Zap className="w-3.5 h-3.5 text-amber-500 mr-1 fill-amber-500" />
              {userXp} XP
            </span>
            <span className="text-xs text-slate-300 font-mono">|</span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Nível {userLevel}
            </span>
          </div>

          {/* Barra de progressão estilizada em tema claro */}
          <div className="w-40 sm:w-48 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200/40">
            <div
              className="h-full bg-gradient-to-r from-[#00702c] to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

