import React from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onNavigateToAuth: (mode: 'login' | 'register') => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="main-wrapper font-sans bg-[#f8fafc] text-[#333] min-h-screen flex flex-col justify-between">
      {/* Header Superior */}
      <header className="top-header bg-white border-b border-[#f0f0f0] h-20 px-[5%] flex items-center justify-between sticky top-0 z-90">
        <div className="logo text-2xl font-bold text-[#03ad3c] tracking-[1px]">
          Matemagic
        </div>
        <div className="auth-group flex gap-3 items-center">
          <button
            id="btn-landing-register-header"
            onClick={() => onNavigateToAuth('register')}
            className="px-6 py-2 rounded-full border-2 border-[#03ad3c] bg-white text-[#03ad3c] font-bold text-sm hover:bg-[#d6ffdc] transition-all cursor-pointer"
          >
            Cadastrar
          </button>
          <button
            id="btn-landing-login-header"
            onClick={() => onNavigateToAuth('login')}
            className="px-6 py-2 rounded-full border-2 border-[#03ad3c] bg-[#03ad3c] text-white font-bold text-sm hover:bg-[#019432] transition-all cursor-pointer"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="content-container p-[0_25px_40px_25px] max-w-7xl mx-auto w-full flex-1">
        
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-[#03ad3c] to-[#006120] text-white p-8 md:p-[60px_50px] my-[25px] rounded-[15px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 shadow-md">
          <div className="hero-content flex-1 space-y-4">
            <h1 className="text-3xl md:text-[38px] font-bold leading-tight">
              Bem-Vindo ao Matemagic
            </h1>
            <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
              Domine os conteúdos do Ensino Médio de forma intuitiva e prática.
            </p>
          </div>
          
          <div className="hero-image-container flex-initial md:flex-[0_0_350px] flex justify-center md:justify-end items-center relative pr-4">
            {/* Opaque math symbol as styled in original */}
            <GraduationCap className="w-24 h-24 sm:w-32 sm:h-32 opacity-30 text-white animate-pulse" />
          </div>
        </section>

        {/* Sinopse */}
        <article className="synopsis-section max-w-[800px] my-10 md:my-[40px] mx-auto leading-[1.8] text-[#4a5568] text-base md:text-[1.1rem] text-center px-5 space-y-6">
          <h2 className="text-2xl font-bold text-[#333]">Sobre o Matemagic</h2>
          <p className="leading-relaxed">
            O <strong className="text-slate-800 font-bold">Matemagic</strong> é uma plataforma educacional desenvolvida para transformar o aprendizado da matemática em uma jornada clara e envolvente. 
          </p>
          <p className="leading-relaxed">
            Focada nos desafios do Ensino Médio, nossa ferramenta organiza conteúdos essenciais em uma trilha de aprendizado lógica e moderna.
          </p>
          
          <button
            id="btn-landing-get-started"
            onClick={() => onNavigateToAuth('register')}
            className="px-[35px] py-[12px] rounded-[25px] bg-[#03ad3c] text-white font-bold inline-block hover:bg-[#019432] transition-colors mt-5 cursor-pointer shadow-sm hover:shadow"
          >
            Começar agora
          </button> 
        </article>
      </main>

      {/* Rodapé */}
      <footer className="text-center p-[30px] text-slate-400 text-sm mt-auto border-t border-slate-100 bg-white">
        <p>&copy; 2026 Matemagic - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
