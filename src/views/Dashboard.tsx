import React from 'react';
import { UNITS } from '../data/lessons';
import { UserProgressData } from '../types';
import { ChevronRight, BookOpen, Trophy } from 'lucide-react';

interface DashboardProps {
  progress: UserProgressData;
  onSelectUnit: (unitId: string) => void;
}

const MATH_NOTATIONS: Record<string, string> = {
  unit1: '±',
  unit2: '%',
  unit3: 'x=y',
  unit4: 'f(x)',
};

export const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectUnit }) => {

  // Agregadores simples de progresso
  const getUnitProgressMetrics = (unitId: string) => {
    const key = unitId as keyof UserProgressData;
    const unitProg = progress[key];
    const unit = UNITS.find((u) => u.id === unitId);
    const topicsCount = unit?.topics?.length || 4;
    const totalItems = topicsCount + 2; // ex: 4 capítulos/tópicos + 2 simulados = 6

    if (!unitProg) return { percentage: 0, completedCount: 0, totalItems, lessonsCount: 0 };

    const lessonsCount = unitProg.lessonsViewed?.length || 0;
    const completedChaptersCount = unitProg.exercisesCompleted?.length || 0;
    const completedSimuladosCount = (unitProg.simulado1Completed ? 1 : 0) + (unitProg.simulado2Completed ? 1 : 0);
    const totalCompleted = completedChaptersCount + completedSimuladosCount;

    const percentage = Math.min(100, Math.floor((totalCompleted / totalItems) * 100));

    return {
      percentage,
      completedCount: totalCompleted,
      totalItems,
      lessonsCount
    };
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      {/* Banner visual institucional */}
      <div className="bg-[#00702c] rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,112,44,0.06)] text-white relative overflow-hidden flex flex-col justify-center min-h-[180px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_-20%,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white">
            Olá!
          </h2>
          <p className="text-base text-green-100 font-medium">
            Todo esforço conta na sua jornada de aprendizado.
          </p>
        </div>
      </div>

      {/* Grade de exibição dos módulos (unidades) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {UNITS.map((unit) => {
          const mathChar = MATH_NOTATIONS[unit.id] || '±';
          const { percentage, completedCount, totalItems, lessonsCount } = getUnitProgressMetrics(unit.id);

          return (
            <div
              key={unit.id}
              id={`unit-card-${unit.id}`}
              onClick={() => onSelectUnit(unit.id)}
              className="bg-white border border-slate-100/90 hover:border-slate-200 hover:shadow-lg rounded-3xl p-8 pb-20 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
            >
              <div>
                {/* Símbolo de notação matemática correspondente ao design */}
                <div className="text-5xl font-black text-[#00702c] tracking-tighter mb-4 user-select-none">
                  {mathChar}
                </div>

                {/* Informações e títulos do módulo */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00702c] transition-colors">
                  {unit.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1 mb-6">
                  {unit.description}
                </p>

                {/* Micro indicadores de desempenho - limpos e leves */}
                <div className="space-y-3 mb-2 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Atividades concluídas</span>
                    <span className="font-mono text-[#00702c] bg-green-50 px-2 py-0.5 rounded-md">{completedCount} / {totalItems}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00702c] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-[#00702c]/70" />
                      {lessonsCount} de 4 aulas lidas
                    </span>
                    <span className="flex items-center">
                      <Trophy className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      {percentage === 100 ? 'Unidade concluída' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão circular verde preciso de navegação no canto inferior direito */}
              <div className="absolute bottom-6 right-8">
                <div className="w-11 h-11 rounded-full bg-[#00702c] group-hover:bg-[#005a23] text-white flex items-center justify-center transition-all duration-250 shadow-md shadow-green-900/10 scale-100 group-hover:scale-105">
                  <ChevronRight className="w-5 h-5 stroke-[2.5px] text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

