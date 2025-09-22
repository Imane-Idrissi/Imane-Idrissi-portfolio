import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ImageModal } from '../components/common/ImageModal';
import { getAssetPath } from '../utils/assetPath';

const ProjectsContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const ProjectsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1100px;
  margin: 0 auto;
`;

const ProjectCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
  }
`;

const ProjectImage = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  height: 350px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }
`;

const ProjectContent = styled.div`
  text-align: center;
`;

const ProjectTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const ProjectDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: justify;
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  
  button {
    flex: 1;
    width: 100%;
  }
`;

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  
  return (
    <ProjectsContainer>
      <ProjectsContent>
        <PageTitle>My Projects</PageTitle>
        
        <ProjectGrid>
          <ProjectCard>
            <ProjectContent>
              <ProjectTitle>CollabApp</ProjectTitle>
            </ProjectContent>
            <ProjectImage>
              <img 
                src={getAssetPath('/assets/projects/collab-app/home.webp')} 
                alt="CollabApp - Real-time collaboration platform with Kanban board and AI-powered chat"
                onClick={() => setModalImage({
                  src: getAssetPath('/assets/projects/collab-app/home.webp'),
                  alt: "CollabApp - Real-time collaboration platform with Kanban board and AI-powered chat"
                })}
              />
            </ProjectImage>
            <ProjectContent>
              <ProjectDescription>
                A collaborative platform that combines a Kanban board with a chat app. 
                What makes it different is an AI feature that turns group conversations 
                into actionable tasks that are registered within the task board.
              </ProjectDescription>
              <ButtonGroup>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/projects/collab-app?goto=overview')}
                >
                  View Project →
                </Button>
              </ButtonGroup>
            </ProjectContent>
          </ProjectCard>

          <ProjectCard>
            <ProjectContent>
              <ProjectTitle>Style App</ProjectTitle>
            </ProjectContent>
            <ProjectImage>
              <img 
                src={getAssetPath('/assets/projects/e-commerce/home.webp')} 
                alt="Style App - Modern e-commerce platform with Stripe payments and inventory management"
                onClick={() => setModalImage({
                  src: getAssetPath('/assets/projects/e-commerce/home.webp'),
                  alt: "Style App - Modern e-commerce platform with Stripe payments and inventory management"
                })}
              />
            </ProjectImage>
            <ProjectContent>
              <ProjectDescription>
                An online store where users can browse women's, men's, and kids' categories 
                with subcategories. Shoppers can select items with the right size and quantity, 
                add them to the cart, and complete their purchase through Stripe payments.
              </ProjectDescription>
              <ButtonGroup>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => {
                    navigate('/projects/e-commerce');
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                >
                  View Project →
                </Button>
              </ButtonGroup>
            </ProjectContent>
          </ProjectCard>
        </ProjectGrid>
      </ProjectsContent>
      
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
        />
      )}
    </ProjectsContainer>
  );
};