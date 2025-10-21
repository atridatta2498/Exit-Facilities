import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QuestionsContainer,
  SubjectSection,
  SubjectTitle,
  QuestionCard,
  Question,
  OptionsContainer,
  OptionButton,
  TextArea,
  NavigationContainer,
  SubmitButton
} from './FeedbackForm.styles';
import { ProgressIndicator } from './ProgressIndicator';

interface FeedbackQuestionsProps {
  currentStep: number;
  formData: any;
  onChange: (name: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const questions = [
  "Digital Library Facility",
  "The timings of the Library",
  "Services of the Library staff",
  "Coverage of buses to various routes",
  "The condition of the buses",
  "Maintenance of Canteen",
  "Quality of the food",
  "Maintenance of Labs",
  "Cooperation of Lab In-charges",
  "Internet facility",
  "Maintenance of Hostels",
  "Tidiness of Hostels",
  "Maintenance of Toilets",
  "Sports & Games facilities in the college",
  "Utility of indoor stadium",
  "College ambience",
  "Drinking water facility",
  "Power back up facility",
  "Department library",
  "Departmental store in the campus",
  "Banking facility in the college"
];

const QUESTIONS_PER_PAGE = 5;

export const FeedbackQuestions: React.FC<FeedbackQuestionsProps> = ({
  currentStep,
  formData,
  onChange,
  onNext,
  onPrev,
  onSubmit
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  
  const currentPageQuestions = questions.slice(
    (currentStep - 1) * QUESTIONS_PER_PAGE,
    currentStep * QUESTIONS_PER_PAGE
  );
  
  const hasAnsweredCurrentPage = currentPageQuestions.every((_, idx) => {
    const answer = formData[`q${(currentStep - 1) * QUESTIONS_PER_PAGE + idx + 1}`];
    return answer && answer.match(/^[1-5]$/);
  });
  
  const isLastPage = currentStep === totalPages;

  const handleSubmit = () => {
    onSubmit();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <QuestionsContainer>
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalPages} 
      />

      <SubjectSection>
        <SubjectTitle>Page {currentStep} of {totalPages}</SubjectTitle>
        
        {currentPageQuestions.map((question, idx) => {
          const questionNumber = (currentStep - 1) * QUESTIONS_PER_PAGE + idx + 1;
          return (
            <QuestionCard
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Question>{`${questionNumber}. ${question}`}</Question>
              <OptionsContainer>
                {[
                  { label: 'Poor', value: '1' },
                  { label: 'Average', value: '2' },
                  { label: 'Above', value: '3' },
                  { label: 'Good', value: '4' },
                  { label: 'Excellent', value: '5' }
                ].map(({ label, value }) => {
                  const isSelected = formData[`q${questionNumber}`] === value;
                  const variant = label.toLowerCase() as 'poor' | 'average' | 'above' | 'good' | 'excellent';
                  
                  return (
                    <OptionButton
                      key={value}
                      variant={variant}
                      selected={isSelected}
                      onClick={() => onChange(`q${questionNumber}`, value)}
                      type="button"
                    >
                      {label}
                    </OptionButton>
                  );
                })}
              </OptionsContainer>
            </QuestionCard>
          );
        })}
      </SubjectSection>
      <NavigationContainer>
        


        {currentStep > 1 && (
          <SubmitButton
            type="button"
            onClick={onPrev}
          >
            Previous
          </SubmitButton>
        )}
        <SubmitButton
          type="button"
          onClick={isLastPage ? handleSubmit : onNext}
          disabled={!hasAnsweredCurrentPage && !isLastPage}
        >
          {isLastPage ? 'Submit Feedback' : 'Next Page'}
        </SubmitButton>
      </NavigationContainer>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              zIndex: 9999
            }}
          >
            Feedback submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </QuestionsContainer>
  );
};

export default FeedbackQuestions;