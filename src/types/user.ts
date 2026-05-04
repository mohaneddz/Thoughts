export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface SavedThought {
  id: string;
  userId: string;
  title: string;
  content: string;
  sourceType: 'result' | 'ai' | 'note' | 'check-in';
  sourceId?: string;
  tags: string[];
  createdAt: string;
}

