
import { Idea } from '../types';

const STORAGE_KEY = 'smartsite_ideas';

export const saveIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>): Idea => {
  const ideas = getIdeas();
  const newIdea: Idea = {
    ...idea,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Review',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newIdea, ...ideas]));
  return newIdea;
};

export const getIdeas = (): Idea[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateIdeaStatus = (id: string, status: Idea['status']): void => {
  const ideas = getIdeas();
  const updated = ideas.map(idea => idea.id === id ? { ...idea, status } : idea);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
