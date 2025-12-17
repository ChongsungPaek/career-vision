
export enum RiasecType {
  REALISTIC = 'Realistic',
  INVESTIGATIVE = 'Investigative',
  ARTISTIC = 'Artistic',
  SOCIAL = 'Social',
  ENTERPRISING = 'Enterprising',
  CONVENTIONAL = 'Conventional'
}

export interface Question {
  id: number;
  text: string;
  type: RiasecType;
}

export interface RiasecScores {
  [RiasecType.REALISTIC]: number;
  [RiasecType.INVESTIGATIVE]: number;
  [RiasecType.ARTISTIC]: number;
  [RiasecType.SOCIAL]: number;
  [RiasecType.ENTERPRISING]: number;
  [RiasecType.CONVENTIONAL]: number;
}

export interface RecommendedJob {
  title: string;
  reason: string;
  dailyLife: string;
  skillsNeeded: string[];
}

export interface AnalysisResult {
  topType: RiasecType;
  topTwoCode: string;
  summary: string;
  recommendations: RecommendedJob[];
  careerAdvice: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface StorageRecord extends UserProfile {
  id: string;
  date: string;
  riasecCode: string;
  scores: RiasecScores;
}
