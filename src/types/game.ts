import { WordItem } from "../data/words";

export type GameState = "menu" | "playing" | "round_end";

export interface GameData {
  currentState: GameState;
  currentCard: string | null;
  succeededCards: string[];
  burnedCards: string[];
  availableWords: WordItem[];
  currentCardWords: string[];
  currentWordIndex: number;
  timeRemaining: number;
  isTimerRunning: boolean;
  isLastCard: boolean;
}
