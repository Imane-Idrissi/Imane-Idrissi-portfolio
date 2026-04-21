import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Page = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 70% 50% at 50% 45%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
    ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  max-width: 600px;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  }
`;

const Greeting = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

const Statement = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BlogLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ProjectsButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const Home: React.FC = () => {
  return (
    <Page>
      <Content>
        <Greeting>Hi, I'm Imane.</Greeting>
        <Statement>
          A full-stack developer. I build products starting from real frustrations (including mine).
        </Statement>
        <Actions>
          <BlogLink to="/blog/how-i-think-when-building-products">
            How I think when building products &rarr;
          </BlogLink>
          <ProjectsButton to="/projects">
            See my projects
          </ProjectsButton>
        </Actions>
      </Content>
    </Page>
  );
};
