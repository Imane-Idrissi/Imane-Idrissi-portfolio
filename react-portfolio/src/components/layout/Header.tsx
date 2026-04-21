import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { getAssetPath } from '../../utils/assetPath';

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
  height: 60px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeToggle = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <img src={getAssetPath('/assets/logo.webp')} alt="Logo" loading="eager" />
          Imane
        </Logo>

        <NavLinks>
          <NavLink
            to="/projects"
            $isActive={location.pathname.startsWith('/projects')}
          >
            Projects
          </NavLink>

          <NavLink
            to="/blog"
            $isActive={location.pathname.startsWith('/blog')}
          >
            Blog
          </NavLink>

          <ThemeToggle onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </ThemeToggle>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};
