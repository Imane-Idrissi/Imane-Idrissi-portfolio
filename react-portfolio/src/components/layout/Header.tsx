import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
  font-size: 0.95rem;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $isActive, theme }) => $isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${theme.colors.primary};
      border-radius: 1px;
    }
  `}
`;

const ContactLink = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    transform: scale(1.05);
  }
`;

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <img src="/logo-portfolio.webp" alt="Portfolio Logo" />
          <span>Imane</span>
        </Logo>
        
        <NavLinks>
          <NavLink 
            to="/projects" 
            $isActive={location.pathname === '/projects'}
          >
            Projects
          </NavLink>
          
          <ContactLink onClick={scrollToFooter}>
            Contact
          </ContactLink>
          
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </ThemeToggle>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};