export interface Message {
  id: string;
  question: string;
  answer: string;
  references: Reference[];
  timestamp: Date;
  rating?: "helpful" | "not-helpful" | null;
}

export interface Reference {
  documentId: string;
  documentName: string;
  excerpt: string;
  page?: number;
  confidence?: number;
}

