import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

const HomeContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.sm};
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .highlight {
    color: ${({ theme }) => theme.colors.primary};
  }

  .wave {
    font-size: 4rem;
    animation: wave 2s ease-in-out infinite;
  }

  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-10deg); }
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

const FeaturesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureCard = styled.div<{ $reverse?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  padding-bottom: ${({ theme }) => theme.spacing.xxl};

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border || '#e2e8f0'};
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: left;
`;

const FeatureDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BenefitsList = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &::before {
    content: '✅';
    font-size: 1rem;
  }
`;

const FeatureImage = styled.div`
  position: relative;
  transition: transform 0.3s ease;
  width: 100%;
  height: 450px;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;

  &:hover {
    transform: translateY(-5px) scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    cursor: pointer;
    transition: transform 0.3s ease;
    background: transparent;
    border: none;
    box-shadow: none;

    &:hover {
      transform: scale(1.01);
    }
  }
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>
          <span className="wave">👋</span>
          Hi, I'm <span className="highlight">Imane</span>
        </HeroTitle>
        <HeroDescription>
          A passionate full-stack developer crafting exceptional web experiences 
          with modern technologies. I love building scalable applications and 
          solving complex problems through clean, efficient code.
        </HeroDescription>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/projects')}
        >
          View Projects →
        </Button>
      </HeroSection>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>Featured Capabilities</SectionTitle>
          
          <FeatureCard>
            <FeatureTitle>Collaborative Task Editing</FeatureTitle>
            <FeatureImage>
              <img src="/task-board-images/edit-modal.png" alt="Task editing interface" />
            </FeatureImage>
            <FeatureDescription>
              Editing tasks simultaneously is inevitable in collaboration: users get locked out or the system can let conflicts occur and then resolve them. 
              I designed a two-layer solution that addresses conflicts at both the human and technical levels.
            </FeatureDescription>
            <BenefitsList>
              <BenefitItem>Floating chat automatically appears when multiple users edit the same task</BenefitItem>
              <BenefitItem>WebSockets broadcast presence detection for real-time coordination</BenefitItem>
              <BenefitItem>Optimistic locking with version control for infrastructure-level resolution</BenefitItem>
              <BenefitItem>Editors can negotiate: "I'll update the description, you handle assignees"</BenefitItem>
            </BenefitsList>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => navigate('/projects/collab-app?section=modals&highlight=deep-dive')}
            >
              View Case Study →
            </Button>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>AI-Powered Task Extraction</FeatureTitle>
            <FeatureImage>
              <img src="/chat-images/ai-task-extraction.png" alt="AI task extraction interface" />
            </FeatureImage>
            <FeatureDescription>
              Traditional chat apps store conversations. This one transforms them. 
              Our AI analyzes team discussions and automatically suggests actionable tasks with confidence scoring, bridging the gap between communication and project management.
            </FeatureDescription>
            <BenefitsList>
              <BenefitItem>AI extracts actionable items from natural conversations</BenefitItem>
              <BenefitItem>Tasks are suggested with confidence scores and AI reasoning</BenefitItem>
              <BenefitItem>Smart deduplication prevents similar tasks from being created</BenefitItem>
              <BenefitItem>One-click task creation directly from chat conversations</BenefitItem>
            </BenefitsList>
            <Button variant="primary" size="md">
              View Case Study →
            </Button>
          </FeatureCard>
        </FeaturesContainer>
      </FeaturesSection>
    </HomeContainer>
  );
};