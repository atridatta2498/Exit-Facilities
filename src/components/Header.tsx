import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NavigationProps {
  isOpen: boolean;
}

interface MenuButtonProps {
  isOpen: boolean;
}

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

    @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const LogoText = styled.h1`
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Navigation = styled.nav<NavigationProps>`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: ${({ isOpen }) => isOpen ? '72px' : '-100%'};
    left: 0;
    width: 100%;
    background: rgba(19, 47, 76, 0.95);
    backdrop-filter: blur(8px);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    transition: top 0.3s ease-in-out;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const NavLink = styled(motion.a)`
  color: #ffffff;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    text-align: center;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const MenuButton = styled(motion.button)<MenuButtonProps>`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    
    &:nth-child(1) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    }
    
    &:nth-child(3) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0)'};
    }
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LogoImage 
            src="/logo192.png" 
            alt="Sri Vasavi Engineering College Logo"
          />
          <LogoText>
            Sri Vasavi Engineering College
          </LogoText>
        </LogoContainer>
        
        <MenuButton 
          onClick={toggleMenu} 
          isOpen={isMenuOpen}
          whileTap={{ scale: 0.95 }}
        >
          <span />
          <span />
          <span />
        </MenuButton>

        <Navigation isOpen={isMenuOpen}>
          <NavLink
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          
          
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;