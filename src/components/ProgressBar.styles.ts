import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 4px;
    margin-bottom: 1.5rem;
  }
`;

export const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  width: ${(props: { progress: number }) => props.progress}%;
  background: linear-gradient(90deg, #00ff72, #00ccff);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

export const StepIndicator = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.5px;
  }
`;