import React from 'react';
import { ProgressBar, ProgressFill, StepIndicator } from './ProgressBar.styles';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <StepIndicator>
        Step {currentStep} of {totalSteps}
      </StepIndicator>
      <ProgressBar>
        <ProgressFill
          progress={progress}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </ProgressBar>
    </>
  );
};