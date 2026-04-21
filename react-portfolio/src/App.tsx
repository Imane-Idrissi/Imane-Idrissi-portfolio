import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { UnblurryCaseStudy } from './pages/UnblurryCaseStudy';
import { NotFound } from './pages/NotFound';
import { BlogPost } from './pages/BlogPost';
import { CollabAppCaseStudy } from './pages/CollabAppCaseStudy';
import posthog from './lib/posthog';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    posthog.capture('page_viewed', {
      path: location.pathname,
      page_title: document.title,
      referrer: document.referrer
    });
  }, [location]);

  return null;
}

function App() {

  useEffect(() => {
    posthog.capture('portfolio_loaded', {
      timestamp: new Date().toISOString(),
      page: 'app_start'
    });

    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider>
      <GlobalStyles />
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <ScrollToTop />
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/unblurry" element={<UnblurryCaseStudy />} />
              <Route path="/projects/collab-app" element={<CollabAppCaseStudy />} />
              <Route path="/blog" element={<Navigate to="/blog/how-i-think-when-building-products" replace />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
