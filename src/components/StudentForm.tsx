import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FeedbackQuestions from './FeedbackQuestions';
import StatusMessage from './StatusMessage';
import {
  FormContainer,
  Title,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  ErrorMessage,
  FormWrapper
} from './StudentForm.styles';

interface StudentData {
  rollNumber: string;
  studentName: string;
  branch: string; // kept for database but hidden in UI
  academicYear: string;
  phoneNumber: string;
  email: string;
  questions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
    q11: string;
    q12: string;
    q13: string;
    q14: string;
    suggestions: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

const StudentForm: React.FC = () => {
  useEffect(() => {
    document.title = 'Feedback Form | Sri Vasavi Engineering College';
  }, []);

  const [formData, setFormData] = useState<StudentData>({
    rollNumber: '',
    studentName: '',
    branch: '', // will be set automatically based on roll number
    academicYear: '',
    phoneNumber: '',
    email: '',
    questions: {
      q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', 
      q8: '', q9: '', q10: '', q11: '', q12: '', q13: '', q14: '',
      suggestions: ''
    }
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Roll Number validation and branch determination
    if (!/^\d{2}[Aa]8\d[A-Za-z]\d{4}$/i.test(formData.rollNumber)) {
      newErrors.rollNumber = 'Invalid roll number format (2 digits + A8 + 1 digit + 1 letter + 4 digits)';
    } else {
      // Extract branch code (2 digits after 24A81A)
      const branchCode = formData.rollNumber.substring(6, 8);
      let detectedBranch = '';
      switch (branchCode) {
        case '05':
          detectedBranch = 'CSE';
          break;
        case '06':
          detectedBranch = 'CST';
          break;
        case '43':
          detectedBranch = 'CAI';
          break;
        case '61':
          detectedBranch = 'AIML';
          break;
        case '02':
          detectedBranch = 'EEE';
          break;
        case '03':
          detectedBranch = 'ME';
          break;
        case '01':
          detectedBranch = 'CE';
          break;
        default:
          newErrors.rollNumber = 'Invalid branch code in roll number';
      }
      // Automatically set the branch
      if (detectedBranch) {
        setFormData(prevState => ({
          ...prevState,
          branch: detectedBranch
        }));
      }
    }

    // Name validation
    if (formData.studentName.length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters long';
    }

    // Phone validation
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Email validation for SVES domain with specific pattern
    if (!/^\d{2}[A-Za-z]\d{2}[A-Za-z]\d{4}@sves\.org\.in$/.test(formData.email)) {
      newErrors.email = 'Please enter your college email in correct format (e.g., 24A81A0501@sves.org.in)';
    }

    // Academic Year validation
    if (!formData.academicYear) {
      newErrors.academicYear = 'Please select an academic year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Check if this roll already submitted
      (async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/feedback/${encodeURIComponent(formData.rollNumber)}`);
          if (res.ok) {
            setNotification({
              type: 'error',
              message: 'This roll number has already submitted feedback. Thank you.',
              isVisible: true
            });
            return;
          }
        } catch (err) {
          // If server not reachable or 404, allow proceeding
          // console.warn('Check existing failed', err);
        }
        setShowFeedback(true);
      })();
    }
  };

  const handleFeedbackChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Build payload: convert q1-q21 to numbers except q15 (suggestions)
      const payload: any = {
        roll: formData.rollNumber,
        name: formData.studentName,
        branch: formData.branch,
        accyear: formData.academicYear,
        contact: formData.phoneNumber,
        email: formData.email,
      };

      // map questions
      for (let i = 1; i <= 21; i++) {
        const key = `q${i}` as keyof typeof formData.questions;
        const val = (formData.questions as any)[key];
        if (i === 15) {
          payload[key] = val || '';
        } else {
          const n = Number(val);
          if (Number.isNaN(n)) {
            throw new Error(`Question ${i} not answered or invalid`);
          }
          payload[key] = n;
        }
      }

      console.log('Submitting payload', payload);

      let retries = 3;
      let res;

      while (retries > 0) {
        try {
          res = await fetch('http://localhost:4000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          break; // If successful, break the retry loop
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }

      if (!res) throw new Error('Failed to connect to server');
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      setNotification({
        type: 'success',
        message: 'You have successfully submitted your feedback!',
        isVisible: true
      });
      // Delay reload to show the success message
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      console.error('Submission error', err);
      setNotification({
        type: 'error',
        message: err.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please make sure you have internet connection.'
          : 'Failed to submit feedback. Please try again.',
        isVisible: true
      });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <FormContainer
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
        <Title>Feedback on Exit Facilities</Title>
      {!showFeedback ? (
        <FormWrapper onSubmit={handleSubmit}>
        <FormGroup variants={itemVariants}>
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="e.g., 23A81A0123"
          />
          <AnimatePresence>
            {errors.rollNumber && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.rollNumber}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </FormGroup>

        <FormGroup variants={itemVariants}>
          <Label htmlFor="studentName">Student Name</Label>
          <Input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          <AnimatePresence>
            {errors.studentName && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.studentName}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </FormGroup>

        <FormGroup variants={itemVariants}>
          <Label htmlFor="academicYear">Academic Year</Label>
          <select
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              marginBottom: '8px'
            }}
            required
          >
            <option value="">Select Academic Year</option>
            <option value="2024-25">2024-25</option>
            <option value="2025-26">2025-26</option>
            <option value="2026-27">2026-27</option>
            <option value="2027-28">2027-28</option>
          </select>
          {errors.academicYear && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {errors.academicYear}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup variants={itemVariants}>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="10-digit mobile number"
          />
          <AnimatePresence>
            {errors.phoneNumber && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.phoneNumber}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </FormGroup>

        <FormGroup variants={itemVariants}>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="21a81a0501@sves.org.in"
          />
          <AnimatePresence>
            {errors.email && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.email}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </FormGroup>

        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit
        </SubmitButton>
      </FormWrapper>
      ) : (
        <FeedbackQuestions
          currentStep={currentStep}
          formData={formData.questions}
          onChange={handleFeedbackChange}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      <StatusMessage
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => {
          setNotification(prev => ({ ...prev, isVisible: false }));
          if (notification.type === 'success') {
            window.location.reload();
          }
        }}
      />
    </FormContainer>
  );
};

export default StudentForm;