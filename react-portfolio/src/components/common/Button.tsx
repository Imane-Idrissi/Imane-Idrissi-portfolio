import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
}

const StyledButton = styled.button<{ 
  $variant: 'primary' | 'secondary' | 'outline';
  $size: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid transparent;
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 1rem;
        `;
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.primaryHover};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${theme.colors.shadow};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border-color: ${theme.colors.border};
          &:hover {
            background-color: ${theme.colors.border};
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: white;
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className
}) => {
  if (href) {
    return (
      <StyledButton
        as="a"
        href={href}
        $variant={variant}
        $size={size}
        className={className}
      >
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledButton>
  );
};