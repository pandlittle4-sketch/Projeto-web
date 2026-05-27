import { Question } from '../types';

export const QUESTIONS_BY_UNIT: Record<string, Record<string, Question[]>> = {
  unit1: {
    // Capítulo 1: Conjuntos Numéricos
    topic11: [
      {
        id: 'u1_t1_q1',
        text: 'O Ministério da Saúde acompanha com preocupação a difusão da tuberculose no Brasil. Um sistema de vigilância baseia-se no acompanhamento sistemático das taxas de incidência dessa doença nos estados. Depois de credenciar alguns estados a receberem recursos, em 2006, passou a ser de grande importância definir prioridades para a alocação de recursos de combate e de prevenção, levando em consideração as taxas de incidência nos anos de 2000 e 2004, conforme o quadro seguinte. Considerando os dados apresentados, o estado que deve receber a maior prioridade é:',
        options: ['Amapá.', 'Amazonas.', 'Minas Gerais.', 'Pernambuco.', 'Rio de Janeiro.'],
        correctIndex: 0,
        explanation: 'Calculando a variação absoluta (subtração direta): Amapá aumentou 28,1 (37,1 - 9,0); Minas Gerais aumentou 26,9 (27,2 - 0,3); Pernambuco aumentou 7,7. O maior aumento absoluto foi o do Amapá.',
        image: '/imagens/incidencia.png'
      },
      {
        id: 'u1_t1_q2',
        text: 'Camile gosta de caminhar em uma calçada em torno de uma praça circular que possui 500 metros de extensão, localizada perto de casa. A praça, bem como alguns locais ao seu redor e o ponto de onde inicia a caminhada, estão representados na figura. Em uma tarde, Camile caminhou 4.125 metros, no sentido anti-horário, e parou. Qual dos locais indicados na figura é o mais próximo de sua parada?',
        options: ['Centro cultural.', 'Drogaria.', 'Lan house.', 'Ponto de partida.', 'Padaria.'],
        correctIndex: 4,
        explanation: 'Dividindo a distância total pela extensão da pista: 4.125 / 500 = 8 voltas completas e sobra um resto de 125 metros. Como a pista tem 500m, 125m equivale exatamente a 1/4 de volta (ou 2/8). Caminhando no sentido anti-horário, 1/4 de volta a deixa exatamente em frente à Padaria.',
        image: '/imagens/praca.png'
      },
      {
        id: 'u1_t1_q3',
        text: 'No quadro a seguir, encontra-se a conta de água de uma mesma residência. Além do valor a pagar, a descrição mostra como calculá-lo, em função do consumo de água (em m³). Observe que, na conta de água, existe uma tarifa mínima e diferentes faixas de tarifação. Supondo que o consumo d\'água duplique, o novo valor da conta será de:',
        options: ['R$ 22,90.', 'R$ 106,46.', 'R$ 43,82.', 'R$ 17,40.', 'R$ 22,52.'],
        correctIndex: 2,
        explanation: 'O novo consumo é de 34 m³. O cálculo detalhado fica: Primeiros 10 m³ = R$ 5,50 (tarifa mínima). Próximos 10 m³ (faixa 11 a 20) = 10 x 0,85 = R$ 8,50. Próximos 10 m³ (faixa 21 a 30) = 10 x 2,13 = R$ 21,30. Restante de 4 m³ (faixa 31 a 50) = 4 x 2,13 = R$ 8,52. Somando tudo: 5,50 + 8,50 + 21,30 + 8,52 = R$ 43,82.',
        image: '/imagens/conta_agua.png'
      },
      {
        id: 'u1_t1_q4',
        text: 'Imagine uma eleição envolvendo 3 candidatos, A, B, C e 33 eleitores (votantes). Cada eleitor vota fazendo uma ordenação dos três candidatos. Os resultados são os seguintes: ABC (10), ACB (04), BAC (02), BCA (07), CAB (03), CBA (07). Considere o sistema de eleição no qual cada candidato ganha 3 pontos quando for escolhido em 1º lugar, 2 pontos quando for escolhido em 2º lugar e 1 ponto se for escolhido em 3º lugar. O candidato que acumular mais pontos é eleito. Neste caso:',
        options: [
          'A é eleito com 66 pontos.',
          'A é eleito com 68 pontos.',
          'B é eleito com 68 pontos.',
          'B é eleito com 70 pontos.',
          'C é eleito com 68 pontos.'
        ],
        correctIndex: 1,
        explanation: 'Calculando a pontuação de A: 1º lugar: (10 + 4) x 3 = 42 pontos. 2º lugar: (2 + 3) x 2 = 10 pontos. 3º lugar: (7 + 7) x 1 = 14 pontos. Total de A = 42 + 10 + 14 = 68 pontos. Fazendo o mesmo para os outros, nota-se que A vence a disputa.',
        image: '/imagens/quadro_eleicao.png'
      },
      {
        id: 'u1_t1_q5',
        text: 'Economia global pode estagnar. A organização prevê um crescimento global de 2,4% em 2020, uma queda em relação à previsão feita em novembro, de 2,9%. Para a OCDE, se o surto for mais duradouro e intenso, ele pode derrubar essa taxa para 1,5% em 2020. Os dados acima correspondem a uma matéria jornalística publicada no dia 7 de março de 2020. Segundo os dados desse período, pode-se considerar que:',
        options: [
          'O PIB do Brasil não irá desacelerar em 2020.',
          'Queda de 1,5% nas exportações diretas.',
          'A retração mundial, segundo a OCDE, para o caso de um surto mais duradouro, será de 1,4%.',
          'A Itália é o país que sofrerá mais com a retração.',
          'A desaceleração do PIB será superior a 3%.'
        ],
        correctIndex: 2,
        explanation: 'A taxa prevista inicialmente em novembro era de 2,9%. Caso o surto se tornasse mais severo e duradouro, a nova projeção seria reduzida para 1,5%. A retração (redução imposta na estimativa do crescimento) é a diferença direta entre as previsões: 2,9% - 1,5% = 1,4%.',
        image: '/imagens/pib.png'
      }
    ],

    // Capítulo 2: Operações Matemáticas
    topic12: [
      {
        id: 'u1_t2_q1',
        text: 'Na cidade de João e Maria, haverá shows em uma boate. Pensando em todos, a boate propôs pacotes para que os fregueses escolhessem o que seria melhor para si. Pacote 1: taxa de 40 reais por show. Pacote 2: taxa de 80 reais mais 10 reais por show. Pacote 3: taxa de 60 reais para 4 shows, e 15 reais por cada show a mais. João assistirá a 7 shows e Maria, a 4. As melhores opções para João e Maria são, respectivamente, os pacotes:',
        options: ['1 e 2.', '2 e 2.', '3 e 1.', '2 e 1.', '3 e 3.'],
        correctIndex: 4,
        explanation: 'Para João (7 shows): Pacote 1 = 7 × 40 = R$ 280,00; Pacote 2 = 80 + (7 × 10) = R$ 150,00; Pacote 3 = 60 + (3 × 15) = R$ 105,00. Melhor opção: Pacote 3. Para Maria (4 shows): Pacote 1 = 4 × 40 = R$ 160,00; Pacote 2 = 80 + (4 × 10) = R$ 120,00; Pacote 3 = R$ 60,00. Melhor opção: Pacote 3. Portanto, a resposta correta é 3 e 3.'
      },
      {
        id: 'u1_t2_q2',
        text: 'Estamos vivendo em um período em que a água está ficando escassa no planeta. De acordo com a Organização das Nações Unidas (ONU), cada pessoa deve consumir, diariamente, 50 litros de água para suprir suas necessidades diárias. Nesse sentido, João consome, em média, por dia, 57 litros de água. Mensalmente, ele ultrapassa a orientação da ONU em:',
        options: ['7 litros.', '107 litros.', '210 litros.', '1 500 litros.', '1 710 litros.'],
        correctIndex: 2,
        explanation: 'João consome 7 litros a mais por dia do que o recomendado (57 - 50 = 7). Considerando um mês comercial padrão de 30 dias: 7 litros/dia x 30 dias = 210 litros no mês.'
      },
      {
        id: 'u1_t2_q3',
        text: 'Lucas comprou, em uma loja de informática, 6 artigos: um laptop, no valor de R$ 1 800,00; uma impressora por R$ 960,00; e 4 cartuchos de tinta para impressora que custam R$ 75,00 a unidade. Se essas mercadorias foram pagas em 6 parcelas iguais, o valor de cada parcela, em reais, foi de:',
        options: ['R$ 3 060,00.', 'R$ 1 530,00.', 'R$ 1 020,00.', 'R$ 510,00.', 'R$ 320,00.'],
        correctIndex: 3,
        explanation: 'Primeiro calcula-se o total da compra: 1800 + 960 + (4 x 75) = 1800 + 960 + 300 = R$ 3.060,00. Dividindo o valor total pelas 6 parcelas iguais: 3060 / 6 = R$ 510,00 por parcela.'
      },
      {
        id: 'u1_t2_q4',
        text: 'Em um aeroporto, os passageiros devem submeter suas bagagens a uma das cinco máquinas de raio-X disponíveis ao adentrarem a sala de embarque. Num dado instante, o tempo gasto por essas máquinas para escanear a bagagem de cada passageiro e o número de pessoas presentes em cada fila estão apresentados em um painel, como mostrado nas figuras abaixo. Um passageiro, ao chegar à sala de embarque desse aeroporto no instante indicado, visando esperar o menor tempo possível, deverá se dirigir à máquina',
        options: ['1.', '2.', '3.', '4.', '5.'],
        correctIndex: 1,
        explanation: 'Multiplicando o tempo pelo número de pessoas para obter a espera total de cada fila: M1 = 35x5 = 175s; M2 = 25x6 = 150s; M3 = 22x7 = 154s; M4 = 40x4 = 160s; M5 = 20x8 = 160s. O menor tempo de espera é na Máquina 2.',
        image: '/imagens/aeroporto.png'
      }
    ],

    // Capítulo 3: Múltiplos e Divisores (MDC e MMC)
    topic13: [
      {
        id: 'u1_t3_q1',
        text: 'Uma loja decide premiar seus clientes. Cada cliente receberá um dos seis possíveis brindes disponíveis, conforme sua ordem de chegada na loja: bola, chaveiro, caneta, refrigerante, sorvete e CD, nessa ordem. O milésimo cliente receberá de brinde um(a):',
        options: ['Bola.', 'Caneta.', 'Refrigerante.', 'Sorvete.', 'CD.'],
        correctIndex: 2,
        explanation: 'Como são 6 brindes que se repetem ciclicamente, dividimos 1000 por 6. O quociente é 166 (voltas completas no ciclo) e o resto é 4. O quarto brinde da sequência é o refrigerante (1º bola, 2º chaveiro, 3º caneta, 4º refrigerante).'
      },
      {
        id: 'u1_t3_q2',
        text: 'O gerente de um cinema vai distribuir 400 ingressos para uma sessão vespertina e 320 ingressos para uma sessão noturna. Cada escola deverá receber ingressos para uma única sessão; todas as escolas devem receber o mesmo número de ingressos e não haverá sobra. O número mínimo de escolas que podem ser escolhidas é:',
        options: ['2.', '4.', '9.', '40.', '80.'],
        correctIndex: 2,
        explanation: 'Para minimizar o número de escolas, devemos maximizar o número de ingressos por escola usando o MDC(400, 320) = 80. O número total de escolas será (400 / 80) + (320 / 80) = 5 + 4 = 9 escolas.'
      },
      {
        id: 'u1_t3_q3',
        text: 'De um terminal rodoviário, partem ônibus de três empresas, A, B e C. Os ônibus da empresa A partem a cada 15 minutos; da empresa B, a cada 20 minutos; da empresa C, a cada 25 minutos. Às 7 h, partem simultaneamente 3 ônibus. A próxima partida simultânea será às:',
        options: ['9 h.', '9 h 50min.', '10 h 30min.', '11 h.', '12 h.'],
        correctIndex: 4,
        explanation: 'Devemos calcular o MMC de 15, 20 e 25 para descobrir após quantos minutos eles partirão juntos novamente. MMC(15, 20, 25) = 300 minutos. Convertendo para horas: 300 / 60 = 5 horas. Partindo das 7 h, a próxima partida será às 7 + 5 = 12 h.'
      },
      {
        id: 'u1_t3_q4',
        text: 'Os meses de janeiro, março, maio, julho, agosto, outubro e dezembro possuem 31 dias, e os demais, com exceção de fevereiro, possuem 30 dias. O dia 31 de março de certo ano ocorreu em uma terça-feira. Nesse mesmo ano, qual dia da semana será o dia 12 de outubro?',
        options: ['Domingo.', 'Segunda-feira.', 'Terça-feira.', 'Quinta-feira.', 'Sexta-feira.'],
        correctIndex: 1,
        explanation: 'Contamos os dias de 31 de março até 12 de outubro: Abril (30), Maio (31), Junho (30), Julho (31), Agosto (31), Setembro (30) e 12 dias de Outubro. Total = 30+31+30+31+31+30+12 = 195 dias. Dividindo 195 por 7, temos resto 6. Avançando 6 dias a partir de terça-feira (ou voltando 1 dia), chegamos a uma segunda-feira.'
      },
      {
        id: 'u1_t3_q5',
        text: 'Um grupo de 846 pessoas vai fazer uma viagem. A empresa dispõe de ônibus com capacidade máxima de 45 pessoas (R$ 600,00) e vans com capacidade para 20 pessoas (R$ 280,00). A quantidade de ônibus e vans para acomodar todos sentados com o menor custo possível é:',
        options: ['18 ônibus.', '19 ônibus.', '18 ônibus e 1 van.', '18 ônibus e 2 vans.', '43 vans.'],
        correctIndex: 3,
        explanation: 'O custo por pessoa no ônibus cheio é R$600/45 ≈ R$13,33, e na van é R$280/20 = R$14,00. Logo, compensa usar o máximo de ônibus possível. 846 / 45 = 18 ônibus com resto de 36 pessoas. Para levar as 36 pessoas restantes: alugar mais 1 ônibus custa R$600. Alugar 2 vans (capacidade 40) custa 2 x R$280 = R$560. Como R$560 é mais barato que R$600, a combinação ideal é 18 ônibus e 2 vans.'
      },
      {
        id: 'u1_t3_q6',
        text: 'O ciclo de atividade magnética do Sol tem um período de 11 anos. O início do primeiro ciclo registrado se deu no começo de 1755 e se estendeu até o final de 1765. No ano de 2101, o Sol estará no ciclo de atividade magnética de número:',
        options: ['32.', '34.', '33.', '35.', '31.'],
        correctIndex: 0,
        explanation: 'O primeiro ciclo começou em 1755. A diferença de anos até 2101 é 2101 - 1755 = 346 anos. Como cada ciclo dura 11 anos, dividimos 346 por 11, resultando em 31,45. Isso significa que já se passaram 31 ciclos completos e estamos no decorrer do 32º ciclo.'
      },
      {
        id: 'u1_t3_q7',
        text: 'Foram arrecadados 120 pacotes de feijão, 168 de arroz, 192 de açúcar e 240 de fubá. Eles serão organizados em cestas básicas idênticas, contendo o maior número de cestas possível e sem sobras. Quantos pacotes de fubá serão colocados em cada cesta?',
        options: ['8 pacotes.', '10 pacotes.', '12 pacotes.', '15 pacotes.', '20 pacotes.'],
        correctIndex: 1,
        explanation: 'Primeiro, calculamos o MDC dos pacotes para obter o número máximo de cestas: MDC(120, 168, 192, 240) = 24 cestas. Como há 240 pacotes de fubá no total, a quantidade por cesta será 240 / 24 = 10 pacotes.'
      },
      {
        id: 'u1_t3_q8',
        text: 'Um estagiário deve organizar documentos em pastas: 42 contratos de locação, 30 contratos de compra e venda e 18 laudos. Todas as pastas devem conter a mesma quantidade de documentos, sem misturar tipos diferentes e usando a menor quantidade possível de pastas. O número mínimo de pastas é:',
        options: ['13.', '15.', '26.', '28.', '30.'],
        correctIndex: 1,
        explanation: 'Para usar o menor número de pastas, cada pasta deve conter o maior número de documentos possível. Calculamos o MDC(42, 30, 18) = 6 documentos por pasta. O total de pastas será: (42/6) + (30/6) + (18/6) = 7 + 5 + 3 = 15 pastas.'
      },
      {
        id: 'u1_t3_q9',
        text: 'Um arquiteto vai cortar tábuas retiradas de uma casa: 40 tábuas de 540 cm, 30 de 810 cm e 10 de 1 080 cm. Devem ser cortadas em pedaços de mesmo comprimento, sem sobras, com o maior tamanho possível, mas menor que 2 m (200 cm). O carpinteiro deverá produzir:',
        options: ['105 peças.', '120 peças.', '210 peças.', '243 peças.', '420 peças.'],
        correctIndex: 4,
        explanation: 'O MDC das dimensões originais (540, 810, 1080) é 270 cm (2,7 m). Porém, os pedaços devem ter menos de 2 m (200 cm). O maior divisor comum abaixo de 200 cm é 270 / 2 = 135 cm. Calculando o número de peças produzidas: Dimensão total = (40x540) + (30x810) + (10x1080) = 21600 + 24300 + 10800 = 56700 cm. Total de peças = 56700 / 135 = 420 peças.'
      }
    ],

    // Capítulo 4: Frações (Razão e Frações)
    topic14: [
      {
        id: 'u1_t4_q1',
        text: 'Pitágoras relacionou notas musicais e frações. Para encontrar a nota Lá (16/27), multiplica-se a nota Sol (2/3) por 8/9. Assim, para obter a nota Fá (3/4), deve-se multiplicar a nota Mi (64/81) por:',
        options: ['8/9', '9/8', '243/256', '256/243', '192/324'],
        correctIndex: 2,
        explanation: 'Para descobrir o fator multiplicador, basta efetuar a operação inversa (divisão): (3/4) ÷ (64/81) = (3/4) * (81/64) = 243/256.'
      },
      {
        id: 'u1_t4_q2',
        text: 'Numa escola: 1/3 das crianças usa sandálias; 1/4 usa tênis; 1/5 usa sapatos, e os 52 restantes usam outros calçados. Há nessa escola um total de:',
        options: ['280 crianças.', '270 crianças.', '260 crianças.', '250 crianças.', '240 crianças.'],
        correctIndex: 4,
        explanation: 'Somando as frações conhecidas: 1/3 + 1/4 + 1/5 = 20/60 + 15/60 + 12/60 = 47/60. A fração restante para completar o todo é de 13/60, que corresponde às 52 crianças restantes. Se 13/60 = 52, então 1/60 = 4. Portanto, o total é 60 * 4 = 240 crianças.'
      },
      {
        id: 'u1_t4_q3',
        text: 'Venderam-se 3/4 de um bolo de chocolate, 2/3 de um bolo de creme e 5/6 de um bolo de nozes. A fração correspondente ao que sobrou dos três bolos juntos é:',
        options: ['1/2', '1/4', '3/4', '5/6', '3/8'],
        correctIndex: 2,
        explanation: 'Calculamos o que sobrou de cada bolo individualmente: Chocolate sobrou 1/4 (1 - 3/4); Creme sobrou 1/3 (1 - 2/3); Nozes sobrou 1/6 (1 - 5/6). Somando as sobras: 1/4 + 1/3 + 1/6 = 3/12 + 4/12 + 2/12 = 9/12. Simplificando a fração por 3, obtemos 3/4.'
      },
      {
        id: 'u1_t4_q4',
        text: 'O açude A estava com 1/4 de sua capacidade e o açude B com 1/5. O produtor resolveu passar 3/4 da água do açude B para o açude A. Sendo V a capacidade total de um açude, para que o açude A fique completo, faltam:',
        options: ['3/4 V litros.', '2/5 V litros.', '2/3 V litros.', '3/5 V litros.', '4/3 V litros.'],
        correctIndex: 3,
        explanation: 'A quantidade transferida de B para A é: 3/4 * 1/5 = 3/20 de V. O açude A já possuía 1/4 de sua capacidade (ou 5/20). O novo volume de A passa a ser: 5/20 + 3/20 = 8/20 = 2/5 de V. Para ficar completamente cheio (5/5), faltam: 5/5 - 2/5 = 3/5 V litros.'
      },
      {
        id: 'u1_t4_q5',
        text: 'No tanque de um carro cabem até 50 L e o rendimento é de 15 km/L. Ao sair para uma viagem de 600 km, o motorista viu o medidor marcando 3/4 do tanque. Existem postos a 150 km, 187 km, 450 km, 500 km e 570 km. Qual a máxima distância que poderá percorrer até ser necessário reabastecer para não ficar sem combustível?',
        options: ['570.', '500.', '450.', '187.', '150.'],
        correctIndex: 2,
        explanation: 'O ponteiro aponta para a marca correspondente a 3/4 do tanque. Calculando o volume disponível: 3/4 * 50 = 37,5 litros. Multiplicando pelo rendimento do automóvel: 37,5 L * 15 km/L = 562,5 km de autonomia máxima. O posto mais distante que ele consegue alcançar com segurança antes de secar o tanque (limite de 562,5 km) fica situado a 450 km.'
      },
      {
        id: 'u1_t4_q6',
        text: 'Concentração de fibras de pães integrais (fibra por pão): A (2g a cada 50g), B (5g a cada 40g), C (5g a cada 100g), D (6g a cada 90g), E (7g a cada 70g). Recomenda-se a maior concentração. A marca escolhida é:',
        options: ['A.', 'B.', 'C.', 'D.', 'E.'],
        correctIndex: 1,
        explanation: 'Análise da concentração de cada marca (razão fibra/pão): A = 2/50 = 0,04; B = 5/40 = 0,125; C = 5/100 = 0,05; D = 6/90 = 0,066...; E = 7/70 = 0,10. A maior concentração está presente na Marca B (0,125).'
      },
      {
        id: 'u1_t4_q7',
        text: 'Numa pesquisa sobre festas de formatura: 1/3 dos alunos prefere a tradicional, 1/8 quer um churrasco, 2/5 gostaria de uma viagem e 17 alunos não responderam. O número total de alunos do 3º ano é:',
        options: ['90 alunos.', '100 alunos.', '110 alunos.', '120 alunos.', '130 alunos.'],
        correctIndex: 3,
        explanation: 'Somando as frações dos alunos que opinaram: 1/3 + 1/8 + 2/5. O MMC entre 3, 8 e 5 é 120. Convertendo as frações: 40/120 + 15/120 + 48/120 = 103/120. A fração que não opinou corresponde a 120/120 - 103/120 = 17/120. Se 17/120 equivale a 17 alunos, então o grupo inteiro possui um total de 120 alunos.'
      },
      {
        id: 'u1_t4_q8',
        text: 'A garrafa 1 (volume V) tem 2/3 de óleo e 1/3 de água. A garrafa 2 (volume 2V) tem 3/5 de óleo e 2/5 de água. O conteúdo de ambas é derramado em uma terceira garrafa (capacidade 3V). Que fração da terceira garrafa corresponde à quantidade total de óleo?',
        options: ['10/15', '5/15', '28/45', '17/45', '3/8'],
        correctIndex: 2,
        explanation: 'Definindo a capacidade da garrafa 1 como V. O volume total derramado na terceira garrafa é V (da primeira) + 2V (da segunda) = 3V. Quantidade de óleo da garrafa 1: 2/3 * V. Quantidade de óleo da garrafa 2: 3/5 * 2V = 6/5 * V. Somando todo o óleo: 2/3 * V + 6/5 * V = (10/15 + 18/15) * V = 28/15 * V. A proporção de óleo em relação à garrafa 3 (3V) é: (28/15 * V) / 3V = 28/45.'
      },
      {
        id: 'u1_t4_q9',
        text: 'Um suco é feito com 2/3 de polpa de morango e 1/3 de polpa de acerola. A embalagem de morango custa R$ 18,00 e a de acerola vai subir de R$ 14,70 para R$ 15,30. Para manter o preço final do suco igual, qual deve ser a redução, em real, no preço da embalagem de morango?',
        options: ['1,20.', '0,90.', '0,60.', '0,40.', '0,30.'],
        correctIndex: 4,
        explanation: 'O custo atual do suco composto é: 2/3 * 18,00 + 1/3 * 14,70 = 12,00 + 4,90 = R$ 16,90. O aumento da acerola foi de 15,30 - 14,70 = R$ 0,60. Como a acerola representa 1/3 do suco, esse aumento impacta o custo final em 1/3 * 0,60 = R$ 0,20. Para neutralizar esse acréscimo de R$ 0,20, a redução na polpa de morango (que representa 2/3 do composto) deve satisfazer: 2/3 * Redução = 0,20 -> Redução = 0,60 / 2 = R$ 0,30.'
      }
    ],

    // Fallback global de exercícios generalizados para a Unidade 1
    exercises: [
      {
        id: 'u1_q_fb_1',
        text: 'A Organização das Nações Unidas (ONU) recomenda o consumo diário mínimo de água de 50 litros por pessoa. Se um estudante consome 57 litros por dia, qual o excedente mensal em um período de 30 dias?',
        options: ['7 litros', '107 litros', '210 litros', '1500 litros', '1710 litros'],
        correctIndex: 2,
        explanation: 'O excesso diário é de 57 - 50 = 7 litros. Em 30 dias, o excesso acumulado é 7 * 30 = 210 litros.'
      }
    ],

    simulado1: [
      {
        id: 'u1_s1_q1',
        text: 'Seja A o conjunto dos números naturais pares de 1 a 10 e B o conjunto composto pelos divisores inteiros de 12. A intersecção A ∩ B contém quantos elementos?',
        options: ['1 elemento', '2 elementos', '3 elementos', '4 elementos', 'Nenhum'],
        correctIndex: 2,
        explanation: 'A = {2, 4, 6, 8, 10}. Divisores positivos de 12 em B: {1, 2, 3, 4, 6, 12}. Os elementos comuns são {2, 4, 6}, totalizando 3 elementos.'
      },
      {
        id: 'u1_s1_q2',
        text: 'No dispositivo de cálculo do MDC de 36 e 24 por divisões sucessivas (Euclides), qual o penúltimo resto que determina o divisor máximo comum?',
        options: ['12', '6', '2', '3', 'Zero'],
        correctIndex: 0,
        explanation: '36 dividido por 24 dá quociente 1 e resto 12. 24 dividido por 12 dá quociente 2 e resto zero. Os divisores comuns totais resultam no MDC de 12.'
      }
    ],
    simulado2: [
      {
        id: 'u1_s2_q1',
        text: 'Calcule a dízima periódica simples 0,777... expressa sob forma de fração geratriz irredutível.',
        options: ['77/100', '7/9', '77/90', '7/10', '1/7'],
        correctIndex: 1,
        explanation: 'Pela regra de conversão de dízimas periódicas simples de período simples, a dízima 0,777... equivale a x = 7/9.'
      }
    ],
    avaliacao: [
      {
        id: 'u1_av_q1',
        text: 'Ao simplificar a expressão matemática [(2³ · 2²)⁴] / 2¹⁵, qual a potência restante no final da operação?',
        options: ['2⁵', '2¹', '2⁰', '2⁸', '2²'],
        correctIndex: 0,
        explanation: 'Dentro dos parênteses: 2³ * 2² = 2⁵. Elevado ao expoente: (2⁵)⁴ = 2²⁰. Efetuando a divisão: 2²⁰ / 2¹⁵ = 2⁵.'
      },
      {
        id: 'u1_av_q2',
        text: 'Em uma sala de aula, 2/3 dos matriculados gostam de conjuntos numéricos. Se foram catalogados 24 alunos com essa preferência, qual a contagem total da turma?',
        options: ['30 alunos', '36 alunos', '48 alunos', '18 alunos', '24 alunos'],
        correctIndex: 1,
        explanation: 'Se 2/3 equivale a 24 alunos, então 1/3 equivale a 12 alunos. A quantidade total é 3 * 12 = 36 alunos.'
      }
    ],
    substituta: [
      {
        id: 'u1_sub_q1',
        text: 'Resolva a soma simplificada das frações 4/5 e 1/2.',
        options: ['5/7', '5/10', '13/10', '8/5', '2/5'],
        correctIndex: 2,
        explanation: 'O MMC entre 5 e 2 é 10. Normalizando as frações: 8/10 + 5/10 = 13/10.'
      }
    ]
  },
  unit2: {} as Record<string, Question[]>,
  unit3: {} as Record<string, Question[]>,
  unit4: {} as Record<string, Question[]>
};

// Carga dinâmica para as demais unidades de forma similar ao funcionamento original
const MOCK_OPTIONS = ['Opção A', 'Opção B', 'Opção C', 'Opção D', 'Opção E'];
const unitIds = ['unit1', 'unit2', 'unit3', 'unit4'];
const quizTypes = ['exercises', 'simulado1', 'simulado2', 'avaliacao', 'substituta'];

unitIds.forEach((uId) => {
  if (!QUESTIONS_BY_UNIT[uId]) {
    QUESTIONS_BY_UNIT[uId] = {};
  }
  quizTypes.forEach((type) => {
    if (!QUESTIONS_BY_UNIT[uId][type] || QUESTIONS_BY_UNIT[uId][type].length === 0) {
      QUESTIONS_BY_UNIT[uId][type] = [
        {
          id: `${uId}_${type}_q1`,
          text: `Questão Prática do Módulo ${uId.toUpperCase()} - Tipo ${type.toUpperCase()}: Qual a resposta correta para a proporção algébrica?`,
          options: MOCK_OPTIONS,
          correctIndex: 1,
          explanation: 'Resposta simplificada de simulação do Gabarito.'
        },
        {
          id: `${uId}_${type}_q2`,
          text: `Questão Avançada de Estudos do Módulo ${uId.toUpperCase()} - Tipo ${type.toUpperCase()}: Determine a constante do problema matemático.`,
          options: MOCK_OPTIONS,
          correctIndex: 0,
          explanation: 'Processo demonstrativo de resolução de exercícios.'
        }
      ];
    }
  });
});
