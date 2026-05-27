import React from 'react';
import { Unit, UnitProgress } from '../types';
import { ArrowLeft, BookOpen, Lock, CheckCircle2, AlertTriangle, Play, HelpCircle, FileText } from 'lucide-react';
import { QUESTIONS_BY_UNIT } from '../data/questions';

interface UnitViewProps {
  unit: Unit;
  unitProgress: UnitProgress;
  onBack: () => void;
  onStudyLesson: (lessonId: string) => void;
  onTakeQuiz: (type: 'exercise' | 'simulado1' | 'simulado2' | 'avaliacao' | 'substituta', topicId?: string) => void;
}

export const UnitView: React.FC<UnitViewProps> = ({
  unit,
  unitProgress,
  onBack,
  onStudyLesson,
  onTakeQuiz
}) => {
  // 1. Verifica se todos os exercícios dos capítulos foram concluídos
  const completedTopicsCount = unitProgress.exercisesCompleted?.length || 0;
  const totalTopicsCount = unit.topics.length;
  const allExercisesCompleted = completedTopicsCount === totalTopicsCount;

  // 2. Lógica de desbloqueio do Simulado 1
  const isSimulado1Locked = !allExercisesCompleted;

  // 3. Lógica de desbloqueio do Simulado 2
  const isSimulado2Locked = isSimulado1Locked || !unitProgress.simulado1Completed;

  // 4. Lógica de desbloqueio da Avaliação
  const isAvaliacaoLocked = isSimulado2Locked || !unitProgress.simulado2Completed;

  // 5. Regulamento do status e tentativas da Avaliação
  const getExamScoreFormatted = (type: 'simulado1' | 'simulado2' | 'avaliacao' | 'substituta', rawScore: number) => {
    const questionsList = QUESTIONS_BY_UNIT[unit.id]?.[type] || [];
    const total = questionsList.length || 2;
    const normalized = Math.min(10, (rawScore / total) * 10);
    return normalized.toFixed(1);
  };

  const attemptsCount = unitProgress.avaliacaoAttempts || 0;
  const avaliacaoTotalQuestions = QUESTIONS_BY_UNIT[unit.id]?.avaliacao?.length || 2;
  const isAvaliacaoApproved = unitProgress.avaliacaoCompleted && ((unitProgress.avaliacaoScore / avaliacaoTotalQuestions) * 10) >= 7.5; // Aprovado se nota normalizada >= 7.5
  const hasRemainingAttempts = attemptsCount < 2;

  // Cálculo do tempo de carência de 24 horas
  let cooldownHrsRemaining = 0;
  let worksOnCooldown = false;
  if (unitProgress.avaliacaoLastAttempt) {
    const lastTime = new Date(unitProgress.avaliacaoLastAttempt).getTime();
    const now = Date.now();
    const diffMs = now - lastTime;
    const hrsDiff = diffMs / (1000 * 60 * 60);
    if (hrsDiff < 24) {
      cooldownHrsRemaining = Math.ceil(24 - hrsDiff);
      worksOnCooldown = true;
    }
  }

  // Lógica de desbloqueio da Prova Substitutiva de Recuperação: Ativada se a avaliação principal falhar e não restarem mais tentativas válidas
  const isSubstitutaUnlocked = unitProgress.avaliacaoCompleted && !isAvaliacaoApproved && !hasRemainingAttempts;

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-slate-800">
      {/* Retornar para os módulos (unidades) */}
      <button
        id="btn-unit-back"
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-[#00702c] text-sm font-semibold transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform stroke-[2.2px]" />
        <span>Voltar para o Início</span>
      </button>

      {/* Cabeçalho institucional refinado em verde claro */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-[#00702c] pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="space-y-2 relative z-10">
          <span className="text-[11px] font-mono font-bold text-[#00702c] tracking-wider uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
            Módulo de Aprendizado
          </span>
          <h2 id="unit-title-header" className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-2">
            Unidade {unit.number}: {unit.title}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            {unit.description}
          </p>
        </div>
      </div>

      {/* Grade principal de visualização */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Listagem de aulas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#00702c]" />
              Tópicos e Aulas Ilustradas
            </h3>

            <div className="space-y-4">
              {unit.topics.map((topic, idx) => {
                const isLessonViewed = unitProgress.lessonsViewed?.includes(topic.lessonId);
                const isTopicExerciseCompleted = unitProgress.exercisesCompleted?.includes(topic.id);
                const exerciseScore = unitProgress.exercisesScores?.[topic.id] || 0;

                // Obtém o número real de questões para este tópico
                const unitMap = QUESTIONS_BY_UNIT[unit.id] || QUESTIONS_BY_UNIT['unit1'];
                const topicQuestions = unitMap[topic.id] || unitMap.exercises || [];
                const totalTopicQuestions = topicQuestions.length || 9;

                return (
                  <div
                    key={topic.id}
                    id={`topic-row-${topic.id}`}
                    className="bg-slate-50/50 border border-slate-100/60 p-5 rounded-2xl hover:border-slate-200 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                          Capítulo {idx + 1}
                        </span>
                        {isLessonViewed && (
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Estudado
                          </span>
                        )}
                        {isTopicExerciseCompleted && (
                          <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Exercícios {exerciseScore}/{totalTopicQuestions}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">
                        {topic.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <button
                        id={`btn-study-${topic.lessonId}`}
                        onClick={() => onStudyLesson(topic.lessonId)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 mr-1 text-[#00702c] fill-[#00702c]" />
                        Estudar
                      </button>
                      <button
                        id={`btn-exercises-${topic.id}`}
                        onClick={() => onTakeQuiz('exercise', topic.id)}
                        className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                          isTopicExerciseCompleted
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-200/20'
                            : 'bg-[#00702c] text-white hover:bg-[#005a23] shadow-sm'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 mr-1" />
                        Exercícios
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Barra Lateral de Exames e Status */}
        <div className="space-y-6">
          <div className="border border-slate-100 bg-white rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#00702c]" />
                Exames da Unidade
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Desbloqueie simulados obrigatórios até alcançar a avaliação final.
              </p>
            </div>

            {/* Bloco do Simulado 1 */}
            <div
              id="exam-card-simulado1"
              className={`border p-4.5 rounded-2xl transition-all ${
                isSimulado1Locked
                  ? 'border-slate-100 bg-slate-50/40 opacity-60'
                  : 'border-slate-100 bg-slate-50/80 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center">
                    Simulado 1
                    {unitProgress.simulado1Completed && (
                      <CheckCircle2 className="w-4 h-4 ml-1.5 text-emerald-600" />
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {unitProgress.simulado1Completed
                      ? `Concluído! Nota: ${getExamScoreFormatted('simulado1', unitProgress.simulado1Score)}/10`
                      : 'Libera após todos os capítulos.'}
                  </p>
                </div>
                {isSimulado1Locked ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  !unitProgress.simulado1Completed && (
                    <button
                      id="btn-take-simulado1"
                      onClick={() => onTakeQuiz('simulado1')}
                      className="px-3 py-1.5 bg-[#00702c] text-white font-bold text-[11px] rounded-lg hover:bg-[#005a23] cursor-pointer"
                    >
                      Iniciar
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Bloco do Simulado 2 */}
            <div
              id="exam-card-simulado2"
              className={`border p-4.5 rounded-2xl transition-all ${
                isSimulado2Locked
                  ? 'border-slate-100 bg-slate-50/40 opacity-60'
                  : 'border-slate-100 bg-slate-50/80 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center">
                    Simulado 2
                    {unitProgress.simulado2Completed && (
                      <CheckCircle2 className="w-4 h-4 ml-1.5 text-emerald-600" />
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {unitProgress.simulado2Completed
                      ? `Concluído! Nota: ${getExamScoreFormatted('simulado2', unitProgress.simulado2Score)}/10`
                      : 'Requer Simulado 1 concluído.'}
                  </p>
                </div>
                {isSimulado2Locked ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  !unitProgress.simulado2Completed && (
                    <button
                      id="btn-take-simulado2"
                      onClick={() => onTakeQuiz('simulado2')}
                      className="px-3 py-1.5 bg-[#00702c] text-white font-bold text-[11px] rounded-lg hover:bg-[#005a23] cursor-pointer"
                    >
                      Iniciar
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Bloco da Avaliação Principal */}
            <div
              id="exam-card-avaliacao"
              className={`border p-4.5 rounded-2xl transition-all ${
                isAvaliacaoLocked
                  ? 'border-slate-100 bg-slate-50/40 opacity-60'
                  : 'border-slate-100 bg-slate-50/80 hover:border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center">
                      Avaliação Regular
                      {isAvaliacaoApproved && (
                        <CheckCircle2 className="w-4 h-4 ml-1.5 text-emerald-600" />
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isAvaliacaoApproved
                        ? `Aprovado! Nota: ${getExamScoreFormatted('avaliacao', unitProgress.avaliacaoScore)}/10`
                        : unitProgress.avaliacaoCompleted && !hasRemainingAttempts
                        ? `Nota Insuficiente (${getExamScoreFormatted('avaliacao', unitProgress.avaliacaoScore)}). Esgotada.`
                        : 'Prova final do módulo escolar.'}
                    </p>
                  </div>
                  {isAvaliacaoLocked ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : null}
                </div>

                {/* Regras e detalhes das tentativas de avaliação */}
                {!isAvaliacaoLocked && (
                  <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Tentativas utilizadas</span>
                      <span className="text-slate-700 font-bold">{attemptsCount} / 2</span>
                    </div>

                    {isAvaliacaoApproved ? (
                      <span className="text-emerald-600 font-bold text-center pt-1 font-sans">
                        Módulo Concluído com Aprovação!
                      </span>
                    ) : worksOnCooldown ? (
                      <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl flex items-center space-x-1.5 mt-1 font-sans">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                        <span className="leading-tight">Nota insuficiente. Nova tentativa liberada em {cooldownHrsRemaining}h.</span>
                      </div>
                    ) : hasRemainingAttempts ? (
                      <button
                        id="btn-take-avaliacao"
                        onClick={() => onTakeQuiz('avaliacao')}
                        className="w-full py-2.5 bg-[#00702c] hover:bg-[#005a23] text-white font-extrabold rounded-lg text-center cursor-pointer shadow-sm"
                      >
                        {attemptsCount === 1 ? 'Iniciar Última Tentativa' : 'Iniciar Prova Principal'}
                      </button>
                    ) : (
                      <span className="text-red-500 text-center pt-1 font-bold font-sans">
                        Tentativas esgotadas. Faça a Recuperação!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bloco da Recuperação Substitutiva */}
            {(isSubstitutaUnlocked || unitProgress.substitutaCompleted) && (
              <div id="exam-card-substituta" className="border border-red-200 bg-red-50 p-4.5 rounded-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-red-700 flex items-center">
                      Avaliação Substituta
                      {unitProgress.substitutaCompleted && (
                        <CheckCircle2 className="w-4 h-4 ml-1.5 text-red-600" />
                      )}
                    </h4>
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {unitProgress.substitutaCompleted
                        ? `Recuperação Realizada! Nota: ${getExamScoreFormatted('substituta', unitProgress.substitutaScore)}/10`
                        : 'Sua chance de aprovação na recuperação final.'}
                    </p>
                  </div>
                </div>

                {!unitProgress.substitutaCompleted && (
                  <button
                    id="btn-take-substituta"
                    onClick={() => onTakeQuiz('substituta')}
                    className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md"
                  >
                    Iniciar Recuperação Final
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
