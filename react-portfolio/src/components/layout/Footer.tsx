import React, { useState } from 'react';
import styled from 'styled-components';

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#181717">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const ContactInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const ContactLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.border};
    transform: translateY(-2px);
  }

  .icon {
    font-size: 1.2rem;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Toast = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #10B981;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  transform: translateX(${({ $show }) => $show ? '0' : '400px'});
  opacity: ${({ $show }) => $show ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 1000;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: 20px;
    right: 20px;
    left: 20px;
    transform: translateY(${({ $show }) => $show ? '0' : '100px'});
  }
`;

export const Footer: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Copy to clipboard
    navigator.clipboard.writeText("idrissiimanai@gmail.com").then(() => {
      // Show custom toast notification
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }).catch(() => {
      // If clipboard fails, try mailto
      window.location.href = "mailto:idrissiimanai@gmail.com";
    });
  };

  return (
    <FooterContainer id="footer">
      <FooterContent>
        <ContactInfo>
          <ContactTitle>Let's Connect</ContactTitle>
          
          <ContactLinks>
            <ContactLink 
              href="mailto:idrissiimanai@gmail.com"
              onClick={handleEmailClick}
            >
              <span className="icon">📧</span>
              idrissiimanai@gmail.com
            </ContactLink>
            
            <ContactLink 
              href="https://www.linkedin.com/in/imane-idrissi-tech/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              LinkedIn
            </ContactLink>
            
            <ContactLink 
              href="https://github.com/imane-idrissi" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              GitHub
            </ContactLink>
          </ContactLinks>
        </ContactInfo>
        
        <Copyright>
          © 2024 Imane Idrissi. Made with love 💜
        </Copyright>
      </FooterContent>
      
      <Toast $show={showToast}>
        <span>✅</span>
        Email copied to clipboard!
      </Toast>
    </FooterContainer>
  );
};