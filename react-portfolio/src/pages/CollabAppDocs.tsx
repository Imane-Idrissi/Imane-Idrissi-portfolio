import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import styled from 'styled-components';

// Import existing styled components from your original file
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    position: static;
    margin-top: ${({ theme }) => theme.spacing.xl};
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

const TocItemLink = styled.a<{ level: number }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ level }) => level === 2 ? '0.95rem' : '0.85rem'};
  font-weight: ${({ level }) => level === 2 ? '600' : '500'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-left: ${({ level }) => (level - 2) * 16}px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border-left: ${({ level }) => level > 2 ? '2px solid #e5e7eb' : 'none'};
  padding-left: ${({ level }) => level > 2 ? '16px' : '12px'};
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

// Styled markdown container that matches your existing design
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
  }

  h2 {
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    margin-top: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
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
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  code {
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    padding: 2px 6px;
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
    border: none;
    padding: 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }

  em {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: ${({ theme }) => theme.spacing.sm};
    display: block;
    text-align: center;
    font-style: italic;
  }

  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.border}, transparent);
    margin: ${({ theme }) => theme.spacing.xxl} 0;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  
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

type DocType = 'task-board' | 'chat-app';

type TaskBoardSection = 'intro' | 'functional-requirements' | 'modals' | 'cap-theorem' | 
              'implementation' | 'optimistic-ui' | 'caching' | 'concurrency' | 'performance' | 'lessons';

type ChatAppSection = 'intro' | 'ai-extraction' | 'websocket-architecture' | 'lessons';

type Section = TaskBoardSection | ChatAppSection;

const taskBoardNavigation = [
  { id: 'intro' as TaskBoardSection, title: 'Introduction', anchor: '#introduction' },
  { id: 'functional-requirements' as TaskBoardSection, title: 'Functional Requirements', anchor: '#functional-requirements-what-users-can-do' },
  { id: 'modals' as TaskBoardSection, title: 'UI Modals', anchor: '#ui-modals' },
  { id: 'cap-theorem' as TaskBoardSection, title: 'CAP Theorem Trade-offs', anchor: '#cap-theorem-trade-offs-theory-meets-reality' },
  { id: 'implementation' as TaskBoardSection, title: 'Implementation Strategies', anchor: '#implementation-strategies-from-theory-to-code' },
  { id: 'optimistic-ui' as TaskBoardSection, title: 'Optimistic UI Updates', anchor: '#deep-dive-optimistic-ui-updates' },
  { id: 'caching' as TaskBoardSection, title: 'Caching Layer', anchor: '#deep-dive-caching-layer' },
  { id: 'concurrency' as TaskBoardSection, title: 'Concurrency Control', anchor: '#concurrency-control-when-to-lock-vs-when-to-flow' },
  { id: 'performance' as TaskBoardSection, title: 'Performance & Monitoring', anchor: '#performance-targets-monitoring' },
  { id: 'lessons' as TaskBoardSection, title: 'Lessons Learned', anchor: '#real-world-impact-lessons-learned' }
];

const chatAppNavigation = [
  { id: 'intro' as ChatAppSection, title: 'Introduction', anchor: '#introduction' },
  { id: 'ai-extraction' as ChatAppSection, title: 'AI Task Extraction', anchor: '#ai-task-extraction-from-conversation-to-action' },
  { id: 'websocket-architecture' as ChatAppSection, title: 'Message Ordering (HLC)', anchor: '#websocket-real-time-architecture-hybrid-logical-clocks' },
  { id: 'lessons' as ChatAppSection, title: 'Lessons Learned', anchor: '#lessons-learned-that-changed-how-i-build' }
];

const DocSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 4px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`;

const DocTypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
      : 'transparent'
  };
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 0;

  &:hover {
    background: ${({ $active }) => 
      $active 
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
        : 'rgba(59, 130, 246, 0.1)'
    };
  }
`;

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export const CollabAppDocs: React.FC = () => {
  const location = useLocation();
  const [currentDocType, setCurrentDocType] = useState<DocType>('task-board');
  const [activeSection, setActiveSection] = useState<Section>('intro');
  const [sections, setSections] = useState<Record<Section, string>>({} as Record<Section, string>);
  const [currentSectionToc, setCurrentSectionToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        tocItems.push({
          id,
          title,
          level
        });
      }
    });
    
    return tocItems;
  };

  const splitMarkdownIntoSections = (content: string): Record<Section, string> => {
    const sectionMap: Record<Section, string> = {} as Record<Section, string>;
    
    // Split by ## headers (main sections)
    const parts = content.split(/(?=^## )/m);
    
    // The first part is the title and introduction
    // Check if second part is the walkthrough section (for chat app docs)
    let introPart = parts[0] + (parts[1] || '');
    let startIndex = 2;
    
    // If the third part exists and contains "What You'll Discover", include it in intro
    if (parts[2] && parts[2].toLowerCase().includes("what you'll discover")) {
      introPart += parts[2];
      startIndex = 3;
    }
    
    sectionMap['intro'] = introPart;
    
    // Map the other sections
    for (let i = startIndex; i < parts.length; i++) {
      const part = parts[i];
      const headerMatch = part.match(/^## (.+)/);
      if (headerMatch) {
        const title = headerMatch[1].toLowerCase();
        
        // Task Board sections
        if (title.includes('functional requirements')) {
          sectionMap['functional-requirements'] = part;
        } else if (title.includes('hidden ui features') || title.includes('modal system') || title.includes('ui modals')) {
          sectionMap['modals'] = part;
        } else if (title.includes('cap theorem')) {
          sectionMap['cap-theorem'] = part;
        } else if (title.includes('implementation strategies')) {
          sectionMap['implementation'] = part;
        } else if (title.includes('deep dive') && title.includes('optimistic')) {
          sectionMap['optimistic-ui'] = part;
        } else if (title.includes('deep dive') && title.includes('caching')) {
          sectionMap['caching'] = part;
        } else if (title.includes('concurrency control')) {
          sectionMap['concurrency'] = part;
        }
        // Chat App sections
        else if (title.includes('ai task extraction')) {
          sectionMap['ai-extraction'] = part;
        } else if (title.includes('websocket') || title.includes('real-time')) {
          sectionMap['websocket-architecture'] = part;
        }
        // Common sections
        else if (title.includes('performance')) {
          sectionMap['performance'] = part;
        } else if (title.includes('real-world impact') || title.includes('lessons learned')) {
          sectionMap['lessons'] = part;
        }
      }
    }
    
    return sectionMap;
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        console.log('Attempting to load markdown content for:', currentDocType);
        // Load from public folder with cache busting
        const filename = currentDocType === 'task-board' ? 'task-board-documentation.md' : 'chat-app-documentation.md';
        const response = await fetch(`/${filename}?t=${Date.now()}`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        console.log('Content loaded, first 100 chars:', content.substring(0, 100));
        
        // Check if we're getting HTML instead of markdown
        if (content.includes('<!DOCTYPE html>')) {
          throw new Error('Received HTML instead of markdown - possible routing issue');
        }
        
        const sectionsMap = splitMarkdownIntoSections(content);
        setSections(sectionsMap);
        console.log('Sections split:', Object.keys(sectionsMap));
        
        // Reset to intro section when changing doc type
        setActiveSection('intro');
      } catch (error) {
        console.error('Error loading markdown content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorContent = `# Error Loading Documentation

**Issue:** ${errorMessage}

Please check that:
1. The file \`${currentDocType}-documentation.md\` exists in the public folder
2. The React development server is running properly
3. There are no routing conflicts

**Debug Info:**
- Current URL: ${window.location.href}
- Attempting to fetch: /${currentDocType}-documentation.md`;
        
        setSections({ 'intro': errorContent } as Record<Section, string>);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, [currentDocType]);

  const handleSectionClick = (sectionId: Section) => {
    setActiveSection(sectionId);
    // Update table of contents for the new section
    const sectionContent = sections[sectionId] || '';
    const tocItems = extractTableOfContents(sectionContent);
    setCurrentSectionToc(tocItems);
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -80; // Offset to account for sticky header and padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handle URL query parameters for direct navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const highlight = searchParams.get('highlight');
    
    if (section === 'modals' && !loading) {
      setActiveSection('modals');
      
      if (highlight === 'deep-dive') {
        // Wait for the section to load, then scroll to the Deep Dive
        setTimeout(() => {
          const deepDiveElement = document.getElementById('deep-dive-the-collaborative-edit-modal-two-layer-conflict-resolution');
          if (deepDiveElement) {
            const yOffset = -120; // More offset to account for sticky header and show title clearly
            const y = deepDiveElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 200);
      }
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
  const currentNavigation = currentDocType === 'task-board' ? taskBoardNavigation : chatAppNavigation;
  const currentTitle = currentDocType === 'task-board' ? 'Task Board Documentation' : 'Chat App Documentation';

  return (
    <PageContainer>
      <Sidebar>
        <DocSwitcher>
          <DocTypeButton
            $active={currentDocType === 'task-board'}
            onClick={() => setCurrentDocType('task-board')}
          >
            Task Board
          </DocTypeButton>
          <DocTypeButton
            $active={currentDocType === 'chat-app'}
            onClick={() => setCurrentDocType('chat-app')}
          >
            Chat App
          </DocTypeButton>
        </DocSwitcher>
        <SidebarTitle>{currentTitle}</SidebarTitle>
        {currentNavigation.map((section) => (
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom component for handling section IDs
                h1: ({ children, ...props }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h1 id={id} {...props}>{children}</h1>;
                },
                h2: ({ children, ...props }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h2 id={id} {...props}>{children}</h2>;
                },
                h3: ({ children, ...props }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h3 id={id} {...props}>{children}</h3>;
                },
                h4: ({ children, ...props }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h4 id={id} {...props}>{children}</h4>;
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
                level={item.level}
                onClick={() => scrollToHeading(item.id)}
              >
                {item.title}
              </TocItemLink>
            ))}
          </RightSidebar>
        )}
      </MainContent>
    </PageContainer>
  );
};