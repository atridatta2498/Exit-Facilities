import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginTitle,
  LoginForm,
  InputGroup,
  Label,
  Input,
  LoginButton,
  ErrorMessage,
} from './AdminLogin.styles';

interface AdminCredentials {
  username: string;
  password: string;
}

const ADMIN_CREDENTIALS: { [key: string]: AdminCredentials } = {
  cse: { username: 'cse', password: 'cse@svec' },
  aiml: { username: 'aiml', password: 'aiml@svec' },
  eee: { username: 'eee', password: 'eee@svec' },
  me: { username: 'me', password: 'me@svec' },
  ce: { username: 'ce', password: 'ce@svec' },
  bsh: { username: 'bsh', password: 'bsh@svec' },
  mba: { username: 'mba', password: 'mba@svec' }
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin Login | Sri Vasavi Engineering College';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;

    // Check credentials
    const adminType = Object.keys(ADMIN_CREDENTIALS).find(key => 
      ADMIN_CREDENTIALS[key].username === username && 
      ADMIN_CREDENTIALS[key].password === password
    );

    if (adminType) {
      localStorage.setItem('adminType', adminType);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <LoginContainer>
      <LoginTitle>Admin Login</LoginTitle>
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </InputGroup>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}
        <LoginButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Login
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin;