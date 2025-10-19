import React from 'react';
import './Keyboard.css';
import { Guess, LetterState } from '../../types/game';
import { getKeyboardLetterState } from '../../utils/game';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: Guess[];
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses }) => {
  const getKeyState = (key: string): LetterState => {
    if (key === 'ENTER' || key === '⌫') return 'empty';
    return getKeyboardLetterState(key, guesses);
  };

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`key key-${getKeyState(key)} ${
                key === 'ENTER' || key === '⌫' ? 'key-wide' : ''
              }`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
