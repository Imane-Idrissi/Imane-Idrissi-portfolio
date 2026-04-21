import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const TocContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TocLink = styled.a<{ $level: number; $active: boolean }>`
  display: block;
  padding: 3px 8px;
  padding-left: ${({ $level }) => 8 + ($level - 2) * 12}px;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: ${({ $level }) => $level === 2 ? '0.78rem' : '0.73rem'};
  font-weight: ${({ $active, $level }) => $active ? '600' : $level === 2 ? '500' : '400'};
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.15s ease;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary + '10' : 'transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

export function extractTableOfContents(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];

  lines.forEach(line => {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      items.push({ id, title, level });
    }
  });

  return items;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    const headings = items
      .map(item => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter(h => h.el !== null);

    if (headings.length === 0) return;

    let current = headings[0].id;
    for (const heading of headings) {
      const rect = heading.el!.getBoundingClientRect();
      if (rect.top <= 120) {
        current = heading.id;
      } else {
        break;
      }
    }
    setActiveId(current);
  }, [items]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <Sidebar>
      <TocContainer>
        <Title>On this page</Title>
        <TocList>
          {items.map((item) => (
            <TocLink
              key={item.id}
              $level={item.level}
              $active={activeId === item.id}
              onClick={() => scrollToHeading(item.id)}
            >
              {item.title}
            </TocLink>
          ))}
        </TocList>
      </TocContainer>
    </Sidebar>
  );
};
