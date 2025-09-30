import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  words: string[];
}

export const Card = ({ words }: CardProps) => {
  // Use the first word as a unique key for the card
  const cardKey = words[0] || 'empty';

  return (
    <div className="card-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={cardKey}
          className="card"
          initial={{
            rotateY: 90,
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            rotateY: 0,
            scale: 1,
            opacity: 1,
          }}
          exit={{
            rotateY: -90,
            scale: 0.8,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="word-list">
            {words.map((word, index) => (
              <motion.div
                key={index}
                className="word-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + (index * 0.05),
                  duration: 0.3,
                }}
              >
                <span className="word-number">{index + 1}.</span>
                <span className="word-text">{word}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
