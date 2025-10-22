import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const FormContainer = styled(motion.div)`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: 2rem;
    width: 90%;
  }

  @media (max-width: 480px) {
    margin: 1rem auto;
    padding: 1.5rem;
    width: calc(100% - 2rem);
    border-radius: 12px;
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2.2rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
  background: linear-gradient(
    300deg,
    #00dbde,
    #fc00ff,
    #00ff72,
    #ff0000,
    #00c3ff
  );
  background-size: 300% 300%;
  animation: ${gradientAnimation} 10s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  backdrop-filter: blur(4px);

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.95rem;
  }

  @media (max-width: 360px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.9rem;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, 
    rgba(66, 153, 225, 0.8) 0%, 
    rgba(102, 126, 234, 0.8) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    padding: 0.9rem;
    font-size: 1rem;
    margin-top: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.95rem;
    margin-top: 1rem;
    border-radius: 6px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(66, 153, 225, 0.4);
    background: linear-gradient(135deg, 
      rgba(66, 153, 225, 0.9) 0%, 
      rgba(102, 126, 234, 0.9) 100%
    );
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ErrorMessage = styled(motion.div)<{ $hasError?: boolean }>`
  color: #ff8a8a;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;