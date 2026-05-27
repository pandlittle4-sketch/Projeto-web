import React, { useState } from 'react';
import { Question, QuizSession } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Check, 
  X, 
  Star, 
  Sparkles, 
  TrendingUp, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Trophy, 
  BookOpen, 
  Flame,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizViewProps {
  session: QuizSession;
  onBackToUnit: () => void;
  onFinishQuiz: (score: number, totalQuestions: number, xpEarned: number) => void;
}

// Auxiliar inteligente de formatação dos blocos do enunciado para separar contexto de comando de forma suave
const splitTextAndCommand = (text: string): { context: string; command: string } => {
  if (!text) return { context: '', command: '' };

  const cleanText = text.trim();

  // Procurar por padrões de encerramentos e termos de comando específicos conhecidos
  const patterns = [
    /(\.\s+)(Considerando os dados apresentados, o estado.*)$/i,
    /(\.\s+)(Qual dos locais indicados.*)$/i,
    /(\.\s+)(Supondo que o consumo.*)$/i,
    /(\.\s+)(O candidato que acumular.*)$/i,
    /(\.\s+)(Segundo os dados.*)$/i,
    /(\.\s+)(As melhores opções.*)$/i,
    /(\.\s+)(Mensalmente, ele ultrapassa.*)$/i,
    /(\.\s+)(Se essas mercadorias.*)$/i,
    /(\.\s+)(Um passageiro, ao chegar.*)$/i,
    /(\.\s+)(O milésimo cliente.*)$/i,
    /(\.\s+)(O número mínimo de escolas.*)$/i,
    /(\.\s+)(A próxima partida simultânea.*)$/i,
    /(\.\s+)(Nesse mesmo ano, qual.*)$/i,
    /(\.\s+)(A quantidade de ônibus.*)$/i,
    /(\.\s+)(No ano de 2101.*)$/i,
    /(\.\s+)(Quantos pacotes de fubá.*)$/i,
    /(\.\s+)(O número mínimo de pastas.*)$/i,
    /(\.\s+)(O carpinteiro deverá produzir.*)$/i,
    /(\.\s+)(Assim, para obter.*)$/i,
    /(\.\s+)(Há nessa escola.*)$/i,
    /(\.\s+)(A fração correspondente.*)$/i,
    /(\.\s+)(Sendo V a capacidade.*)$/i,
    /(\.\s+)(Qual a máxima distância.*)$/i,
    /(\.\s+)(A marca escolhida.*)$/i,
    /(\.\s+)(O número total de alunos.*)$/i,
    /(\.\s+)(Que fração da terceira.*)$/i,
    /(\.\s+)(Para manter o preço.*)$/i
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const command = match[2];
      const context = cleanText.substring(0, cleanText.length - command.length).trim();
      return { context, command };
    }
  }

  // Fallback geral: procura o último ponto final/interrogação seguido de letra maiúscula nos últimos 150 caracteres.
  const generalMatcher = /\. ([A-ZÁÉÍÓÚÂÊÔÀÈÌÒÙÇ][^.]+?(\?|:|\.)?)$/;
  const match = cleanText.match(generalMatcher);
  if (match && match.index !== undefined) {
    const parts = [
      cleanText.substring(0, match.index + 1),
      cleanText.substring(match.index + 2)
    ];
    if (parts[1].length > 10 && parts[0].length > 15) {
      return { context: parts[0].trim(), command: parts[1].trim() };
    }
  }

  // Se não encontrar nenhuma divisão segura, joga tudo como contexto
  return { context: cleanText, command: '' };
};

export const QuizView: React.FC<QuizViewProps> = ({ session, onBackToUnit, onFinishQuiz }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [accumulatedXp, setAccumulatedXp] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { questions, type } = session;
  const currentQuestion = questions[currentIdx];
  const { context, command } = splitTextAndCommand(currentQuestion?.text || '');
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedIdx === null || isSubmitted) return;

    const isCorrect = selectedIdx === currentQuestion.correctIndex;
    let earnedXp = 0;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      if (type === 'exercise') {
        earnedXp = 5;
      }
    } else {
      if (type === 'exercise') {
        earnedXp = 1;
      }
    }

    setAccumulatedXp(prev => prev + earnedXp);
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      let finalXpBonus = accumulatedXp;
      const isPerfectScore = correctAnswersCount === questions.length;
      const finalCorrectCount = correctAnswersCount;

      if (type === 'exercise') {
        finalXpBonus = finalCorrectCount * 5 + (questions.length - finalCorrectCount) * 1;
      } else if (type === 'simulado1' || type === 'simulado2') {
        finalXpBonus = 20 + (isPerfectScore ? 25 : 0);
      } else if (type === 'avaliacao' || type === 'substituta') {
        finalXpBonus = 25 + (isPerfectScore ? 30 : 0);
      }

      setAccumulatedXp(finalXpBonus);
      setCorrectAnswersCount(finalCorrectCount);
      setIsFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setIsSubmitted(false);
    }
  };

  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  // Tela final de conclusão do Quiz
  if (isFinished) {
    const doublePercentage = (correctAnswersCount / questions.length) * 100;
    const isApproved = type === 'exercise' || doublePercentage >= 75;

    return (
      <div className="max-w-2xl mx-auto py-12 px-6 sm:px-8 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-100/40 text-center space-y-8 animate-fade-in my-8 text-slate-800">
        
        {/* Ícone de Sucesso Animado */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 blur opacity-40 animate-pulse" />
            <div className="relative w-22 h-22 bg-gradient-to-tr from-[#03ad3c] to-[#006120] rounded-full flex items-center justify-center p-1 shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                {isApproved ? (
                  <Trophy className="w-11 h-11 text-emerald-600 fill-emerald-100/50 animate-bounce-once" />
                ) : (
                  <Award className="w-11 h-11 text-amber-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Títulos informativos */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-black tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">
            ATIVIDADE FINALIZADA OK!
          </span>
          <h3 className="text-3xl font-black text-slate-900 leading-tight">
            {type === 'exercise'
              ? 'Exercício Concluído!'
              : isApproved
              ? 'Excelente! Você Passou!'
              : 'Atividade Concluída'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Seu desempenho foi registrado com sucesso. Os pontos de experiência (XP) adicionados contam para seu ranking no Leaderboard!
          </p>
        </div>

        {/* Resumo de Dados de Performance */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-5 px-6 bg-slate-50/50 border border-slate-150 rounded-2xl">
          <div className="text-center space-y-1">
            <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Questões</span>
            <span className="text-xl font-black text-slate-805 font-mono">{questions.length}</span>
          </div>
          <div className="text-center space-y-1 border-x border-slate-205">
            <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Acertos</span>
            <span className={`text-xl font-black font-mono ${isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
              {correctAnswersCount}
            </span>
          </div>
          <div className="text-center space-y-1">
            <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Ganhos</span>
            <span className="text-xl font-black text-emerald-600 font-mono flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4 text-orange-500 shrink-0 fill-orange-400/30" />
              <span>+{accumulatedXp} XP</span>
            </span>
          </div>
        </div>

        {/* Quadro Pedagógico de Orientação */}
        <div className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {type === 'exercise' ? (
            <p className="text-slate-600 bg-slate-50 border border-slate-150 px-4 py-3 rounded-xl font-medium">
              Parabéns! Praticar é o pilar fundamental para fixar a lógica matemática. Continue sua jornada rumo aos próximos capítulos da unidade!
            </p>
          ) : isApproved ? (
            <p className="text-emerald-800 font-semibold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 block">
              Incrível! Sua pontuação foi superior à média de corte estipulada de 75%. Você foi aprovado e garantiu a excelência nesta atividade de exame!
            </p>
          ) : (
            <p className="text-amber-805 font-semibold bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 block">
              Sua pontuação ficou abaixo de 75%. Indicamos rever as videoaulas do módulo e resoluções dos exercícios antes de tentar novamente.
            </p>
          )}
        </div>

        {/* Ação de salvamento e retorno */}
        <div className="flex justify-center pt-2">
          <button
            id="btn-quiz-save-exit"
            onClick={() => onFinishQuiz(correctAnswersCount, questions.length, accumulatedXp)}
            className="px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md shadow-emerald-200/50 cursor-pointer w-full max-w-xs uppercase tracking-wider font-mono"
          >
            Gravar Dados & Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 text-slate-800 max-w-3xl mx-auto">
      
      {/* Barra de Ações do Card de Cabeçalho */}
      <div className="flex justify-between items-center bg-white/65 p-4 rounded-2xl border border-slate-100 backdrop-blur-md shadow-3xs">
        <button
          id="btn-quiz-cancel"
          onClick={onBackToUnit}
          className="inline-flex items-center space-x-2 text-slate-450 hover:text-red-500 text-sm font-semibold transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform stroke-[2.2px]" />
          <span>Abandonar Quiz</span>
        </button>

        <div className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50/80 px-3.5 py-1.5 rounded-xl border border-emerald-150 flex items-center space-x-1.5 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
          <span>ATIVIDADE: {type.toUpperCase()}</span>
        </div>
      </div>

      {/* Progress Card Unificado */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3.5">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-mono">
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-150/45">
            Questão {currentIdx + 1} de {questions.length}
          </span>
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400/20" />
            <span>{accumulatedXp} XP Acoplados</span>
          </span>
        </div>
        <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-150/60 p-0.5">
          <motion.div
            layoutId="quizProgress"
            className="h-full bg-gradient-to-r from-emerald-400 to-[#03ad3c] rounded-full"
            style={{ width: `${((currentIdx + 1) / questions.length) * 105}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
          />
        </div>
      </div>

      {/* Corpo principal do Enunciado e Questões */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          {/* Corpo do Conteúdo / Pergunta de Enunciado */}
          <div className="space-y-5">
            {/* Texto de Contextualização / Recursos de Apoio */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/40">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Texto Contextual e Recursos de Apoio
              </span>
              <div className="pt-1">
                <p className="text-base sm:text-[17px] text-slate-750 font-normal leading-relaxed antialiased">
                  {context}
                </p>
              </div>
            </div>

            {/* Se a questão possuir uma imagem vinculada, exibe-a aqui com design polido */}
            {currentQuestion.image && (
              <div className="my-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200/60 p-4 rounded-3xl shadow-3xs overflow-hidden">
                <div className="relative group max-w-full">
                  <img
                    src={currentQuestion.image}
                    alt="Anexo de apoio da questão"
                    referrerPolicy="no-referrer"
                    className="max-h-[350px] max-w-full rounded-2xl object-contain border border-slate-100 bg-white shadow-3xs transition-all transform duration-300 group-hover:scale-[1.015]"
                    onError={(e) => {
                      // Fornece um aviso amigável caso a imagem ainda não exista fisicamente na pasta raiz
                      console.warn(`Imagem não encontrada no caminho recomendado: ${currentQuestion.image}`);
                      
                      // Tentativa de carregar extensões ou locais alternativos como fallback inteligente
                      const target = e.currentTarget;
                      const currentSrc = target.src;
                      
                      // Se tentou png, tenta jpg, ou tenta carregar sem a barra inicial se necessário
                      if (currentSrc.endsWith('.png')) {
                        target.src = currentSrc.replace('.png', '.jpg');
                      } else if (currentSrc.endsWith('.jpg')) {
                        target.src = currentSrc.replace('.jpg', '.jpeg');
                      }
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-450 font-black font-mono mt-3.5 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Figura / Esboço de Apoio Anexado
                </span>
              </div>
            )}

            {/* Comando final / Pergunta isolada embaixo */}
            {command && (
              <div className="border-t border-dashed border-slate-200/80 pt-5 mt-5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/40 mb-3">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Pergunta comando
                </span>
                <p className="text-base sm:text-[17px] font-medium text-slate-900 leading-relaxed font-sans">
                  {command}
                </p>
              </div>
            )}
          </div>

          {/* Opções de Alternativas stackeadas verticalmente */}
          <div className="space-y-3 pt-3">
            {currentQuestion.options.map((option, idx) => {
              const isSel = selectedIdx === idx;
              const isCorr = idx === currentQuestion.correctIndex;

              let btnBorderColor = 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-50 hover:border-slate-350 hover:translate-y-[-1px]';
              if (isSubmitted) {
                if (isCorr) {
                  btnBorderColor = 'border-emerald-500 bg-emerald-50/70 text-emerald-905 ring-2 ring-emerald-500/10 shadow-xs scale-[1.015]';
                } else if (isSel) {
                  btnBorderColor = 'border-red-500 bg-red-50/75 text-red-905 ring-2 ring-red-500/10 shadow-xs';
                } else {
                  btnBorderColor = 'border-slate-100 opacity-30 bg-slate-50/20 pointer-events-none scale-98';
                }
              } else if (isSel) {
                btnBorderColor = 'border-emerald-500 bg-emerald-50/60 text-slate-905 ring-2 ring-emerald-500/15 shadow-sm scale-[1.01] font-semibold';
              }

              return (
                <motion.button
                  key={idx}
                  id={`quiz-option-${idx}`}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  whileHover={!isSubmitted ? { scale: 1.005 } : {}}
                  whileTap={!isSubmitted ? { scale: 0.995 } : {}}
                  className={`w-full p-4.5 border text-left text-sm rounded-2xl transition-all duration-200 flex items-start space-x-3.5 cursor-pointer shadow-3xs outline-hidden ${btnBorderColor}`}
                >
                  {/* Letra da Alternativa */}
                  <div className={`w-8 h-8 rounded-xl text-xs font-mono font-black shrink-0 flex items-center justify-center border transition-all duration-250 ${
                    isSubmitted && isCorr
                      ? 'bg-emerald-600 text-white border-emerald-650'
                      : isSubmitted && isSel && !isCorr
                      ? 'bg-red-650 text-white border-red-700'
                      : isSel
                      ? 'bg-emerald-500 text-white border-emerald-555'
                      : 'bg-white border-slate-250 text-slate-450'
                  }`}>
                    {LETTERS[idx]}
                  </div>

                  {/* Texto da Opção */}
                  <div className="flex-1 font-medium leading-relaxed pt-0.5 prose text-slate-800 text-sm">
                    {option}
                  </div>

                  {/* Feedback no formato de selo visual */}
                  {isSubmitted && isCorr && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 self-center shadow-4xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </motion.div>
                  )}
                  {isSubmitted && !isCorr && isSel && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 self-center shadow-4xs"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3px]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Compartimento de Resolução Conceitual Comentada */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                id="quiz-explanation-box"
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 sm:p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 leading-relaxed text-slate-700 shadow-4xs"
              >
                <div className="flex items-center space-x-2 text-xs text-amber-600 font-extrabold tracking-wide uppercase">
                  <div className="p-1 px-1.5 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/15" />
                  </div>
                  <span>Gabarito Comentado & Resolução</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans whitespace-pre-line">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer Navigation Buttons */}
          <div className="pt-5 border-t border-slate-100 flex justify-end">
            {!isSubmitted ? (
              <button
                id="btn-quiz-submit"
                disabled={selectedIdx === null}
                onClick={handleSubmitAnswer}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:hover:bg-emerald-500 disabled:opacity-40 disabled:scale-100 text-white font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md shadow-emerald-100 transition-all font-mono uppercase tracking-wide"
              >
                Registrar Resposta
              </button>
            ) : (
              <motion.button
                id="btn-quiz-next"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleNextQuestion}
                className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center space-x-2 cursor-pointer shadow-md shadow-emerald-150"
              >
                <span>{isLastQuestion ? 'Finalizar Teste' : 'Avançar para Próxima'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
