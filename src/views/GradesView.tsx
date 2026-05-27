import React, { useState, useEffect } from 'react';
import { UserProgressData, LeaderboardEntry } from '../types';
import { UNITS } from '../data/lessons';
import { QUESTIONS_BY_UNIT } from '../data/questions';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Trophy, Bookmark, CheckCircle, Clock } from 'lucide-react';

interface GradesViewProps {
  progress: UserProgressData;
  currentUserXp: number;
  currentUserLevel: number;
  currentUserName: string;
}

export const GradesView: React.FC<GradesViewProps> = ({
  progress,
  currentUserXp,
  currentUserLevel,
  currentUserName,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState('unit1');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Carrega o placar (Leaderboard) do Firestore dinamicamente ordenado de forma decrescente por XP
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const qRef = collection(db, 'users');
        const queryRules = query(qRef, orderBy('xp', 'desc'), limit(10));
        const qSnap = await getDocs(queryRules);

        const list: LeaderboardEntry[] = [];
        let curUserFound = false;

        qSnap.forEach((doc) => {
          const data = doc.data();
          const isMe = doc.id === auth.currentUser?.uid;
          if (isMe) curUserFound = true;

          list.push({
            userId: doc.id,
            displayName: data.displayName || 'Jogador Secreto',
            level: data.level || 1,
            xp: data.xp || 0,
            medalhas: data.medalhas || [],
            isCurrentUser: isMe,
          });
        });

        // Fallback ou adiciona o usuário atual se não estiver presente no snapshot do top 10
        if (!curUserFound && auth.currentUser) {
          list.push({
            userId: auth.currentUser.uid,
            displayName: currentUserName || 'Eu',
            level: currentUserLevel,
            xp: currentUserXp,
            medalhas: ['iniciante'],
            isCurrentUser: true,
          });
        }

        // Aplica uma ordenação pelo índice de classificação
        const sortedList = list.sort((a, b) => b.xp - a.xp);

        setLeaderboard(sortedList);
      } catch (err) {
        console.warn('Leaderboard fetch warning (permissions/indices config):', err);
        // Fallback suave mostrando apenas o usuário conectado real
        const fallbackList: LeaderboardEntry[] = [
          { userId: auth.currentUser?.uid || 'curr', displayName: currentUserName || 'Seu Nome', level: currentUserLevel, xp: currentUserXp, medalhas: [], isCurrentUser: true }
        ];
        setLeaderboard(fallbackList);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserXp, currentUserLevel, currentUserName]);

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId) || UNITS[0];
  const unitProgress = progress[selectedUnitId as keyof UserProgressData] || {
    exercisesCompleted: [],
    exercisesScores: {},
    simulado1Completed: false,
    simulado1Score: 0,
    simulado2Completed: false,
    simulado2Score: 0,
    avaliacaoCompleted: false,
    avaliacaoScore: 0,
    avaliacaoAttempts: 0,
    substitutaCompleted: false,
    substitutaScore: 0,
  };

  const getExamScoreFormatted = (type: 'simulado1' | 'simulado2' | 'avaliacao' | 'substituta', rawScore: number) => {
    const questionsList = QUESTIONS_BY_UNIT[selectedUnit.id]?.[type] || [];
    const total = questionsList.length || 2;
    const normalized = Math.min(10, (rawScore / total) * 10);
    return normalized.toFixed(1);
  };

  const avaliacaoTotalQuestions = QUESTIONS_BY_UNIT[selectedUnit.id]?.avaliacao?.length || 2;
  const isAvaliacaoApproved = unitProgress.avaliacaoCompleted && ((unitProgress.avaliacaoScore / avaliacaoTotalQuestions) * 10) >= 7.5;

  // Cálculos de agregação
  // Calcula a nota de 0 a 10 de cada capítulo de forma individual e consistente com UnitView
  const topicPoints = selectedUnit.topics.map((topic) => {
    const unitMap = QUESTIONS_BY_UNIT[selectedUnit.id] || QUESTIONS_BY_UNIT['unit1'];
    const topicQuestions = unitMap[topic.id] || unitMap.exercises || [];
    const totalTopicQuestions = topicQuestions.length || 9;
    
    // Recupera os acertos do capítulo específico
    const score = unitProgress.exercisesScores?.[topic.id] || 0;
    const grade = (score / totalTopicQuestions) * 10;
    return Math.min(10, grade);
  });

  // A nota correspondente geral é a média aritmética simples das notas individuais dos capítulos
  const exercisePointsFormatted = topicPoints.length > 0
    ? topicPoints.reduce((sum, val) => sum + val, 0) / topicPoints.length
    : 0;

  const getMedalStyle = (rankIdx: number) => {
    if (rankIdx === 0) return 'text-amber-500 font-bold';
    if (rankIdx === 1) return 'text-slate-400 font-bold';
    if (rankIdx === 2) return 'text-amber-750 font-bold';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-slate-800">
      {/* Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-[#00702c] bg-green-50 px-3 py-1 rounded-full border border-green-100 tracking-wider uppercase">
            DESEMPENHO ESCOLAR
          </span>
          <h2 className="text-2xl font-black text-slate-900 pt-2">
            Boletim de Notas e Classificação
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Acompanhe seu rendimento de exames escolares oficiais e compare com outros estudantes em tempo real.
          </p>
        </div>
      </div>

      {/* Grade: Boletim à Esquerda, Classificação à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Boletim (ocupa 2 colunas) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center">
              <Bookmark className="w-5 h-5 mr-2 text-[#00702c]" />
              Rendimento Escolar das Unidades
            </h3>

            {/* Abas Horizontais para Seleção de Unidade */}
            <div className="flex space-x-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-100">
              {UNITS.map((unit) => (
                <button
                  key={unit.id}
                  id={`tab-btn-unit-${unit.id}`}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedUnitId === unit.id
                      ? 'bg-[#00702c] text-white shadow-md'
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-150'
                  }`}
                >
                  Unidade {unit.number}: {unit.title}
                </button>
              ))}
            </div>

            {/* Resultados Detalhados da Unidade */}
            <div id="grades-unit-details-panel" className="space-y-4">
              {/* Rendimento e notas dos exercícios principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cartão de Exercícios */}
                <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">FIXAÇÃO GERAL</span>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Exercícios Concluídos</h4>
                    <span className="text-xs text-slate-500 font-semibold font-mono block mb-3">
                      Progresso: {unitProgress.exercisesCompleted?.length || 0} / {selectedUnit.topics?.length || 4} Capítulos
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-150 mt-2">
                    <span className="text-xs text-slate-500">Nota Correspondente</span>
                    <span className="text-lg font-mono font-bold text-[#00702c]">
                      {exercisePointsFormatted.toFixed(1)} / 10
                    </span>
                  </div>
                </div>

                {/* Simulado 1 */}
                <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">AVALIAÇÃO PARCIAL I</span>
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Simulado Preparatório 1</h4>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-150 mt-2">
                    <span className="text-xs text-slate-500">Nota Registrada</span>
                    <span className={`text-lg font-mono font-bold ${unitProgress.simulado1Completed ? 'text-[#00702c]' : 'text-slate-400'}`}>
                      {unitProgress.simulado1Completed ? `${getExamScoreFormatted('simulado1', unitProgress.simulado1Score)} / 10` : 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Simulado 2 */}
                <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">AVALIAÇÃO PARCIAL II</span>
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Simulado Preparatório 2</h4>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-150 mt-2">
                    <span className="text-xs text-slate-500">Nota Registrada</span>
                    <span className={`text-lg font-mono font-bold ${unitProgress.simulado2Completed ? 'text-[#00702c]' : 'text-slate-400'}`}>
                      {unitProgress.simulado2Completed ? `${getExamScoreFormatted('simulado2', unitProgress.simulado2Score)} / 10` : 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Avaliação regular */}
                <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">PROVA INTEGRAL</span>
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Avaliação Regulamentar</h4>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-150 mt-2">
                    <span className="text-xs text-slate-500">Nota Registrada</span>
                    <span className={`text-lg font-mono font-bold ${unitProgress.avaliacaoCompleted ? (isAvaliacaoApproved ? 'text-emerald-600 font-black' : 'text-red-500') : 'text-slate-400'}`}>
                      {unitProgress.avaliacaoCompleted ? `${getExamScoreFormatted('avaliacao', unitProgress.avaliacaoScore)} / 10` : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Painel de resultados de provas substitutivas de recuperação */}
              {unitProgress.substitutaCompleted && (
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-red-500 uppercase tracking-widest block">EXAME DE RECUPERAÇÃO</span>
                    <h4 className="text-xs font-bold text-slate-800">Avaliação de Recuperação Substituta</h4>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-slate-450 font-mono">Nota de Recuperação</span>
                    <span className="text-lg font-mono font-black text-red-600">
                      {getExamScoreFormatted('substituta', unitProgress.substitutaScore)} / 10
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Placar / Classificação (ocupa 1 coluna) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-amber-500" />
              Liga Semanal Geral
            </h3>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">
              Ordenado em tempo real pela experiência escolar acumulada.
            </p>

            {loadingLeaderboard ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Lendo perfis escolares...
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((player, idx) => (
                  <div
                    key={player.userId || idx}
                    id={`leaderboard-row-${player.userId}`}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      player.isCurrentUser
                        ? 'bg-green-50/70 border-[#00702c]/50 text-[#00702c] font-black ring-1 ring-[#00702c]/20'
                        : 'bg-slate-50/50 border-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {/* Distintivo de classificação de nível/ranking */}
                      <span className={`w-6 text-center font-mono text-xs ${getMedalStyle(idx)}`}>
                        #{idx + 1}
                      </span>
                      {/* Nome do estudante */}
                      <span className="text-sm truncate font-medium">{player.displayName}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[11px] text-[#00702c] font-mono font-bold">
                        {player.xp} XP
                      </span>
                      <span className="block text-[9px] text-slate-450 font-mono">
                        Nível {player.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-green-50 rounded-2xl border border-green-100/50 mt-6 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">Minha Categoria</span>
            <span className="text-xs font-black text-[#00702c] uppercase tracking-widest">Iniciante I</span>
          </div>
        </div>
      </div>
    </div>
  );
};
