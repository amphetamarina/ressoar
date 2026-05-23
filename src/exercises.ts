export type Step = {
  id: string;
  label: string;
  durationSeconds: number | null;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  steps: Step[];
};

export type Session = {
  id: string;
  name: string;
  exercises: Exercise[];
};

const phraseBlocks = [
  [
    "Bom dia!",
    "Tudo bem?",
    "Amanhã estarei de folga",
    "No final de semana vou sair",
    "Estou me sentindo melhor",
    "Preciso falar com você",
    "Falo com você amanhã",
  ],
  [
    "Boa tarde!",
    "Tudo bem?",
    "As coisas estão em cima da mesa",
    "O lugar fica longe",
    "Me sinto bem nesse lugar",
    "Tive uma ideia!",
    "Vamos lá?",
  ],
  [
    "Boa noite!",
    "Tudo bem?",
    "Em que posso ajudar?",
    "Agora entendi!",
    "Sempre entendi dessa forma",
    "Voltarei amanhã",
    "Agora preciso ir",
    "Até mais",
  ],
];

export const sessions: Session[] = [
  {
    id: "sessao-2",
    name: "2ª Sessão",
    exercises: [
      {
        id: "sopro-sonorizado",
        title: "Sopro sonorizado",
        description:
          'Sem inflar as bochechas e com os lábios em bico, realizar o som de "vvuuu" soltando mais ar do que som.',
        steps: [
          {
            id: "glissando",
            label:
              "Glissando: do grave para o agudo em escalas e descer em escalas para o grave.",
            durationSeconds: 90,
          },
          {
            id: "reto",
            label:
              'Reto: som de "vvuuu" em pitch agudo confortável, de forma contínua.',
            durationSeconds: 90,
          },
        ],
      },
      {
        id: "vogal-i",
        title: "Vogal I",
        description: "Trabalho de vogal I em escalas e em pitch hiper agudo.",
        steps: [
          {
            id: "escalas",
            label:
              "Vogal I em escalas de dó, ré, mi, fá, sol, fá, mi, ré, dó.",
            durationSeconds: 90,
          },
          {
            id: "hiper-aguda",
            label:
              "Vogal I hiper aguda: leve sorriso, intensidade leve e ponta da língua atrás dos dentes inferiores.",
            durationSeconds: 90,
          },
        ],
      },
      {
        id: "pares-de-vogais",
        title: "Pares de vogais",
        description:
          "Pares de vogais em tom agudo, intensidade leve e verticalizando a mandíbula.",
        steps: [
          { id: "ao", label: "AÓ, AÓ, AÓ", durationSeconds: 60 },
          { id: "iu", label: "IU, IU, IU", durationSeconds: 60 },
          { id: "oe", label: "ÓÉ, ÓÉ, ÓÉ", durationSeconds: 60 },
        ],
      },
      {
        id: "frases",
        title: "Frases",
        description:
          "Falar de forma suave, explorando as modulações ascendentes e descendentes, prolongando as vogais e articulando os lábios. Ler cada bloco 2 vezes. Faça um sopro sonorizado agudo antes da primeira frase.",
        steps: phraseBlocks.map((block, index) => ({
          id: `bloco-${index + 1}`,
          label: block.join("\n"),
          durationSeconds: null,
        })),
      },
    ],
  },
];

export function findSession(id: string): Session | undefined {
  return sessions.find((session) => session.id === id);
}
