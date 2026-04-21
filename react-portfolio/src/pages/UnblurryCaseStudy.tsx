import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { TableOfContents, extractTableOfContents, TocItem } from '../components/markdown/TableOfContents';
import { getAssetPath } from '../utils/assetPath';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1100px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const UnblurryCaseStudy: React.FC = () => {
  const [markdown, setMarkdown] = useState('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(getAssetPath('/docs/projects/unblurry/case-study.md'));
        let content = await res.text();
        content = content.replace(/!\[([^\]]*)\]\(\/assets\//g, `![$1](${getAssetPath('/assets/')}`);
        setMarkdown(content);
        setToc(extractTableOfContents(content));
      } catch {
        setMarkdown('# Error\n\nFailed to load case study.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <Page><Loading>Loading...</Loading></Page>;
  }

  return (
    <Page>
      <Content>
        <MarkdownRenderer content={markdown} />
      </Content>
      <TableOfContents items={toc} />
    </Page>
  );
};
