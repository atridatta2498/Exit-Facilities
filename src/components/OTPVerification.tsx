import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons
const ErrorIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#FF4D4F" strokeWidth="4" />
    <path d="M20 20L44 44M44 20L20 44" stroke="#FF4D4F" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const SuccessIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#52C41A" strokeWidth="4" />
    <path d="M20 32L28 40L44 24" stroke="#52C41A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface OTPVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

// ✅ Updated to ensure centering on all devices
const VerificationContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 480px) {
    width: 90%;
    max-width: 360px;
    padding: 1.25rem;
    border-radius: 16px;
    max-height: 90vh;
    overflow-y: auto;
    justify-content: center;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
`;

const OTPInputContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const DigitInput = styled.input`
  width: 50px;
  height: 50px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.5rem;
  text-align: center;
  background: #f8f8f8;
  color: #333;
  transition: all 0.2s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
`;

const VerifyButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #007bff;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:disabled {
    background: #b3d7ff;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

const TimerText = styled.p`
  color: #666;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin: 0 auto;

  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`;

const StatusOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

// ✅ Updated centering for success/error popup
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 480px) {
    width: 85%;
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const StatusMessage = styled.p<{ error?: boolean }>`
  color: ${(props) => (props.error ? '#FF4D4F' : '#52C41A')};
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StatusButton = styled(motion.button)<{ error?: boolean }>`
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.error ? '#FF4D4F' : '#52C41A')};
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${(props) => (props.error ? '#dc3545' : '#28a745')};
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerificationComplete, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [showStatus, setShowStatus] = useState<{ show: boolean; error: boolean; message: string }>({
    show: false,
    error: false,
    message: '',
  });
  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    const initialOTPSend = async () => {
      setIsLoading(true);
      setTimeLeft(300);
      setCanResend(false);
      try {
        const response = await fetch('http://localhost:4000/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error('Failed to send OTP');
        setMessage('OTP has been sent to your email');
        setIsError(false);
      } catch {
        setMessage('Failed to send OTP. Please try again.');
        setIsError(true);
        setCanResend(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialOTPSend();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    setTimeLeft(300);
    setCanResend(false);
    try {
      const response = await fetch('http://localhost:4000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Failed');
      setMessage('OTP has been sent to your email');
      setIsError(false);
    } catch {
      setMessage('Failed to send OTP. Please try again.');
      setIsError(true);
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.some((d) => !d)) {
      setMessage('Please enter complete OTP');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      });

      if (!response.ok) throw new Error('Invalid OTP');

      setShowStatus({ show: true, error: false, message: 'Oh Yeah! You have successfully verified your email.' });
      setTimeout(onVerificationComplete, 2000);
    } catch {
      setShowStatus({ show: true, error: true, message: 'Invalid OTP! Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showStatus.show && (
        <StatusOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <StatusContainer initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {showStatus.error ? <ErrorIcon /> : <SuccessIcon />}
            <StatusMessage error={showStatus.error}>{showStatus.message}</StatusMessage>
            <StatusButton
              error={showStatus.error}
              onClick={() => {
                setShowStatus({ show: false, error: false, message: '' });
                if (showStatus.error) {
                  setOtp(['', '', '', '', '', '']);
                  inputRefs[0].current?.focus();
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showStatus.error ? 'Try Again' : 'OK'}
            </StatusButton>
          </StatusContainer>
        </StatusOverlay>
      )}

      <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <VerificationContainer initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
        <Title>Please enter the One-Time Password</Title>
        <Subtitle>A One-Time Password has been sent to {email}</Subtitle>

        <OTPInputContainer>
          {otp.map((digit, index) => (
            <DigitInput
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
            />
          ))}
        </OTPInputContainer>

        <VerifyButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleVerifyOTP} disabled={isLoading || otp.some((d) => !d)}>
          {isLoading ? 'Verifying...' : 'Validate'}
        </VerifyButton>

        <TimerText>{timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : 'OTP has expired'}</TimerText>

        <ResendButton onClick={handleSendOTP} disabled={!canResend || isLoading}>
          Resend One-Time Password
        </ResendButton>

        {message && <Message error={isError}>{message}</Message>}
      </VerificationContainer>
    </AnimatePresence>
  );
};

export default OTPVerification;
