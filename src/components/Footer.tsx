import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const FooterLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const Copyright = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 1.0);
  font-size: 0.85rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Copyright>
        © {new Date().getFullYear()} Exit Facilities Portal Developed by AtriDatta. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;