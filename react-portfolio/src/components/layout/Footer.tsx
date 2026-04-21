import React, { useState } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmailButton = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Credit = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const Toast = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #10B981;
  color: white;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 500;
  opacity: ${({ $show }) => $show ? '1' : '0'};
  transform: translateY(${({ $show }) => $show ? '0' : '12px'});
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 1000;
`;

export const Footer: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText('idrissiimanai@gmail.com').then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }).catch(() => {
      window.location.href = 'mailto:idrissiimanai@gmail.com';
    });
  };

  return (
    <FooterContainer id="footer">
      <FooterContent>
        <Links>
          <EmailButton onClick={handleEmailClick}>
            idrissiimanai@gmail.com
          </EmailButton>
          <FooterLink
            href="https://www.linkedin.com/in/imane-idrissi-tech/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </FooterLink>
        </Links>
        <Credit>
          Analytics by PostHog. Logo by <a href="https://www.freepik.com/icon/text_16791597" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>Pixa_icons</a> from Freepik
        </Credit>
      </FooterContent>
      <Toast $show={showToast}>Email copied!</Toast>
    </FooterContainer>
  );
};
