import React, { useState, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 200);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'modal-closing' : ''}`} 
      onClick={handleClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={handleClose}>
              ✕
            </button>
          </div>
        )}
        {!title && (
          <button className="modal-close modal-close-no-header" onClick={handleClose}>
            ✕
          </button>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
