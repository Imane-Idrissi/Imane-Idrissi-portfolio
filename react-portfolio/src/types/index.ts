export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  caseStudyUrl?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  benefits: string[];
  caseStudyUrl: string;
}