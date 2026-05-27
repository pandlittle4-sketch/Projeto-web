import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, UserPrivateInfo, UserProgressData, QuizSession, Unit } from './types';
import { UNITS, LESSONS } from './data/lessons';
import { QUESTIONS_BY_UNIT } from './data/questions';

// Componentes Principais
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Telas (Views)
import { Landing } from './views/Landing';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { UnitView } from './views/UnitView';
import { LessonView } from './views/LessonView';
import { QuizView } from './views/QuizView';
import { GradesView } from './views/GradesView';
import { AchievementsView } from './views/AchievementsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPrivateInfo, setUserPrivateInfo] = useState<UserPrivateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Visualizações de Navegação do Mecanismo do Roteador:
  // 'landing', 'auth', 'dashboard', 'unit', 'lesson', 'quiz', 'grades', 'achievements'
  const [activeView, setActiveView] = useState<string>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Identadores de contexto dinâmico
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeQuizSession, setActiveQuizSession] = useState<QuizSession | null>(null);

  // Monitora o ciclo de vida da autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await reloadUserProfileAndPII(user.uid);
        setActiveView((prev) => (prev === 'landing' || prev === 'auth' ? 'dashboard' : prev));
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setUserPrivateInfo(null);
        setActiveView('landing');
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const reloadUserProfileAndPII = async (uid: string) => {
    try {
      // 1. Busca o registro de perfil público
      const profileRef = doc(db, 'users', uid);
      const profileSnap = await getDoc(profileRef);

      const authUser = auth.currentUser;

      if (profileSnap.exists()) {
        const rawData = profileSnap.data() as any;
        let prof: UserProfile;

        if (rawData.progressJson && !rawData.progress) {
          // Migração em tempo de execução para o formato de mapa nativo do Firestore
          try {
            const parsed = JSON.parse(rawData.progressJson);
            prof = {
              displayName: rawData.displayName || 'Estudante',
              level: rawData.level || 1,
              xp: rawData.xp || 0,
              medalhas: rawData.medalhas || ['iniciante'],
              progress: parsed
            };
            if (rawData.genero) prof.genero = rawData.genero;
            await setDoc(profileRef, prof);
          } catch (e) {
            prof = rawData as UserProfile;
          }
        } else {
          prof = rawData as UserProfile;
        }
        
        // Verificação de correção: se o nome ainda for genérico, mas pudermos obter um melhor nome da conta Google (OAuth)
        if (
          (prof.displayName === 'Estudante' || prof.displayName === 'Estudante Google' || prof.displayName === 'Estudante G.') &&
          authUser?.displayName
        ) {
          prof.displayName = authUser.displayName;
          await setDoc(profileRef, prof);
        }
        setUserProfile(prof);
      } else {
        console.warn('Profile record not initialized for user index, creating blank profile fallback.');
        // Configura o perfil padrão inicial para inicialização do banco de dados, se necessário
        const initialProg: UserProgressData = {
          unit1: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
          unit2: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
          unit3: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
          unit4: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
        };

        const rawFullName = authUser?.displayName || 'Estudante';

        const newProf: UserProfile = {
          displayName: rawFullName,
          level: 1,
          xp: 0,
          medalhas: ['iniciante'],
          progress: initialProg
        };
        await setDoc(profileRef, newProf);
        setUserProfile(newProf);

        // Inicializa automaticamente o perfil privado de PII também, caso não exista
        const privateRef = doc(db, 'users', uid, 'private', 'info');
        const defaultPrivate = {
          email: authUser?.email || '',
          nomeCompleto: rawFullName,
          createdAt: new Date().toISOString(),
          userId: uid,
        };
        await setDoc(privateRef, defaultPrivate);
        setUserPrivateInfo(defaultPrivate);
      }

      // 2. Busca os registros de PII
      const privateRef = doc(db, 'users', uid, 'private', 'info');
      const privateSnap = await getDoc(privateRef);
      if (privateSnap.exists()) {
        const priv = privateSnap.data() as UserPrivateInfo;

        // Verificação de correção para o nome das informações privadas
        if (
          (priv.nomeCompleto === 'Estudante' || priv.nomeCompleto === 'Estudante Google') &&
          authUser?.displayName
        ) {
          priv.nomeCompleto = authUser.displayName;
          await setDoc(privateRef, priv);
        }
        setUserPrivateInfo(priv);

        // Correção automática/migração: alinha o displayName público com o nomeCompleto privado registrado
        if (profileSnap.exists()) {
          const rawData = profileSnap.data() as any;
          if (priv.nomeCompleto && rawData.displayName !== priv.nomeCompleto) {
            const updatedProfile = {
              ...rawData,
              displayName: priv.nomeCompleto
            };
            await setDoc(profileRef, updatedProfile);
            setUserProfile(updatedProfile);
          }
        }
      } else {
        // Fallback ou dupla inicialização
        const rawFullName = authUser?.displayName || 'Estudante';
        const defaultPrivate = {
          email: authUser?.email || '',
          nomeCompleto: rawFullName,
          createdAt: new Date().toISOString(),
          userId: uid,
        };
        await setDoc(privateRef, defaultPrivate);
        setUserPrivateInfo(defaultPrivate);
      }
    } catch (error) {
      console.error('Error fetching profiles: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // Callback: Trata a conclusão da leitura da aula
  const handleCompleteLesson = async () => {
    if (!currentUser || !userProfile || !selectedUnitId || !selectedLessonId) return;

    try {
      const progress: UserProgressData = { ...userProfile.progress };
      const unitKey = selectedUnitId as keyof UserProgressData;
      const unitProgress = progress[unitKey];

      if (!unitProgress.lessonsViewed) {
        unitProgress.lessonsViewed = [];
      }

      const isFirstView = !unitProgress.lessonsViewed.includes(selectedLessonId);
      if (isFirstView) {
        unitProgress.lessonsViewed.push(selectedLessonId);

        // Recompensa de pontuação: +10 XP
        const newXp = (userProfile.xp || 0) + 10;
        const newLevel = Math.floor(newXp / 80) + 1; // Meta de 80 XP por nível

        // Verificação de conquistas
        const finalMedals = [...(userProfile.medalhas || [])];
        if (newLevel >= 5 && !finalMedals.includes('gênio')) finalMedals.push('gênio');
        if (newLevel >= 10 && !finalMedals.includes('mestre')) finalMedals.push('mestre');

        const updatedProfile = {
          ...userProfile,
          xp: newXp,
          level: newLevel,
          medalhas: finalMedals,
          progress: progress
        };

        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, updatedProfile);
        setUserProfile(updatedProfile);
      }

      // Transição suave de volta para a tela da Unidade
      setActiveView('unit');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  // Callback: Trata a conclusão do questionário (exercício/simulado)
  const handleCompleteQuiz = async (score: number, totalQuestions: number, xpEarned: number) => {
    if (!currentUser || !userProfile || !selectedUnitId || !activeQuizSession) return;

    try {
      const progress: UserProgressData = { ...userProfile.progress };
      const unitKey = selectedUnitId as keyof UserProgressData;
      const unitProgress = progress[unitKey];

      const type = activeQuizSession.type;
      const topicId = activeQuizSession.topicId;

      if (type === 'exercise' && topicId) {
        if (!unitProgress.exercisesCompleted) unitProgress.exercisesCompleted = [];
        if (!unitProgress.exercisesCompleted.includes(topicId)) {
          unitProgress.exercisesCompleted.push(topicId);
        }
        // Salva a nota do tópico, onde o XP representa o exercício resolvido
        unitProgress.exercisesScores = {
          ...(unitProgress.exercisesScores || {}),
          [topicId]: score // Acompanha a pontuação real obtida
        };
      } else if (type === 'simulado1') {
        unitProgress.simulado1Completed = true;
        unitProgress.simulado1Score = score;
      } else if (type === 'simulado2') {
        unitProgress.simulado2Completed = true;
        unitProgress.simulado2Score = score;
      } else if (type === 'avaliacao') {
        unitProgress.avaliacaoCompleted = true;
        unitProgress.avaliacaoScore = score;
        unitProgress.avaliacaoAttempts = (unitProgress.avaliacaoAttempts || 0) + 1;
        unitProgress.avaliacaoLastAttempt = new Date().toISOString();
      } else if (type === 'substituta') {
        unitProgress.substitutaCompleted = true;
        unitProgress.substitutaScore = score;
      }

      // Métricas de estatísticas de recompensa
      const newXp = (userProfile.xp || 0) + xpEarned;
      const newLevel = Math.floor(newXp / 80) + 1;

      // Atualizações de medalhas de conquistas
      const finalMedals = [...(userProfile.medalhas || [])];
      if (newLevel >= 5 && !finalMedals.includes('gênio')) finalMedals.push('gênio');
      if (newLevel >= 10 && !finalMedals.push && !finalMedals.includes('mestre')) finalMedals.push('mestre');

      // Pontuação perfeita (100% em simulados ou avaliações)
      const isPerfectScore = score === totalQuestions;
      if (isPerfectScore && (type === 'simulado1' || type === 'simulado2' || type === 'avaliacao' || type === 'substituta')) {
        if (!finalMedals.includes('nota10')) finalMedals.push('nota10');
      }

      const updatedProfile = {
        ...userProfile,
        xp: newXp,
        level: newLevel,
        medalhas: finalMedals,
        progress: progress
      };

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile);
      setUserProfile(updatedProfile);

      // Transição de volta para o painel detalhado do módulo
      setActiveView('unit');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const handleTakeQuizTransition = (type: 'exercise' | 'simulado1' | 'simulado2' | 'avaliacao' | 'substituta', topicId?: string) => {
    if (!selectedUnitId) return;

    // Busca o banco de questões correspondente
    const unitMap = QUESTIONS_BY_UNIT[selectedUnitId] || QUESTIONS_BY_UNIT['unit1'];
    let listQuestions = unitMap.exercises;

    if (type === 'exercise' && topicId) {
      listQuestions = unitMap[topicId] || unitMap.exercises;
    } else if (type === 'simulado1') {
      listQuestions = unitMap.simulado1;
    } else if (type === 'simulado2') {
      listQuestions = unitMap.simulado2;
    } else if (type === 'avaliacao') {
      listQuestions = unitMap.avaliacao;
    } else if (type === 'substituta') {
      listQuestions = unitMap.substituta;
    }

    setActiveQuizSession({
      unitId: selectedUnitId,
      type,
      topicId,
      questions: listQuestions
    });

    setActiveView('quiz');
  };

  const currentUnit = selectedUnitId ? UNITS.find(u => u.id === selectedUnitId) : null;
  const currentLesson = selectedLessonId ? LESSONS[selectedLessonId] : null;

  // Recupera com segurança a estrutura de progresso ativa atual
  const activeProgress: UserProgressData = userProfile
    ? userProfile.progress
    : {
        unit1: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
        unit2: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
        unit3: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
        unit4: { lessonsViewed: [], exercisesCompleted: [], exercisesScores: {}, simulado1Completed: false, simulado1Score: 0, simulado2Completed: false, simulado2Score: 0, avaliacaoCompleted: false, avaliacaoScore: 0, avaliacaoAttempts: 0, avaliacaoLastAttempt: null, substitutaCompleted: false, substitutaScore: 0 },
      };

  // Carregamento principal
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fcf9] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#00702c] border-green-100 rounded-full animate-spin" />
        <span className="text-xs text-[#00702c] font-mono tracking-widest uppercase">Conectando ao Matemagic...</span>
      </div>
    );
  }

  // --- 1. Visualizações não autenticadas de visitantes ---
  if (!currentUser || !userProfile) {
    if (activeView === 'auth') {
      return (
        <Auth
          initialMode={authMode}
          onBackToLanding={() => setActiveView('landing')}
          onAuthSuccess={() => setActiveView('dashboard')}
        />
      );
    }
    return (
      <Landing
        onNavigateToAuth={(mode) => {
          setAuthMode(mode);
          setActiveView('auth');
        }}
      />
    );
  }

  // --- 2. Visualizações de alunos autenticados ---
  const activeUnitProgress = selectedUnitId
    ? activeProgress[selectedUnitId as keyof UserProgressData]
    : activeProgress.unit1;

  const topicExerciseLabel = selectedUnitId && selectedLessonId
    ? UNITS.find(u => u.id === selectedUnitId)?.topics.find(t => t.lessonId === selectedLessonId)?.title || ''
    : '';

  return (
    <div className="min-h-screen bg-[#f8fcf9] text-slate-800 flex font-sans leading-normal selection:bg-green-100 selection:text-green-800">
      {/* Barra de navegação lateral (Sidebar) */}
      <Sidebar
        currentView={activeView}
        onNavigate={(view) => {
          setSelectedUnitId(null);
          setSelectedLessonId(null);
          setActiveView(view);
        }}
        onLogout={handleLogout}
        userEmail={userPrivateInfo?.email || currentUser.email}
        userName={userPrivateInfo?.nomeCompleto || userProfile.displayName}
      />

      {/* Painel Principal de Conteúdo */}
      <div className="flex-grow flex-1 pl-20 flex flex-col h-screen overflow-hidden">
        <Header
          userName={userPrivateInfo?.nomeCompleto || userProfile.displayName}
          userXp={userProfile.xp || 0}
          userLevel={userProfile.level || 1}
        />

        {/* Roteamento dinâmico de telas na área central */}
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#f8fcf9]">
          <div className="max-w-5xl mx-auto w-full">
            {activeView === 'dashboard' && (
              <Dashboard
                progress={activeProgress}
                onSelectUnit={(unitId) => {
                  setSelectedUnitId(unitId);
                  setActiveView('unit');
                }}
              />
            )}

            {activeView === 'unit' && currentUnit && (
              <UnitView
                unit={currentUnit}
                unitProgress={activeUnitProgress}
                onBack={() => {
                  setSelectedUnitId(null);
                  setActiveView('dashboard');
                }}
                onStudyLesson={(lessonId) => {
                  setSelectedLessonId(lessonId);
                  setActiveView('lesson');
                }}
                onTakeQuiz={handleTakeQuizTransition}
              />
            )}

            {activeView === 'lesson' && currentLesson && (
              <LessonView
                lesson={currentLesson}
                topicTitle={topicExerciseLabel}
                isCompleted={activeUnitProgress.lessonsViewed?.includes(selectedLessonId || '') || false}
                onBackToUnit={() => {
                  setSelectedLessonId(null);
                  setActiveView('unit');
                }}
                onCompleteLesson={handleCompleteLesson}
              />
            )}

            {activeView === 'quiz' && activeQuizSession && (
              <QuizView
                session={activeQuizSession}
                onBackToUnit={() => {
                  setActiveQuizSession(null);
                  setActiveView('unit');
                }}
                onFinishQuiz={handleCompleteQuiz}
              />
            )}

            {activeView === 'grades' && (
              <GradesView
                progress={activeProgress}
                currentUserXp={userProfile.xp}
                currentUserLevel={userProfile.level}
                currentUserName={userProfile.displayName}
              />
            )}

            {activeView === 'achievements' && (
              <AchievementsView
                medalhas={userProfile.medalhas || []}
                userXp={userProfile.xp}
                userLevel={userProfile.level}
                progress={activeProgress}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
