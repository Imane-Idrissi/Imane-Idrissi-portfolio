import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import styled from 'styled-components';
import { getAssetPath } from '../../utils/assetPath';

export const MarkdownContainer = styled.div`
  max-width: 800px;

  h1 {
    font-size: 2.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.2;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.xxl};
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
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
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  code {
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    padding: 2px 6px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.88em;
  }

  pre {
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.85rem;
    line-height: 1.6;
  }

  pre code {
    background: none;
    border: none;
    padding: 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  blockquote {
    background-color: ${({ theme }) => theme.colors.surface};
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;

    p {
      margin-bottom: 0;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  hr {
    border: none;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.xxl} 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;

    &:hover {
      opacity: 0.8;
    }
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

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <MarkdownContainer>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
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
          img: ({ src, alt, ...props }) => {
            const imageSrc = src?.startsWith('/') ? getAssetPath(src) : src;
            const isHero = src?.includes('hero.png');
            return <img src={imageSrc} alt={alt} loading="lazy" style={isHero ? undefined : { maxWidth: '70%' }} {...props} />;
          },
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};
