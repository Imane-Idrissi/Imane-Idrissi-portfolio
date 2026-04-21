import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getAssetPath } from '../utils/assetPath';

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.sm};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ProjectCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 360px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 180px;
  }
`;

const ProjectBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ProjectTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const ProjectTag = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2px 10px;
  border-radius: 100px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProjectButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const ProjectLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

export const Projects: React.FC = () => {
  return (
    <Page>
      <Title>Projects</Title>
      <ProjectsGrid>
        <ProjectCard>
          <ProjectImage>
            <img
              src={getAssetPath('/assets/projects/unblurry/hero.png')}
              alt="Unblurry - Did your work match your intent?"
              loading="lazy"
            />
          </ProjectImage>
          <ProjectBody>
            <ProjectTag>Desktop App</ProjectTag>
            <ProjectTitle>Unblurry</ProjectTitle>
            <ProjectDescription>
              A privacy-focused desktop app that helps you understand your work behavior.
              It silently captures what you do, collects how you feel, and uses AI to reveal
              the behavioral patterns behind your productivity. Built with Electron, React,
              SQLite, and Google Gemini.
            </ProjectDescription>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ProjectButton to="/projects/unblurry">
                See project
              </ProjectButton>
              <ProjectLink href="https://www.unblurry.app/" target="_blank" rel="noopener noreferrer">
                https://unblurry.app
              </ProjectLink>
            </div>
          </ProjectBody>
        </ProjectCard>

        <ProjectCard>
          <ProjectImage>
            <img
              src={getAssetPath('/assets/projects/collab-app/hero.png')}
              alt="CollabApp - Talk First, Organize Later"
              loading="lazy"
            />
          </ProjectImage>
          <ProjectBody>
            <ProjectTag>Web App</ProjectTag>
            <ProjectTitle>CollabApp</ProjectTitle>
            <ProjectDescription>
              A team collaboration tool where messy discussions become organized tasks.
              Teams discuss freely without worrying about structure. When the conversation
              is done, AI reads it and drafts the tasks. You review, adjust, and add them
              to your board. Built with React, Django, PostgreSQL, and WebSockets.
            </ProjectDescription>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ProjectButton to="/projects/collab-app">
                See project
              </ProjectButton>
              <ProjectLink href="https://collabapp-rho.vercel.app/" target="_blank" rel="noopener noreferrer">
                collabapp-rho.vercel.app
              </ProjectLink>
            </div>
          </ProjectBody>
        </ProjectCard>
      </ProjectsGrid>
    </Page>
  );
};
