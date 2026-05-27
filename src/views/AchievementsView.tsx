import React from 'react';
import { Sprout, Flame, Brain, Rocket, Star, Crown, Target, Award } from 'lucide-react';
import { UserProgressData } from '../types';
import { QUESTIONS_BY_UNIT } from '../data/questions';

interface AchievementsViewProps {
  medalhas: string[];
  userXp: number;
  userLevel: number;
  progress: UserProgressData;
}

interface MedalSchema {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const MEDAL_SCHEMA_LIST: MedalSchema[] = [
  { id: 'iniciante', name: 'Iniciante', description: 'Concluir o cadastro e entrar na guilda.', icon: Sprout, color: 'text-emerald-600 border-emerald-100 bg-emerald-50' },
  { id: 'persistente', name: 'Persistente', description: 'Estudar por 5 dias consecutivos.', icon: Flame, color: 'text-orange-600 border-orange-100 bg-orange-50' },
  { id: 'gênio', name: 'Gênio', description: 'Alcançar o Nível 5 na plataforma.', icon: Brain, color: 'text-violet-600 border-violet-100 bg-violet-50' },
  { id: 'veloz', name: 'Veloz', description: 'Terminar provas na metade do tempo.', icon: Rocket, color: 'text-red-600 border-red-100 bg-red-50' },
  { id: 'nota10', name: 'Nota 10', description: 'Gabaritar 100% em qualquer avaliação.', icon: Star, color: 'text-amber-600 border-amber-100 bg-amber-50' },
  { id: 'mestre', name: 'Mestre da Guilda', description: 'Alcançar o glorioso Nível 10 supremo.', icon: Crown, color: 'text-indigo-600 border-indigo-100 bg-indigo-50' }
];

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  medalhas,
  userLevel,
  progress,
}) => {

  // Medalhas desbloqueadas automaticamente baseadas no progresso real
  const unlockedMedals = [...medalhas];

  // Se o nível do usuário for maior ou igual a 5, concede "gênio" de forma autônoma
  if (userLevel >= 5 && !unlockedMedals.includes('gênio')) {
    unlockedMedals.push('gênio');
  }
  // Se o nível do usuário for maior ou igual a 10, concede "mestre" de forma autônoma
  if (userLevel >= 10 && !unlockedMedals.includes('mestre')) {
    unlockedMedals.push('mestre');
  }

  // Se o usuário obteve pontuação máxima (ex: pontuação igual ao total de questões) em qualquer teste, concede "nota10"
  let gotPerfectScore = false;
  Object.entries(progress).forEach(([unitId, unit]: [string, any]) => {
    const q1Total = QUESTIONS_BY_UNIT[unitId]?.simulado1?.length || 2;
    const q2Total = QUESTIONS_BY_UNIT[unitId]?.simulado2?.length || 2;
    const avTotal = QUESTIONS_BY_UNIT[unitId]?.avaliacao?.length || 2;
    if (unit.simulado1Completed && unit.simulado1Score === q1Total) gotPerfectScore = true;
    if (unit.simulado2Completed && unit.simulado2Score === q2Total) gotPerfectScore = true;
    if (unit.avaliacaoCompleted && unit.avaliacaoScore === avTotal) gotPerfectScore = true;
  });
  if (gotPerfectScore && !unlockedMedals.includes('nota10')) {
    unlockedMedals.push('nota10');
  }

  // Conta a quantidade total de tópicos concluídos
  let totalTopicsCompleted = 0;
  (Object.values(progress) as any[]).forEach((unit) => {
    totalTopicsCompleted += (unit.exercisesCompleted?.length || 0);
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-slate-800">
      {/* Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 shadow-sm">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-[#00702c] bg-green-50 px-3 py-1 rounded-full border border-green-100 tracking-wider uppercase">
            SALA DE TROFÉUS
          </span>
          <h2 className="text-2xl font-black text-slate-900 pt-2">
            Medalhas e Missões Ativas
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Conclua aulas escolares, realize missões semanais, suba de Rank e conquiste medalhas exclusivas para o seu perfil.
          </p>
        </div>
      </div>

      {/* Estrutura da grade: Medalhas à Esquerda, Missões à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Medalhas (ocupa 2 colunas) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-amber-500" />
              Minha Coleção de Medalhas ({unlockedMedals.length} de {MEDAL_SCHEMA_LIST.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MEDAL_SCHEMA_LIST.map((m) => {
                const isUnlocked = unlockedMedals.includes(m.id);
                const IconComponent = m.icon;

                return (
                  <div
                    key={m.id}
                    id={`medal-card-${m.id}`}
                    className={`p-4 border rounded-2xl flex items-center space-x-4 transition-all ${
                      isUnlocked
                        ? `${m.color} border-slate-200/50 shadow-sm`
                        : 'border-slate-100 bg-slate-50/50 opacity-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                      isUnlocked ? 'border-current bg-white' : 'border-slate-200 text-slate-400 bg-slate-100'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-normal whitespace-normal break-words">{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel de Missões de Apoio (ocupa 1 coluna) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#00702c]" />
                Objetivos e Missões Ativas
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Novas metas educacionais para acelerar seu bônus de experiência diária.
              </p>
            </div>

            <div className="space-y-4">
              {/* Missão 1: Resolver 4 tópicos */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3.5">
                <div className="flex justify-between items-start text-xs font-semibold">
                  <div>
                    <h4 className="text-slate-800">Prática Intensiva</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Resolver 4 tópicos completos.</p>
                  </div>
                  <span className="text-emerald-600 font-mono text-[10px] bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100">+15 XP</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#00702c] rounded-full"
                      style={{ width: `${Math.min(100, (totalTopicsCompleted / 4) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium leading-none">
                    <span>Progresso</span>
                    <span>{totalTopicsCompleted} / 4 capítulos</span>
                  </div>
                </div>
              </div>

              {/* Missão 2: Estudar por 15 minutos */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">Sessão Regular</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Estudar por pelo menos 15 minutos.</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-emerald-600 font-mono text-[10px] bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100 block mb-1">+20 XP</span>
                  <span className="text-[9px] font-medium text-slate-400 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-center shadow-xs">
                    Pendente
                  </span>
                </div>
              </div>

              {/* Missão 3: Gabaritar simulação */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">Mente Brilhante</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Gabaritar uma avaliação.</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-emerald-600 font-mono text-[10px] bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100 block mb-1">+35 XP</span>
                  {gotPerfectScore ? (
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 text-center shadow-xs">
                      Concluída
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium text-slate-400 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-center shadow-xs">
                      Incompleta
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-2xl border border-green-100/30 mt-6 text-center text-xs text-slate-500">
            Cada medalha desbloqueada confere status ao seu perfil. Acesse a trilha de aulas para ganhar conquistas raras.
          </div>
        </div>
      </div>
    </div>
  );
};
