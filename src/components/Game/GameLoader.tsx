import React, { useState, useEffect } from 'react';
import Game from './Game';
import { getDailyWord } from '../../data/words';
import { preloadPalavras } from '../../services/validator';

const GameLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [targetWord, setTargetWord] = useState<string>('');
  const [wordLength, setWordLength] = useState<number>(5);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      await preloadPalavras();
      
      const word = await getDailyWord();
      setTargetWord(word);
      setWordLength(word.length);
      
      setIsLoading(false);
    };
    
    init();
  }, []);

  if (isLoading || !targetWord) {
    return (
      <div className="game">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  return (
    <Game 
      targetWord={targetWord}
      wordLength={wordLength}
      maxGuesses={6}
    />
  );
};

export default GameLoader;
