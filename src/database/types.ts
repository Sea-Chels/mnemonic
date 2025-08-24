export interface Deck {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  difficulty: number;
  interval: number;
  repetitions: number;
  ease_factor: number;
  next_review_date: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: number;
  deck_id: number;
  cards_studied: number;
  cards_correct: number;
  study_duration: number;
  created_at: string;
}