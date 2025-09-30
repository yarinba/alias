import { useState, useCallback, useEffect, useRef } from "react";
import { GameData } from "../types/game";
import { WORDS, WordItem } from "../data/words";
import { soundManager } from "../utils/sounds";

const ROUND_TIME = 60;

// Card generation configuration
export const CARD_CONFIG = {
  wordsPerCard: 8,
  difficultyDistribution: {
    easy: 4,
    medium: 3,
    hard: 1,
  },
  maxWordsPerCategory: 3,
} as const;

const shuffleWordItems = (array: WordItem[]): WordItem[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameState = () => {
  const [gameData, setGameData] = useState<GameData>({
    currentState: "menu",
    currentCard: null,
    succeededCards: [],
    burnedCards: [],
    availableWords: [],
    currentCardWords: [],
    currentWordIndex: 0,
    timeRemaining: ROUND_TIME,
    isTimerRunning: false,
    isLastCard: false,
  });

  const timerRef = useRef<number | null>(null);
  const buzzerPlayedRef = useRef<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (gameData.isTimerRunning && gameData.timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setGameData((prev) => {
          const newTime = prev.timeRemaining - 1;
          if (newTime === 0) {
            // Play buzzer sound when timer reaches 0
            if (!buzzerPlayedRef.current) {
              soundManager.play("buzzer");
              buzzerPlayedRef.current = true;
            }
            return {
              ...prev,
              timeRemaining: 0,
              isTimerRunning: false,
              isLastCard: true,
            };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameData.isTimerRunning, gameData.timeRemaining]);

  // Reset buzzer flag when starting a new round
  useEffect(() => {
    if (
      gameData.currentState === "playing" &&
      gameData.timeRemaining === ROUND_TIME
    ) {
      buzzerPlayedRef.current = false;
    }
  }, [gameData.currentState, gameData.timeRemaining]);

  const loadNewCard = useCallback(
    (
      availableWordPool: WordItem[]
    ): { words: string[]; remaining: WordItem[] } => {
      const cardWords: string[] = [];
      const selectedItems: WordItem[] = [];
      let remaining = [...availableWordPool];

      // If pool is empty, reshuffle the entire word set
      if (remaining.length === 0) {
        remaining = shuffleWordItems([...WORDS]);
      }

      const categoryCount: Record<string, number> = {};

      // Select words by difficulty
      for (const difficulty of ["easy", "medium", "hard"] as const) {
        const count = CARD_CONFIG.difficultyDistribution[difficulty];
        let selected = 0;

        while (selected < count && remaining.length > 0) {
          // Filter words by difficulty and category constraint
          const candidates = remaining.filter((item) => {
            const currentCategoryCount = categoryCount[item.category] || 0;
            return (
              item.difficulty === difficulty &&
              currentCategoryCount < CARD_CONFIG.maxWordsPerCategory
            );
          });

          if (candidates.length === 0) {
            // If no candidates match both criteria, relax category constraint
            const relaxedCandidates = remaining.filter(
              (item) => item.difficulty === difficulty
            );

            if (relaxedCandidates.length === 0) {
              // If still no candidates, refill from the entire pool
              remaining = shuffleWordItems([...WORDS]);
              continue;
            }

            // Pick from relaxed candidates
            const randomIndex = Math.floor(
              Math.random() * relaxedCandidates.length
            );
            const selectedItem = relaxedCandidates[randomIndex];

            cardWords.push(selectedItem.word);
            selectedItems.push(selectedItem);
            categoryCount[selectedItem.category] =
              (categoryCount[selectedItem.category] || 0) + 1;

            // Remove from remaining
            remaining = remaining.filter((item) => item !== selectedItem);
            selected++;
          } else {
            // Pick a random candidate
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const selectedItem = candidates[randomIndex];

            cardWords.push(selectedItem.word);
            selectedItems.push(selectedItem);
            categoryCount[selectedItem.category] =
              (categoryCount[selectedItem.category] || 0) + 1;

            // Remove from remaining
            remaining = remaining.filter((item) => item !== selectedItem);
            selected++;
          }
        }
      }

      // If we still don't have enough words, fill with any remaining
      while (
        cardWords.length < CARD_CONFIG.wordsPerCard &&
        remaining.length > 0
      ) {
        if (remaining.length === 0) {
          remaining = shuffleWordItems([...WORDS]);
        }
        const item = remaining.pop()!;
        cardWords.push(item.word);
      }

      return { words: cardWords, remaining };
    },
    []
  );

  const startRound = useCallback(() => {
    const shuffled = shuffleWordItems([...WORDS]);
    const { words, remaining } = loadNewCard(shuffled);

    setGameData({
      currentState: "playing",
      currentCard: words[0],
      succeededCards: [],
      burnedCards: [],
      availableWords: remaining,
      currentCardWords: words,
      currentWordIndex: 0,
      timeRemaining: ROUND_TIME,
      isTimerRunning: true,
      isLastCard: false,
    });
  }, [loadNewCard]);

  const markSuccess = useCallback(() => {
    setGameData((prev) => {
      if (prev.currentCardWords.length === 0) return prev;

      // Add the card identifier (first word) to succeeded
      const cardIdentifier = prev.currentCardWords.join(", ");
      const newSucceeded = [...prev.succeededCards, cardIdentifier];

      if (prev.isLastCard) {
        return {
          ...prev,
          currentState: "round_end",
          currentCard: null,
          succeededCards: newSucceeded,
          isTimerRunning: false,
        };
      }

      // Load a new card
      const { words, remaining } = loadNewCard(prev.availableWords);

      return {
        ...prev,
        currentCard: words[0],
        succeededCards: newSucceeded,
        currentWordIndex: 0,
        currentCardWords: words,
        availableWords: remaining,
      };
    });
  }, [loadNewCard]);

  const markBurn = useCallback(() => {
    setGameData((prev) => {
      if (prev.currentCardWords.length === 0) return prev;

      // Add the card identifier (first word) to burned
      const cardIdentifier = prev.currentCardWords.join(", ");
      const newBurned = [...prev.burnedCards, cardIdentifier];

      if (prev.isLastCard) {
        return {
          ...prev,
          currentState: "round_end",
          currentCard: null,
          burnedCards: newBurned,
          isTimerRunning: false,
        };
      }

      // Load a new card
      const { words, remaining } = loadNewCard(prev.availableWords);

      return {
        ...prev,
        currentCard: words[0],
        burnedCards: newBurned,
        currentWordIndex: 0,
        currentCardWords: words,
        availableWords: remaining,
      };
    });
  }, [loadNewCard]);

  const resetToMenu = useCallback(() => {
    setGameData({
      currentState: "menu",
      currentCard: null,
      succeededCards: [],
      burnedCards: [],
      availableWords: [],
      currentCardWords: [],
      currentWordIndex: 0,
      timeRemaining: ROUND_TIME,
      isTimerRunning: false,
      isLastCard: false,
    });
  }, []);

  return {
    gameData,
    startRound,
    markSuccess,
    markBurn,
    resetToMenu,
  };
};
