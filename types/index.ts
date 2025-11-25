export type IntervalType = 
  | 'octava'
  | 'septima-mayor'
  | 'septima-menor'
  | 'sexta-mayor'
  | 'sexta-menor'
  | 'quinta-justa'
  | 'cuarta-justa'
  | 'tercera-mayor'
  | 'tercera-menor'
  | 'segunda-mayor'
  | 'segunda-menor'
  | 'random';

export interface Level {
  id: IntervalType;
  name: string;
  description: string;
  semitones: number | null; // null para random
  unlocked: boolean;
}

export interface GameState {
  currentLevel: IntervalType;
  score: number;
  totalQuestions: number;
  currentQuestion: number;
  firstNote: number;
  secondNote: number;
  correctAnswer: 'higher' | 'lower';
}

export interface Progress {
  [key: string]: {
    bestScore: number;
    unlocked: boolean;
  };
}
