import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Header = styled.header`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

export const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
    overflow-x: hidden;
  }
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CollegeLogo = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const HeaderTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const DownloadButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #00ff72 0%, #00ccff 100%);
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 255, 114, 0.2);

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 114, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const DownloadSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoutButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const ResponsesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const ResponseCard = styled(motion.div)`
  background: rgba(19, 47, 76, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ResponseTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ResponseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ResponseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const QuestionText = styled.p`
  flex: 1;
  margin-right: 1rem;
  font-size: 0.9rem;
`;

export const AnswerText = styled.span<{ type: 'Average' | 'Moderate' | 'Good' }>`
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'Average':
        return 'rgba(255, 99, 71, 0.5)';
      case 'Moderate':
        return 'rgba(255, 215, 0, 0.5)';
      case 'Good':
        return 'rgba(46, 204, 113, 0.5)';
      default:
        return 'transparent';
    }
  }};
`;

export const TableContainer = styled.div`
  margin-top: 1.5rem;
  background: linear-gradient(180deg, rgba(29, 53, 87, 0.8) 0%, rgba(10, 24, 35, 0.9) 100%);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  border: 2px solid rgba(247, 243, 243, 0.35);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15),
              inset 0 0 20px rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

export const StatsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border:2px;
  border-color:white;
  color: #e9f0f7;
  font-size: 0.95rem;
  min-width: 1000px; // Ensures table doesn't get too cramped on mobile
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    border: 1px solid rgba(255,255,255,0.08);
  }

  tr:last-child {
    td {
      border-bottom: none;
    }
  }

  tr:hover td {
    background-color: rgba(255, 255, 255, 0.05);
  }

  // Enhanced border styling
  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 8px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 8px;
  }
`;

export const TH = styled.th`
  text-align: center;
  padding: 16px 12px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(41, 128, 185, 0.9), rgba(41, 128, 185, 0.7));
  border: 1px solid rgba(255,255,255,0.2);
  border-bottom: 2px solid rgba(255,255,255,0.2);
  position: sticky;
  top: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-left: 1px solid rgba(255,255,255,0.2);
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    border-right: 1px solid rgba(255,255,255,0.2);
  }

  &:not(:last-child) {
    border-right: 1px solid rgba(255,255,255,0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
    border: 1px solid rgba(255,255,255,0.15);
    border-bottom: 2px solid rgba(255,255,255,0.2);
  }
`;

export const TD = styled.td`
  padding: 16px 12px;
  color: #dbeaf7;
  border: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  vertical-align: middle;
  
  &:first-child {
    border-left: 1px solid rgba(255,255,255,0.12);
  }
  
  &:last-child {
    border-right: 1px solid rgba(255,255,255,0.12);
  }

  &:not(:last-child) {
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  
  tr:hover & {
    background: linear-gradient(180deg, rgba(41, 128, 185, 0.15), rgba(41, 128, 185, 0.1));
    color: #ffffff;
    border-color: rgba(255,255,255,0.15);
  }
  
  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
    border: 1px solid rgba(255,255,255,0.06);
  }
`;

export const QNoCell = styled.td`
  padding: 16px 12px;
  color: #e6f4ff;
  font-weight: 500;
  width: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  
  tr:hover & {
    background: linear-gradient(180deg, rgba(41, 128, 185, 0.15), rgba(41, 128, 185, 0.1));
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
`;

export const WeightedCell = styled.td`
  padding: 16px 12px;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  color: #dbeaf7;
  
  tr:hover & {
    background: linear-gradient(180deg, rgba(41, 128, 185, 0.15), rgba(41, 128, 185, 0.1));
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
`;

export const UsersCell = styled.td`
  padding: 16px 12px;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  color: #dbeaf7;
  
  tr:hover & {
    background: linear-gradient(180deg, rgba(41, 128, 185, 0.15), rgba(41, 128, 185, 0.1));
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
`;

export const RowIndex = styled.td`
  padding: 16px 12px;
  width: 40px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  color: rgba(219, 234, 247, 0.7);
  text-align: center;
  
  tr:hover & {
    background: linear-gradient(180deg, rgba(41, 128, 185, 0.15), rgba(41, 128, 185, 0.1));
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
`;