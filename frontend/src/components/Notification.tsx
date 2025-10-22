import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationContainer = styled(motion.div)<{ type: 'success' | 'error' }>`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 12px;
  background: ${props => props.type === 'success' 
    ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    : 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)'};
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Notification: React.FC<NotificationProps> = ({ type, message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationContainer
          type={type}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          {message}
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
};

export default Notification;