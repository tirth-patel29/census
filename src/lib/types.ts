export type HouseStatus = 'pending' | 'draft' | 'completed';
export type AnswerType = 'text' | 'number' | 'radio' | 'select';

export interface House {
  id: string;
  house_no: number;
  owner_name: string;
  area: string;
  status: HouseStatus;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_no: number;
  question_text_gujarati: string;
  answer_type: AnswerType;
  default_value: string | null;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_label: string;
  sort_order: number;
}

export interface HouseAnswer {
  id: string;
  house_id: string;
  question_id: string;
  answer: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  draft: number;
  pending: number;
  completion_percent: number;
}

export interface OfflineQueueItem {
  house_id: string;
  question_id: string;
  answer: string;
  timestamp: number;
}

