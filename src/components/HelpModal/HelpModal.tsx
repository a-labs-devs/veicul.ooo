import React from 'react';
import Modal from '../Modal/Modal';
import './HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Como Jogar">
      <div className="help-content">
        <p>Descubra a palavra relacionada a carros em 6 tentativas.</p>
        <p>Após cada tentativa, as cores das peças mostram o quão perto você está da solução.</p>

        <div className="example">
          <h3>Exemplos:</h3>
          
          <div className="example-row">
            <div className="example-tiles">
              <div className="tile tile-correct">F</div>
              <div className="tile tile-empty">U</div>
              <div className="tile tile-empty">S</div>
              <div className="tile tile-empty">C</div>
              <div className="tile tile-empty">A</div>
            </div>
            <p>A letra <strong>F</strong> faz parte da palavra e está na posição correta.</p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              <div className="tile tile-empty">M</div>
              <div className="tile tile-present">O</div>
              <div className="tile tile-empty">T</div>
              <div className="tile tile-empty">O</div>
              <div className="tile tile-empty">R</div>
            </div>
            <p>A letra <strong>O</strong> faz parte da palavra mas em outra posição.</p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              <div className="tile tile-empty">R</div>
              <div className="tile tile-empty">O</div>
              <div className="tile tile-empty">D</div>
              <div className="tile tile-absent">A</div>
              <div className="tile tile-empty">S</div>
            </div>
            <p>A letra <strong>A</strong> não faz parte da palavra.</p>
          </div>
        </div>

        <div className="rules">
          <h3>Regras:</h3>
          <ul>
            <li>As palavras são relacionadas a carros: marcas, modelos, peças e termos automotivos.</li>
            <li>Todas as palavras têm 5 letras.</li>
            <li>Os acentos são preenchidos automaticamente e não são considerados nas dicas.</li>
            <li>As palavras podem possuir letras repetidas.</li>
            <li>Uma palavra nova aparece a cada dia!</li>
          </ul>
        </div>

        <div className="modes">
          <h3>Modos de Jogo:</h3>
          <ul>
            <li><strong>Termo:</strong> Descubra 1 palavra</li>
            <li><strong>Dueto:</strong> Descubra 2 palavras ao mesmo tempo</li>
            <li><strong>Quarteto:</strong> Descubra 4 palavras ao mesmo tempo</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal;
