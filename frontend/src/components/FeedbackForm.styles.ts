import styled from 'styled-components';
import { motion } from 'framer-motion';

export const QuestionsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  color: white;

  @media (max-width: 768px) {
    padding: 15px;
    text-align: center;

    h1 {
      font-size: 24px;
      margin-bottom: 25px;
      font-family: 'Play', sans-serif;
    }
  }
`;

export const SubjectSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 15px;
    margin: 0 auto 20px;
    max-width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
  }
`;

export const SubjectTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  grid-column: 1 / -1;
  width: 100%;
`;

export const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  height: fit-content;

  p {
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 1.4;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    margin: 0 auto 15px;
    max-width: 90%;
    text-align: center;
    min-width: 280px;

    p {
      font-size: 16px;
      margin-bottom: 15px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      word-break: break-word;

      strong {
        display: inline-block;
      }
    }
  }
`;

export const Question = styled.p`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.4;

  @media (max-width: 768px) {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    word-break: break-word;
  }
`;

export const OptionButton = styled.button<{ variant: 'poor' | 'average' | 'above' | 'good' | 'excellent'; selected: boolean }>`
  padding: 8px 15px;
  margin: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  transition: all 0.3s ease;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 10px 15px;
  }

  background: ${props => {
    switch (props.variant) {
      case 'poor':
        return props.selected ? '#dc3545' : 'rgba(220, 53, 69, 0.5)';
      case 'average':
        return props.selected ? '#ffc107' : 'rgba(255, 193, 7, 0.5)';
      case 'above':
        return props.selected ? '#17a2b8' : 'rgba(23, 162, 184, 0.5)';
      case 'good':
        return props.selected ? '#28a745' : 'rgba(40, 167, 69, 0.5)';
      case 'excellent':
        return props.selected ? '#6f42c1' : 'rgba(111, 66, 193, 0.5)';
    }
  }};

  transform: ${props => props.selected ? 'scale(1.05)' : 'none'};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #ffffff;
  font-family: inherit;
  font-size: 16px;
  resize: vertical;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    min-height: 120px;
    font-size: 16px;
  }
`;

export const SubmitButton = styled.button`
  width: 200px;
  padding: 12px;
  margin: 20px auto;
  display: block;
  border: none;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(54, 113, 250) 0%, rgb(250, 9, 9) 100%);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;