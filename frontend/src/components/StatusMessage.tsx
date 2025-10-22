import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

// SVG Icons as React components
const SuccessIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#52C41A" strokeWidth="4"/>
    <path d="M20 32L28 40L44 24" stroke="#52C41A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#FF4D4F" strokeWidth="4"/>
    <path d="M20 20L44 44M44 20L20 44" stroke="#FF4D4F" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const StatusOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const StatusContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 300px;
  width: 90%;
  margin: 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
    width: calc(100% - 2rem);
    gap: 0.75rem;
  }
`;

const StatusText = styled.p<{ error?: boolean }>`
  color: ${props => props.error ? '#FF4D4F' : '#52C41A'};
  text-align: center;
  margin: 1rem 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const StatusButton = styled(motion.button)<{ error?: boolean }>`
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.error ? '#FF4D4F' : '#52C41A'};
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
`;

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <StatusOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StatusContainer
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
            <StatusText error={type === 'error'}>
              {message}
            </StatusText>
            <StatusButton
              error={type === 'error'}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type === 'error' ? 'Try Again' : 'OK'}
            </StatusButton>
          </StatusContainer>
        </StatusOverlay>
      )}
    </AnimatePresence>
  );
};

export default StatusMessage;