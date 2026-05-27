import React, { useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { UserProgressData } from '../types';

interface AuthProps {
  initialMode: 'login' | 'register';
  onBackToLanding: () => void;
  onAuthSuccess: () => void;
}

const INITIAL_PROGRESS: UserProgressData = {
  unit1: {
    lessonsViewed: [],
    exercisesCompleted: [],
    exercisesScores: {},
    simulado1Completed: false,
    simulado1Score: 0,
    simulado2Completed: false,
    simulado2Score: 0,
    avaliacaoCompleted: false,
    avaliacaoScore: 0,
    avaliacaoAttempts: 0,
    avaliacaoLastAttempt: null,
    substitutaCompleted: false,
    substitutaScore: 0,
  },
  unit2: {
    lessonsViewed: [],
    exercisesCompleted: [],
    exercisesScores: {},
    simulado1Completed: false,
    simulado1Score: 0,
    simulado2Completed: false,
    simulado2Score: 0,
    avaliacaoCompleted: false,
    avaliacaoScore: 0,
    avaliacaoAttempts: 0,
    avaliacaoLastAttempt: null,
    substitutaCompleted: false,
    substitutaScore: 0,
  },
  unit3: {
    lessonsViewed: [],
    exercisesCompleted: [],
    exercisesScores: {},
    simulado1Completed: false,
    simulado1Score: 0,
    simulado2Completed: false,
    simulado2Score: 0,
    avaliacaoCompleted: false,
    avaliacaoScore: 0,
    avaliacaoAttempts: 0,
    avaliacaoLastAttempt: null,
    substitutaCompleted: false,
    substitutaScore: 0,
  },
  unit4: {
    lessonsViewed: [],
    exercisesCompleted: [],
    exercisesScores: {},
    simulado1Completed: false,
    simulado1Score: 0,
    simulado2Completed: false,
    simulado2Score: 0,
    avaliacaoCompleted: false,
    avaliacaoScore: 0,
    avaliacaoAttempts: 0,
    avaliacaoLastAttempt: null,
    substitutaCompleted: false,
    substitutaScore: 0,
  },
};

export const Auth: React.FC<AuthProps> = ({ initialMode, onBackToLanding, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [genero, setGenero] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Faltam preencher campos primários.');
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Por favor, informe seu nome completo.');
        setLoading(false);
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMsg('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      if (!genero) {
        setErrorMsg('Por favor, selecione seu gênero.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'register') {
        // Registra as credenciais de autenticação
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Usa o nome completo como displayName
        const displayName = fullName.trim();

        // 1. Escreve o perfil público do usuário na coleção /users/{userId}
        const profilePath = `users/${uid}`;
        try {
          const defaultProfile = {
            displayName: displayName,
            level: 1,
            xp: 0, // O XP inicial começa em zero
            medalhas: ['iniciante'], // Concede medalha "iniciante" automaticamente
            progress: INITIAL_PROGRESS,
            genero: genero,
          };
          await setDoc(doc(db, 'users', uid), defaultProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, profilePath);
        }

        // 2. Escreve as informações privadas (PII) na coleção sub-recurso /users/{userId}/private/info
        const privatePath = `users/${uid}/private/info`;
        try {
          const defaultPrivate = {
            email: email,
            nomeCompleto: fullName,
            createdAt: new Date().toISOString(),
            userId: uid,
            genero: genero,
          };
          await setDoc(doc(db, 'users', uid, 'private', 'info'), defaultPrivate);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, privatePath);
        }

      } else {
        // Fazer login convencional
        await signInWithEmailAndPassword(auth, email, password);
      }

      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      let friendlyError = 'Ocorreu um erro ao processar. Verifique os dados inseridos.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'Este e-mail já está sendo utilizado.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'O endereço de e-mail inserido é inválido.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyError = 'E-mail ou senha incorretos.';
      } else if (err.message && err.message.includes('Firestore Security Error')) {
        try {
          friendlyError = 'Erro nas regras de segurança do Banco: ' + JSON.parse(err.message).error;
        } catch {
          friendlyError = 'Erro nas regras do banco de dados.';
        }
      }
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        throw new Error('Nenhum usuário retornado do Google.');
      }

      // Verifica se o perfil do usuário já existe no banco
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const fullName = user.displayName || 'Estudante Google';
        const email = user.email || '';

        // Usa o nome completo como displayName
        const displayName = fullName.trim();

        // 1. Escreve o perfil público do usuário na coleção /users/{userId}
        const profilePath = `users/${user.uid}`;
        try {
          const defaultProfile = {
            displayName: displayName,
            level: 1,
            xp: 0,
            medalhas: ['iniciante'],
            progress: INITIAL_PROGRESS,
          };
          await setDoc(doc(db, 'users', user.uid), defaultProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, profilePath);
        }

        // 2. Escreve as informações privadas (PII) na coleção sub-recurso /users/{userId}/private/info
        const privatePath = `users/${user.uid}/private/info`;
        try {
          const defaultPrivate = {
            email: email,
            nomeCompleto: fullName,
            createdAt: new Date().toISOString(),
            userId: user.uid,
          };
          await setDoc(doc(db, 'users', user.uid, 'private', 'info'), defaultPrivate);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, privatePath);
        }
      }

      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      let friendlyError = 'Ocorreu um erro ao fazer login com o Google.';
      if (err.code === 'auth/popup-blocked') {
        friendlyError = 'O popup de login foi bloqueado pelo seu navegador.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = 'O login com o Google foi cancelado.';
      } else if (err.message && err.message.includes('Firestore Security Error')) {
        try {
          friendlyError = 'Erro nas regras de segurança do Banco: ' + JSON.parse(err.message).error;
        } catch {
          friendlyError = 'Erro nas regras do banco de dados.';
        }
      }
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] text-[#333] min-h-screen w-full font-sans">
      {/* Sidebar Fixa */}
      <aside className="w-[70px] bg-white border-r border-[#e5e7eb] flex flex-col items-center py-5 fixed h-screen z-[100]">
        <button
          onClick={onBackToLanding}
          className="text-[#666] text-2xl p-3 rounded-xl transition duration-200 hover:bg-[#ecffeb] hover:text-[#03ad3c] cursor-pointer"
          title="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper flex-grow pl-[70px] flex flex-col w-full">
        {/* Header Superior */}
        <header className="top-header bg-white px-10 flex items-center h-20 justify-between border-b border-[#f0f0f0]">
          <button
            onClick={onBackToLanding}
            className="logo text-2xl font-bold text-[#03ad3c] tracking-[1px] bg-transparent border-none cursor-pointer"
          >
            Matemagic
          </button>
        </header>

        {/* Formulário Centralizado */}
        <main className="auth-container flex-1 flex items-center justify-center p-[40px_20px]">
          <section className="auth-card bg-white p-10 rounded-[20px] border border-[#edf2f7] shadow-sm w-full max-w-[400px] text-center">
            <h3 className="text-[#03ad3c] text-3xl font-bold mb-2">
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </h3>
            <p className="text-[#718096] mb-6">
              {mode === 'login' ? 'Acesse seu painel de estudos' : 'Comece sua jornada matemática hoje'}
            </p>

            {/* Mensagem de erro */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-xs text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="text-left">
              {mode === 'register' && (
                <input
                  type="text"
                  placeholder="Nome Completo"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 mb-4 rounded-lg border border-[#ddd] outline-none focus:border-[#03ad3c] transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 rounded-lg border border-[#ddd] outline-none focus:border-[#03ad3c] transition-colors"
              />

              {/* Campo de senha com alternador de visibilidade absoluto */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg border border-[#ddd] outline-none focus:border-[#03ad3c] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#03ad3c] transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Esconder senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Campo de confirmação de senha ao se cadastrar */}
              {mode === 'register' && (
                <div className="relative mb-4">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full p-3 pr-10 rounded-lg border border-[#ddd] outline-none focus:border-[#03ad3c] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#03ad3c] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPasswordConfirm ? "Esconder confirmação de senha" : "Ver confirmação de senha"}
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Opção de Gênero após a confirmação de senha */}
              {mode === 'register' && (
                <div className="mb-4">
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border border-[#ddd] bg-white outline-none focus:border-[#03ad3c] transition-colors cursor-pointer text-sm ${genero === '' ? 'text-slate-400' : 'text-slate-800'}`}
                  >
                    <option value="" disabled>Gênero</option>
                    <option value="Masculino" className="text-slate-800">Masculino</option>
                    <option value="Feminino" className="text-slate-800">Feminino</option>
                    <option value="Outro" className="text-slate-800">Outro</option>
                    <option value="Prefiro não informar" className="text-slate-800">Prefiro não informar</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#03ad3c] hover:bg-[#019432] text-white p-3 rounded-full border-none font-bold cursor-pointer transition-all duration-300 disabled:opacity-50 mt-2"
              >
                {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="my-5 flex items-center justify-center space-x-2">
              <span className="h-px bg-slate-200 flex-grow"></span>
              <span className="text-xs text-slate-400 uppercase font-semibold">ou</span>
              <span className="h-px bg-slate-200 flex-grow"></span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 p-3 rounded-full font-semibold cursor-pointer transition-all duration-300 disabled:opacity-50 shadow-sm"
            >
              <span className="mr-2 font-black tracking-tighter text-base select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              Continuar com o Google
            </button>

            <button
              onClick={() => {
                setErrorMsg('');
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="footer-link block mt-5 bg-transparent border-none text-[#03ad3c] font-semibold text-sm hover:underline cursor-pointer w-full text-center"
            >
              {mode === 'login' ? 'Ainda não tem conta? Crie uma agora' : 'Já possui uma conta? Faça login'}
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};
