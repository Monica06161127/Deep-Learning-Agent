export interface LogicPoint {
  argument: string;
  evidence: string;
}

export interface HeuristicQuestion {
  question: string;
  context: string;
}

export interface FeynmanQuizItem {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  logicMap: LogicPoint[];
  heuristicQuestions: HeuristicQuestion[];
  feynmanQuiz: FeynmanQuizItem[];
}
