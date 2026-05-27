import { Unit, Lesson } from '../types';

export const UNITS: Unit[] = [
  {
    id: 'unit1',
    number: 1,
    title: 'Fundamentos',
    description: 'Fundamentos matemáticos, operações básicas, múltiplos, divisores e frações.',
    icon: 'Calculator',
    topics: [
      { id: 'topic11', title: 'Conjuntos Numéricos', lessonId: 'aula11' },
      { id: 'topic12', title: 'Operações Matemáticas', lessonId: 'aula12' },
      { id: 'topic13', title: 'Múltiplos e Divisores', lessonId: 'aula13' },
      { id: 'topic14', title: 'Frações', lessonId: 'aula14' }
    ]
  },
  {
    id: 'unit2',
    number: 2,
    title: 'Proporcionalidade',
    description: 'Razão, proporção, divisão proporcional e regra de três simples e composta.',
    icon: 'Percent',
    topics: [
      { id: 'topic21', title: 'Razão', lessonId: 'aula21' },
      { id: 'topic22', title: 'Proporção', lessonId: 'aula22' },
      { id: 'topic23', title: 'Grandezas', lessonId: 'aula23' },
      { id: 'topic24', title: 'Regra de Três', lessonId: 'aula24' }
    ]
  },
  {
    id: 'unit3',
    number: 3,
    title: 'Números e Medidas',
    description: 'Porcentagem avançada, juros simples/compostos, sistemas métricos e teoria dos conjuntos.',
    icon: 'Scale',
    topics: [
      { id: 'topic31', title: 'Porcentagem', lessonId: 'aula31' },
      { id: 'topic32', title: 'Juros Simples e Compostos', lessonId: 'aula32' },
      { id: 'topic33', title: 'Sistema Métrico Decimal', lessonId: 'aula33' },
      { id: 'topic34', title: 'Teoria dos Conjuntos', lessonId: 'aula34' }
    ]
  },
  {
    id: 'unit4',
    number: 4,
    title: 'Funções',
    description: 'Conceitos gerais, estudo de sinais, funções afins, quadráticas e exponenciais.',
    icon: 'TrendingUp',
    topics: [
      { id: 'topic41', title: 'Conceito de Função', lessonId: 'aula41' },
      { id: 'topic42', title: 'Função Afim', lessonId: 'aula42' },
      { id: 'topic43', title: 'Função Quadrática', lessonId: 'aula43' },
      { id: 'topic44', title: 'Função Exponencial', lessonId: 'aula44' }
    ]
  }
];

export const LESSONS: Record<string, Lesson> = {
  aula11: {
    id: 'aula11',
    title: 'Conjuntos Numéricos',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Introdução aos Conjuntos',
        content: [
          'Os conjuntos numéricos são agrupamentos de números com características específicas, essenciais para organizar, contar, medir e expressar grandezas não fracionáveis.',
          'Eles foram organizados à medida que o homem evoluiu sua forma de contagem. O primeiro deles foi o conjunto de números Naturais (N), que surgiu naturalmente no início da civilização para representar contagens reais.'
        ]
      },
      {
        title: 'Naturais (N) e Inteiros (Z)',
        content: [
          'O conjunto dos Números Naturais é representado por: N = {0, 1, 2, 3, 4, ...}',
          'Excluindo o zero, temos N* (Naturais não-nulos): N* = {1, 2, 3, 4, ...}',
          'O conjunto dos Números Inteiros (Z) surge com a necessidade de saldos negativos: Z = {... -3, -2, -1, 0, 1, 2, 3, ...}',
          'Possui os subconjuntos Z+ (não-negativos), Z- (não-positivos) e os respectivos não-nulos com asterisco.'
        ]
      },
      {
        title: 'Racionais (Q), Irracionais (I) e Reais (R)',
        content: [
          'Números Racionais (Q) são todos os que podem ser expressos na forma de fração p/q, com p e q inteiros e q não-nulo.',
          'Números Irracionais (I) são decimais infinitos não periódicos (ex: pi = 3.14159..., raiz de 2, raiz de 3, etc.).',
          'A união de Racionais com Irracionais forma o conjunto dos Números Reais (R = Q ∪ I).'
        ],
        highlight: 'Estudo Importante: Qualquer raiz quadrada de número primo é obrigatoriamente um número irracional.'
      }
    ]
  },
  aula12: {
    id: 'aula12',
    title: 'Operações Matemáticas',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Adição e Multiplicação',
        content: [
          'As operações com números reais dão a base para todo o conhecimento matemático. Seus termos mudam de nome:',
          'Na Adição: as partes que se somam são chamadas "parcelas", e o resultado de "soma". Propriedades importantes: Comutativa, Associativa e Elemento Neutro (zero).',
          'Na Multiplicação: as partes são chamadas de "fatores", e o resultado de "produto". Estão presentes propriedades análogas além da Distributiva.'
        ]
      },
      {
        title: 'Potenciação e Radiciação',
        content: [
          'A Potenciação é a multiplicação de fatores iguais: a^n = a · a · ... · a (n fatores).',
          'A Radiciação representa a operação inversa da potenciação: n√a = b se, e somente se, b^n = a.',
          'Lembre-se: se n é par, n√a só admitirá valores reais para radicando maior ou igual a zero.'
        ]
      }
    ]
  },
  aula13: {
    id: 'aula13',
    title: 'Múltiplos e Divisores',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Múltiplos e MMC',
        content: [
          'Dizemos que um número é múltiplo de outro se ele é produto deste por um inteiro: M(a) = a · n, para n ∈ Z.',
          'O Mínimo Múltiplo Comum (MMC) representa o menor múltiplo positivo comum entre dois ou mais algarismos.'
        ]
      },
      {
        title: 'Divisores e MDC',
        content: [
          'Dizemos que "a" divide "b" (a | b) se existir "n" tal que b = a · n.',
          'O Máximo Divisor Comum (MDC) representa o maior elemento divisor comum de dois ou mais números.'
        ],
        highlight: 'Dica de Ouro: O MMC é o produto de todos os divisores simultâneos, enquanto o MDC é exclusivamente o produto dos fatores primos comuns.'
      }
    ]
  },
  aula14: {
    id: 'aula14',
    title: 'Frações',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Conceito e Classificação',
        content: [
          'Frações representam partes de um inteiro que foi dividido em frações iguais. É expressa em numerador / denominador.',
          'Fração Própria: Numerador é menor que o denominador (representa menor que um inteiro).',
          'Fração Imprópria: Numerador é maior ou igual ao denominador (representa um ou mais inteiros completos).'
        ]
      },
      {
        title: 'Operações com Frações',
        content: [
          'Soma de denominadores iguais: Mantém o denominador e opera os numeradores.',
          'Soma de denominadores diferentes: Reduz ao menor denominador comum (MMC) e então opera.',
          'Multiplicação: Multiplica-se numerador com numerador, e denominador com denominador.'
        ]
      }
    ]
  },
  aula21: {
    id: 'aula21',
    title: 'Razão',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Definição de Razão',
        content: [
          'A palavra razão vem do latim "ratio" e indica a divisão ou o quociente entre dois números a e b (expressa como a/b, b ≠ 0).',
          'Nessa escrita, o termo "a" é denominado antecedente, e "b" consequente.'
        ]
      },
      {
        title: 'Razões com Nomes Especiais',
        content: [
          'Velocidade Média: Razão da distância percorrida pelo tempo correspondente gasto.',
          'Densidade Demográfica: População total de uma região dividida pela área superficial ocupada (habitantes por km²).',
          'Escala: Razão constante entre o comprimento medido no desenho e o comprimento real correspondente do objeto.'
        ]
      }
    ]
  },
  aula22: {
    id: 'aula22',
    title: 'Proporção',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'O que é Proporção?',
        content: [
          'Proporção indica a equivalência ou igualdade entre duas razões distintas. Expressa por: a / b = c / d.',
          'Os termos dividem-se em extremos (a, d) e meios (b, c).'
        ]
      },
      {
        title: 'Propriedade Fundamental',
        content: [
          'Em toda proporção coerente, o produto dos meios é igual ao produto dos extremos: a · d = b · c.'
        ],
        highlight: 'Prática: Se precisamos descobrir um quarto termo desconhecido em uma proporção, usamos a multiplicação cruzada.'
      }
    ]
  },
  aula23: {
    id: 'aula23',
    title: 'Grandezas',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Grandezas Diretamente Proporcionais',
        content: [
          'Grandezas dizem-se diretamente proporcionais quando a variação de uma resulta no aumento/diminuição da outra na mesmíssima razão: y / x = k.'
        ]
      },
      {
        title: 'Grandezas Inversamente Proporcionais',
        content: [
          'Dizem-se inversamente profissionais se a variação de uma resulta na variação inversa da outra: x · y = k.'
        ]
      }
    ]
  },
  aula24: {
    id: 'aula24',
    title: 'Regra de Três',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Regra de Três Simples',
        content: [
          'Técnica rápida para achar um valor desconhecido a partir de três valores conhecidos de duas grandezas proporcionais.'
        ]
      },
      {
        title: 'Regra de Três Composta',
        content: [
          'Utilizada se o problema envolve três ou mais grandezas proporcionais ao mesmo tempo.'
        ]
      }
    ]
  },
  aula31: {
    id: 'aula31',
    title: 'Porcentagem',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Razão Centesimal',
        content: [
          'Porcentagem é uma razão centesimal (denominador de proporção igual a 100), denotada pelo símbolo %.'
        ]
      },
      {
        title: 'Fatores de Multiplicação',
        content: [
          'Para acréscimos: Fator = 1 + Taxa decimal (Ex: aumento de 15% multiplica-se por 1,15).',
          'Para descontos: Fator = 1 - Taxa decimal (Ex: desconto de 15% multiplica-se por 0,85).'
        ]
      }
    ]
  },
  aula32: {
    id: 'aula32',
    title: 'Juros Simples e Compostos',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Juros Simples',
        content: [
          'Modalidade calculada apenas sobre o capital primário: J = C · i · t. Montante total M = C + J.'
        ]
      },
      {
        title: 'Juros Compostos',
        content: [
          'Juros calculados cumulativamente sobre o capital acumulado no período anterior (juros sobre juros): M = C · (1 + i)^t.'
        ]
      }
    ]
  },
  aula33: {
    id: 'aula33',
    title: 'Sistema Métrico Decimal',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Unidades de Comprimento e Superfície',
        content: [
          'A unidade padrão de comprimento no SI é o metro (m). Seus múltiplos e submúltiplos escalam em potências de 10.'
        ]
      },
      {
        title: 'Unidades de Tempo e Ângulos de Medidas',
        content: [
          'Diferentemente do linear, estes utilizam sistemas sexagesimais (medidas de base 60).'
        ]
      }
    ]
  },
  aula34: {
    id: 'aula34',
    title: 'Teoria dos Conjuntos',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Conceitos Matemáticos de Conjuntos',
        content: [
          'Ideia de coleção e agrupamento. Operações comuns incluem União (A ∪ B), Intersecção (A ∩ B) e Diferença (A - B).'
        ]
      }
    ]
  },
  aula41: {
    id: 'aula41',
    title: 'Conceito de Função',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Produto Cartesiano',
        content: [
          'Relação onde cada elemento de um primeiro conjunto mapeia explicitamente a um único elemento de um segundo conjunto.'
        ]
      }
    ]
  },
  aula42: {
    id: 'aula42',
    title: 'Função Afim',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Função do Primeiro Grau',
        content: [
          'Fórmula de reta y = ax + b, onde "a" é o coeficiente angular e "b" o ponto de corte retilíneo vertical.'
        ]
      }
    ]
  },
  aula43: {
    id: 'aula43',
    title: 'Função Quadrática',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Função do Segundo Grau',
        content: [
          'Fórmula parabólica y = ax^2 + bx + c. Tem suas raízes calculadas por delta e fórmula clássica de Bhaskara.'
        ]
      }
    ]
  },
  aula44: {
    id: 'aula44',
    title: 'Função Exponencial',
    videoUrl: 'https://www.youtube.com/embed/s5Xv1SIQnQE?si=1T2x0NeFTazd3mLU',
    sections: [
      {
        title: 'Crescimento Exponencial',
        content: [
          'Fórmula do tipo y = a^x, com a > 0 e a ≠ 1. Crescimento acelerado focado em finanças e ecologia.'
        ]
      }
    ]
  }
};
