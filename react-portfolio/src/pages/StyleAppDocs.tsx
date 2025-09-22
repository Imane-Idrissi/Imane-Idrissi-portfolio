import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import styled from 'styled-components';
import { ImageModal } from '../components/common/ImageModal';
import { getAssetPath } from '../utils/assetPath';

// Import existing styled components from CollabAppDocs
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.aside<{ $isOpen?: boolean }>`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    position: fixed;
    top: 0;
    left: ${({ $isOpen }) => $isOpen ? '0' : '-280px'};
    width: 280px;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
    flex-direction: column;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  max-width: 800px;
`;

const RightSidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  height: fit-content;
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: translateX(-50%) translateY(0px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
  }
`;

const MobileOverlay = styled.div<{ $isOpen?: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: block;
  }
`;

const RightSidebarTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TocItemLink = styled.a<{ $level: number }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ $level }) => $level === 2 ? '0.95rem' : '0.85rem'};
  font-weight: ${({ $level }) => $level === 2 ? '600' : '500'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-left: ${({ $level }) => ($level - 2) * 16}px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border-left: ${({ $level }) => $level > 2 ? '2px solid #e5e7eb' : 'none'};
  padding-left: ${({ $level }) => $level > 2 ? '16px' : '12px'};
  line-height: 1.4;
  word-wrap: break-word;
  hyphens: auto;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
    color: ${({ theme }) => theme.colors.text};
    transform: translateX(3px);
  }

  &:hover::before {
    opacity: 1;
  }

  &.active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    font-weight: 600;
  }

  &.active::before {
    opacity: 0;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $active }) => 
    $active 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
      : 'transparent'
  };
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    background: ${({ theme, $active }) => 
      $active 
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
        : theme.colors.surface
    };
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text};
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &:hover::before {
    opacity: ${({ $active }) => $active ? '0' : '0.1'};
  }
`;

// Styled markdown container
const MarkdownContainer = styled.div`
  max-width: 900px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-weight: 800;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  li {
    line-height: 1.7;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  code {
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
  }

  pre {
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: 0.85em;
  }

  blockquote {
    background-color: ${({ theme }) => theme.colors.surface};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-style: italic;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;

    &:hover {
      border-bottom-color: ${({ theme }) => theme.colors.primary};
    }
  }

  strong {
    color: #3b82f6;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  th, td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.surface};
    font-weight: 600;
  }
`;

const VideoContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  text-align: center;
`;

const StyledVideo = styled.video`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const VideoCaption = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;


const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 999;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

type StyleAppSection = 'intro' | 'inventory-management';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

const styleAppNavigation = [
  { id: 'intro' as StyleAppSection, title: 'Introduction', anchor: '#introduction' },
  { id: 'inventory-management' as StyleAppSection, title: 'Inventory Management', anchor: '#inventory-management' }
];

export const StyleAppDocs: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<StyleAppSection>('intro');
  const [sections, setSections] = useState<Record<StyleAppSection, string>>({} as Record<StyleAppSection, string>);
  const [currentSectionToc, setCurrentSectionToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  const extractTableOfContents = (markdownContent: string): TocItem[] => {
    const lines = markdownContent.split('\n');
    const tocItems: TocItem[] = [];
    
    lines.forEach(line => {
      // Match h2 and h3 headings (## and ###), but not h4 and deeper
      const headerMatch = line.match(/^(#{2,3})\s+(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        const id = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        tocItems.push({ id, title, level });
      }
    });
    
    return tocItems;
  };

  // Split markdown into sections based on main headings
  const splitMarkdownIntoSections = (content: string): Record<StyleAppSection, string> => {
    // Find the split point for inventory management
    const inventoryIndex = content.indexOf('## Inventory Management');
    
    if (inventoryIndex === -1) {
      // If no inventory management section found, everything goes to intro
      return {
        'intro': content,
        'inventory-management': ''
      } as Record<StyleAppSection, string>;
    }
    
    // Split content: everything before inventory management goes to intro
    const introContent = content.substring(0, inventoryIndex).trim();
    const inventoryContent = content.substring(inventoryIndex).trim();
    
    return {
      'intro': introContent,
      'inventory-management': inventoryContent
    } as Record<StyleAppSection, string>;
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const response = await fetch(`${getAssetPath('/docs/projects/e-commerce/style-app.md')}?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let content = await response.text();
        
        // Check if we're getting HTML instead of markdown
        if (content.includes('<!DOCTYPE html>')) {
          throw new Error('Received HTML instead of markdown - possible routing issue');
        }
        
        // Fix image paths for GitHub Pages
        content = content.replace(/!\[([^\]]*)\]\(\/assets\//g, `![$1](${getAssetPath('/assets/')}`);
        
        const sectionsMap = splitMarkdownIntoSections(content);
        setSections(sectionsMap);
        
        // Reset to intro section
        setActiveSection('intro');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorContent = `# Error Loading Documentation

**Issue:** ${errorMessage}

Please check that:
1. The file exists in the public/docs/projects/e-commerce/ folder
2. The React development server is running properly
3. There are no routing conflicts

**Debug Info:**
- Current URL: ${window.location.href}
- Attempting to fetch: ${getAssetPath('/docs/projects/e-commerce/style-app.md')}`;
        
        setSections({ 'intro': errorContent } as Record<StyleAppSection, string>);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, []);

  const handleSectionClick = (sectionId: StyleAppSection) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu
    
    // Scroll to top when switching sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update table of contents for the new section
    const sectionContent = sections[sectionId] || '';
    const tocItems = extractTableOfContents(sectionContent);
    setCurrentSectionToc(tocItems);
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle URL query parameters for direct navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    
    if (section === 'inventory-management' && !loading) {
      setActiveSection('inventory-management');
    }
  }, [location.search, loading]);

  // Update TOC when sections change
  useEffect(() => {
    if (sections[activeSection]) {
      const tocItems = extractTableOfContents(sections[activeSection]);
      setCurrentSectionToc(tocItems);
    }
  }, [sections, activeSection]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  const currentSectionContent = sections[activeSection] || '';

  return (
    <PageContainer>
      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span>{isMobileMenuOpen ? '✕' : '📋'}</span>
        <span>{isMobileMenuOpen ? 'Close Navigation' : 'View Navigation'}</span>
      </MobileMenuButton>
      
      <MobileOverlay 
        $isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      
      <Sidebar $isOpen={isMobileMenuOpen}>        
        <SidebarTitle>Style E-commerce Documentation</SidebarTitle>
        {styleAppNavigation.map((section) => (
          <NavItem
            key={section.id}
            $active={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          >
            {section.title}
          </NavItem>
        ))}
      </Sidebar>

      <MainContent>
        <ContentArea>
          <MarkdownContainer>
            {/* Show title and video at the top of intro section */}
            {activeSection === 'intro' && (() => {
              // Extract the first h1 from the markdown content
              const titleMatch = currentSectionContent.match(/^#\s+(.+)$/m);
              const title = titleMatch ? titleMatch[1] : null;
              
              return title ? (
                <>
                  <h1 id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}>{title}</h1>
                  <VideoContainer>
                    <StyledVideo controls controlsList="nodownload" playsInline webkit-playsinline="true" >
                      <source src={getAssetPath('/assets/projects/e-commerce/demo.mp4')} type="video/mp4" />
                      Your browser does not support the video tag.
                    </StyledVideo>
                    <VideoCaption>demo of the Style e-commerce platform</VideoCaption>
                  </VideoContainer>
                </>
              ) : (
                <VideoContainer>
                  <StyledVideo controls controlsList="nodownload" playsInline webkit-playsinline="true" >
                    <source src={getAssetPath('/assets/projects/e-commerce/demo.mp4')} type="video/mp4" />
                    Your browser does not support the video tag.
                  </StyledVideo>
                  <VideoCaption>demo of the Style e-commerce platform</VideoCaption>
                </VideoContainer>
              );
            })()}
            
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children, ...props }) => {
                  // Skip rendering the first h1 in intro section since we already show it
                  if (activeSection === 'intro' && children?.toString() === 'Style E-commerce App') {
                    return null;
                  }
                  return <h1 id={children?.toString().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')} {...props}>{children}</h1>;
                },
                h2: ({ children, ...props }) => <h2 id={children?.toString().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')} {...props}>{children}</h2>,
                h3: ({ children, ...props }) => <h3 id={children?.toString().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')} {...props}>{children}</h3>,
                img: ({ src, alt, ...props }) => {
                  const imageSrc = src?.startsWith('/') ? getAssetPath(src) : src;
                  return (
                    <img
                      src={imageSrc}
                      alt={alt}
                      loading="lazy"
                      onClick={() => setModalImage({ src: imageSrc || '', alt: alt || '' })}
                      style={{ cursor: 'pointer' }}
                      {...props}
                    />
                  );
                },
              }}
            >
              {currentSectionContent}
            </ReactMarkdown>
          </MarkdownContainer>
        </ContentArea>

        {currentSectionToc.length > 0 && (
          <RightSidebar>
            <RightSidebarTitle>On This Page</RightSidebarTitle>
            {currentSectionToc.map((item) => (
              <TocItemLink
                key={item.id}
                $level={item.level}
                onClick={() => scrollToHeading(item.id)}
              >
                {item.title}
              </TocItemLink>
            ))}
          </RightSidebar>
        )}
      </MainContent>
      
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
        />
      )}
    </PageContainer>
  );
};