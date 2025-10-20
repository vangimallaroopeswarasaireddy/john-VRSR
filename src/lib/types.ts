export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plan?: {
    plan: string;
    results: Record<string, string>;
  };
  portfolioLayout?: string;
  tutoringContent?: {
    explanation: string;
    adaptiveLearningPath: string;
  };
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type ViewType = 'chat' | 'tasks' | 'tutor' | 'portfolio';
