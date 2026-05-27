export interface UnitProgress {
  lessonsViewed: string[]; // ex: ['aula11', 'aula12']
  exercisesCompleted: string[]; // Lista de topicIds concluídos (topic1, topic2, etc.)
  exercisesScores: Record<string, number>; // topicId -> nota de 0 a 10 (ou XP)
  simulado1Completed: boolean;
  simulado1Score: number;
  simulado2Completed: boolean;
  simulado2Score: number;
  avaliacaoCompleted: boolean;
  avaliacaoScore: number;
  avaliacaoAttempts: number;
  avaliacaoLastAttempt: string | null; // Data ISO formato string
  substitutaCompleted: boolean;
  substitutaScore: number;
}

export interface UserProgressData {
  unit1: UnitProgress;
  unit2: UnitProgress;
  unit3: UnitProgress;
  unit4: UnitProgress;
}

export interface UserProfile {
  displayName: string;
  level: number;
  xp: number;
  medalhas: string[];
  progress: UserProgressData; // Mapeamento nativo aninhado no Firestore
  genero?: string;
}

export interface UserPrivateInfo {
  email: string;
  nomeCompleto: string;
  createdAt: string;
  userId: string;
  genero?: string;
}

export interface Lesson {
  id: string; // ex: 'aula11'
  title: string;
  videoUrl: string;
  sections: {
    title?: string;
    content: string[]; // Lista de parágrafos informativos
    image?: string; // Chave de imagem opcional
    highlight?: string; // Texto destacado em caixa opcional
  }[];
}

export interface Topic {
  id: string; // e.g. 'topic1'
  title: string;
  lessonId: string; // Aponta para a aula, ex: 'aula11'
}

export interface Unit {
  id: string; // 'unit1', 'unit2', ...
  number: number;
  title: string;
  description: string;
  icon: string; // Ícone ou texto correspondente
  topics: Topic[];
  estimatedMinutes?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  image?: string; // Caminho ou nome da imagem opcional
}

export interface QuizSession {
  unitId: string;
  type: "exercise" | "simulado1" | "simulado2" | "avaliacao" | "substituta";
  topicId?: string; // Apenas para exercício de tópico
  questions: Question[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  level: number;
  xp: number;
  medalhas: string[];
  isCurrentUser?: boolean;
}

export interface ComplementaryMaterial {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'excel' | 'word' | 'link' | 'other';
  fileData?: string; // Dados do arquivo em base64 ou string
  url?: string; // Hiperlink direto para o documento
  createdAt: string;
}
