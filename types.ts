
export type Language = 'ar' | 'en' | 'fr' | 'es';

export interface Idea {
  id: string;
  siteName: string;
  email: string;
  idea: string;
  status: 'Review' | 'Approved' | 'Rejected';
  evaluation: string;
  generatedCode: string;
  createdAt: string;
}

export interface TranslationSet {
  title: string;
  heading: string;
  labelSite: string;
  labelEmail: string;
  labelIdea: string;
  submitBtn: string;
  discussBtn: string;
  adminLink: string;
  homeLink: string;
  successMsg: string;
  loading: string;
  chatPlaceholder: string;
  codeHeading: string;
  evalHeading: string;
  tableSite: string;
  tableEmail: string;
  tableIdea: string;
  tableEval: string;
  tableStatus: string;
  tableDate: string;
}

export type Translations = Record<Language, TranslationSet>;
