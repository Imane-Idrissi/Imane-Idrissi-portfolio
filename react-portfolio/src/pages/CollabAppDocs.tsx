import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import styled from 'styled-components';
import { getAssetPath } from '../utils/assetPath';

// Import existing styled components from your original file
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


const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
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
    color: #3b82f6;
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

type DocType = 'overview' | 'task-board' | 'chat-app';

type TaskBoardSection = 'intro' | 'functional-requirements' | 'modals' | 'cap-theorem' | 
              'implementation' | 'optimistic-ui' | 'caching' | 'concurrency' | 'lessons';

type ChatAppSection = 'intro' | 'ai-extraction';

type OverviewSection = 'intro';

type Section = TaskBoardSection | ChatAppSection | OverviewSection;

const taskBoardNavigation = [
  { id: 'intro' as TaskBoardSection, title: 'Introduction', anchor: '#introduction' },
  { id: 'functional-requirements' as TaskBoardSection, title: 'Functional Requirements', anchor: '#functional-requirements-what-users-can-do' },
  { id: 'modals' as TaskBoardSection, title: 'UI Modals', anchor: '#ui-modals' },
  { id: 'cap-theorem' as TaskBoardSection, title: 'CAP Theorem Trade-offs', anchor: '#cap-theorem-trade-offs-theory-meets-reality' },
  { id: 'implementation' as TaskBoardSection, title: 'Implementation Strategies', anchor: '#implementation-strategies-from-theory-to-code' },
  { id: 'optimistic-ui' as TaskBoardSection, title: 'Optimistic UI Updates', anchor: '#deep-dive-optimistic-ui-updates' },
  { id: 'caching' as TaskBoardSection, title: 'Caching Layer', anchor: '#deep-dive-caching-layer' },
  { id: 'concurrency' as TaskBoardSection, title: 'Concurrency Control', anchor: '#concurrency-control-when-to-lock-vs-when-to-flow' },
  { id: 'lessons' as TaskBoardSection, title: 'Lessons Learned', anchor: '#real-world-impact-lessons-learned' }
];

const chatAppNavigation = [
  { id: 'intro' as ChatAppSection, title: 'Introduction', anchor: '#introduction' },
  { id: 'ai-extraction' as ChatAppSection, title: 'AI Task Extraction', anchor: '#ai-task-extraction-from-conversation-to-action' }
];

const overviewNavigation = [
  { id: 'intro' as OverviewSection, title: 'Introduction', anchor: '#introduction' }
];

const DocSwitcher = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(59, 130, 246, 0.15);
  width: 100%;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  backdrop-filter: blur(10px);
`;

const DocTypeButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 10px 16px;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
      : 'transparent'
  };
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  transition: all 0.3s ease;
  text-align: left;
  min-width: 0;

  &:hover {
    background: ${({ $active }) => 
      $active 
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
        : 'rgba(59, 130, 246, 0.1)'
    };
    transform: translateX(2px);
  }
`;

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export const CollabAppDocs: React.FC = () => {
  const location = useLocation();
  
  // Initialize state from URL hash
  const getInitialStateFromUrl = () => {
    const hash = window.location.hash.slice(1); // Remove #
    const params = new URLSearchParams(window.location.search);
    const goto = params.get('goto');
    
    // Handle goto parameter (existing logic)
    if (goto === 'deep-dive-the-edit-modal-multiple-users-editing-the-same-task') {
      return { docType: 'task-board' as DocType, section: 'modals' as Section };
    }
    
    if (goto === 'ai-powered-task-extraction') {
      return { docType: 'chat-app' as DocType, section: 'ai-extraction' as Section };
    }
    
    // Parse hash format: doctype-section (e.g., task-board-modals)
    if (hash) {
      const parts = hash.split('-');
      if (parts.length >= 2) {
        const docType = parts[0] as DocType;
        const section = parts.slice(1).join('-') as Section;
        
        // Validate docType and section
        if (['overview', 'task-board', 'chat-app'].includes(docType)) {
          // Additional validation: check if section is valid for the docType
          const validSections = {
            'overview': ['intro'],
            'task-board': ['intro', 'functional-requirements', 'modals', 'cap-theorem', 'implementation', 'optimistic-ui', 'caching', 'concurrency', 'lessons'],
            'chat-app': ['intro', 'ai-extraction']
          };
          
          if (validSections[docType].includes(section)) {
            return { docType, section };
          } else {
            // If section is invalid but docType is valid, default to intro for that docType
            return { docType, section: 'intro' as Section };
          }
        }
      } else if (parts.length === 1) {
        // Handle case where only docType is in hash (e.g., #task-board)
        const docType = parts[0] as DocType;
        if (['overview', 'task-board', 'chat-app'].includes(docType)) {
          return { docType, section: 'intro' as Section };
        }
      }
    }
    
    // Try to restore from sessionStorage if available
    const savedState = sessionStorage.getItem('collabAppDocsState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.docType && parsed.section) {
          return { docType: parsed.docType as DocType, section: parsed.section as Section };
        }
      } catch (e) {
        // Ignore invalid sessionStorage data
      }
    }
    
    // Smart default: always default to overview
    return { docType: 'overview' as DocType, section: 'intro' as Section };
  };
  
  const initialState = getInitialStateFromUrl();
  const [currentDocType, setCurrentDocType] = useState<DocType>(initialState.docType);
  const [activeSection, setActiveSection] = useState<Section>(initialState.section);
  const [sections, setSections] = useState<Record<Section, string>>({} as Record<Section, string>);
  const [currentSectionToc, setCurrentSectionToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    
    // For overview documentation, include all content in intro section
    if (currentDocType === 'overview') {
      sectionMap['intro'] = content;
      return sectionMap;
    }
    
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
        }
        // Common sections
        else if (title.includes('real-world impact') || title.includes('lessons learned')) {
          sectionMap['lessons'] = part;
        }
      }
    }
    
    return sectionMap;
  };

  // Detect page refresh and show loading state
  useEffect(() => {
    // Check if this is a page refresh
    const isPageRefresh = sessionStorage.getItem('pageRefreshed') === 'true';
    
    if (isPageRefresh) {
      setIsRefreshing(true);
      // Show loading spinner for a brief moment to give refresh feedback
      setTimeout(() => {
        setIsRefreshing(false);
        sessionStorage.removeItem('pageRefreshed');
      }, 300);
    }
    
    // Set flag for next potential refresh
    const handleBeforeUnload = () => {
      sessionStorage.setItem('pageRefreshed', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const loadMarkdownContent = async () => {
      // Load from public folder with cache busting
      let filename: string;
      if (currentDocType === 'task-board') {
        filename = 'docs/projects/collab-app/task-board.md';
      } else if (currentDocType === 'chat-app') {
        filename = 'docs/projects/collab-app/chat-app.md';
      } else {
        filename = 'docs/projects/collab-app/overview.md';
      }
      
      try {
        const response = await fetch(`${getAssetPath(`/${filename}`)}?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
        
        // Don't automatically reset to intro - let the hash handler manage the active section
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorContent = `# Error Loading Documentation

**Issue:** ${errorMessage}

Please check that:
1. The file exists in the public/docs/projects/collab-app/ folder
2. The React development server is running properly
3. There are no routing conflicts

**Debug Info:**
- Current URL: ${window.location.href}
- Attempting to fetch: ${getAssetPath(`/${filename}`)}`;
        
        setSections({ 'intro': errorContent } as Record<Section, string>);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, [currentDocType]);

  // Update URL to reflect current state
  const updateUrl = (docType: DocType, section: Section) => {
    const hash = `${docType}-${section}`;
    window.history.replaceState(null, '', `${window.location.pathname}#${hash}`);
  };

  const handleSectionClick = (sectionId: Section) => {
    setActiveSection(sectionId);
    updateUrl(currentDocType, sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu
    // Update table of contents for the new section
    const sectionContent = sections[sectionId] || '';
    const tocItems = extractTableOfContents(sectionContent);
    setCurrentSectionToc(tocItems);
    // Save state to sessionStorage
    sessionStorage.setItem('collabAppDocsState', JSON.stringify({ docType: currentDocType, section: sectionId }));
  };

  const handleDocTypeChange = (docType: DocType) => {
    setCurrentDocType(docType);
    setActiveSection('intro'); // Reset to intro when changing doc type
    updateUrl(docType, 'intro');
    setIsMobileMenuOpen(false); // Close mobile sidebar when navigating
    // Save state to sessionStorage
    sessionStorage.setItem('collabAppDocsState', JSON.stringify({ docType, section: 'intro' }));
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -80; // Offset to account for sticky header and padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handle specific goto parameter for direct navigation to exact section
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const goto = searchParams.get('goto');
    
    if (goto === 'deep-dive-the-edit-modal-multiple-users-editing-the-same-task') {
      // Switch to task-board documentation and modals section immediately
      setCurrentDocType('task-board');
      setActiveSection('modals');
      setPendingScroll('edit-modal');
      
      // Clean up URL and set final URL
      const newUrl = window.location.pathname + '#task-board-modals';
      window.history.replaceState({}, '', newUrl);
    }
    
    if (goto === 'ai-powered-task-extraction') {
      // Switch to chat-app documentation and ai-extraction section immediately
      setCurrentDocType('chat-app');
      setActiveSection('ai-extraction');
      setPendingScroll('ai-extraction');
      
      // Clean up URL and set final URL
      const newUrl = window.location.pathname + '#chat-app-ai-extraction';
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search]);

  // Separate effect to handle scrolling after sections are loaded
  useEffect(() => {
    if (pendingScroll && !loading && sections[activeSection]) {
      if (pendingScroll === 'edit-modal' && 
          currentDocType === 'task-board' && 
          activeSection === 'modals' && 
          sections['modals']) {
        
        // Jump directly to Deep Dive position immediately when content is ready
        setTimeout(() => {
          window.scrollTo(0, 800);
          setPendingScroll(null); // Clear pending scroll
        }, 100);
      }
      
      if (pendingScroll === 'ai-extraction' && 
          currentDocType === 'chat-app' && 
          activeSection === 'ai-extraction' && 
          sections['ai-extraction']) {
        
        // Scroll to top of the AI extraction section
        setTimeout(() => {
          window.scrollTo(0, 0);
          setPendingScroll(null); // Clear pending scroll
        }, 100);
      }
    }
  }, [pendingScroll, loading, sections, currentDocType, activeSection]);

  // Update TOC when sections change
  useEffect(() => {
    if (sections[activeSection]) {
      const tocItems = extractTableOfContents(sections[activeSection]);
      setCurrentSectionToc(tocItems);
    }
  }, [sections, activeSection]);

  // Handle hash changes (e.g., from page refresh or back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const parts = hash.split('-');
        if (parts.length >= 2) {
          const docType = parts[0] as DocType;
          const section = parts.slice(1).join('-') as Section;
          
          // Validate the parsed values
          if (['overview', 'task-board', 'chat-app'].includes(docType)) {
            setCurrentDocType(docType);
            setActiveSection(section);
            // Save state to sessionStorage when hash changes
            sessionStorage.setItem('collabAppDocsState', JSON.stringify({ docType, section }));
          }
        }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Also run on mount to handle direct navigation
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading || isRefreshing) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  const currentSectionContent = sections[activeSection] || '';
  
  const currentNavigation = currentDocType === 'task-board' ? taskBoardNavigation : 
                           currentDocType === 'chat-app' ? chatAppNavigation : overviewNavigation;
  const currentTitle = currentDocType === 'task-board' ? 'Task Board Documentation' : 
                      currentDocType === 'chat-app' ? 'Chat App Documentation' : 'Collaboration Platform Overview';

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
        <DocSwitcher>
          <DocTypeButton
            $active={currentDocType === 'overview'}
            onClick={() => handleDocTypeChange('overview')}
          >
            Overview
          </DocTypeButton>
          <DocTypeButton
            $active={currentDocType === 'task-board'}
            onClick={() => handleDocTypeChange('task-board')}
          >
            Task Board
          </DocTypeButton>
          <DocTypeButton
            $active={currentDocType === 'chat-app'}
            onClick={() => handleDocTypeChange('chat-app')}
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
            {/* For AI extraction section, extract and show title before video */}
            {currentDocType === 'chat-app' && activeSection === 'ai-extraction' && (() => {
              // Extract the first h2 from the markdown content
              const titleMatch = currentSectionContent.match(/^##\s+(.+)$/m);
              const title = titleMatch ? titleMatch[1] : null;
              
              return title ? (
                <>
                  <h2 id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}>{title}</h2>
                  <VideoContainer>
                    <StyledVideo controls controlsList="nodownload">
                      <source src={getAssetPath('/assets/projects/collab-app/videos/task-ai-extraction.mov')} type="video/quicktime" />
                      <source src={getAssetPath('/assets/projects/collab-app/videos/task-ai-extraction.mov')} type="video/mp4" />
                      Your browser does not support the video tag.
                    </StyledVideo>
                    <VideoCaption>Live demonstration of AI analyzing chat conversations and extracting actionable tasks with confidence scoring</VideoCaption>
                  </VideoContainer>
                </>
              ) : (
                <VideoContainer>
                  <StyledVideo controls controlsList="nodownload">
                    <source src={getAssetPath('/assets/projects/collab-app/videos/task-ai-extraction.mov')} type="video/quicktime" />
                    <source src={getAssetPath('/assets/projects/collab-app/videos/task-ai-extraction.mov')} type="video/mp4" />
                    Your browser does not support the video tag.
                  </StyledVideo>
                  <VideoCaption>Live demonstration of AI analyzing chat conversations and extracting actionable tasks with confidence scoring</VideoCaption>
                </VideoContainer>
              );
            })()}
            
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
                  // Skip rendering the first h2 in AI extraction section since we already show it
                  if (currentDocType === 'chat-app' && activeSection === 'ai-extraction' && 
                      children?.toString() === 'AI Task Extraction – From Conversation to Action') {
                    return null;
                  }
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