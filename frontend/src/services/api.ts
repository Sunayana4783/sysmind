import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Auth types ────────────────────────────────────────────────────────────────
export interface SignupData { username: string; email: string; password: string; }
export interface LoginData  { email: string; password: string; }
export interface AuthUser   { _id: string; username: string; email: string; createdAt: string; }

export const authAPI = {
  signup:       (data: SignupData) => api.post<{ message: string; email: string }>('/auth/signup', data),
  verifyOTP:    (email: string, otp: string) => api.post<{ message: string }>('/auth/verify-otp', { email, otp }),
  resendOTP:    (email: string) => api.post<{ message: string }>('/auth/resend-otp', { email }),
  login:        (data: LoginData) => api.post<{ message: string; token: string; user: AuthUser }>('/auth/login', data),
  getMe:        () => api.get<{ user: AuthUser }>('/auth/me'),
};

// ── Learning types ────────────────────────────────────────────────────────────
export interface AnimationStep { label: string; description: string; highlight: boolean; }

export interface ContentSection {
  heading: string; body: string; code?: string | null; icon?: string;
}

export interface ModuleContent {
  overview: string;
  sections: ContentSection[];
  keyPoints: string[];
  animationSteps: AnimationStep[];
  example: string;
}

export interface FailureCase {
  title: string; icon: string; scenario: string;
  impact: string; resolution: string;
  animationSteps: AnimationStep[];
}

export interface InterviewQuestion {
  question: string; answer: string; icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  question: string; options: string[]; scenario: boolean;
}

export interface QuizConfig {
  timeLimitSeconds: number; maxAttempts: number;
  passingPercent: number; questionCount?: number;
}

export interface LearningModule {
  _id: string;
  topicSlug: string;
  order: number;
  type: 'content' | 'failureCases' | 'interview' | 'quiz';
  title: string;
  content?: ModuleContent;
  failureCases?: FailureCase[];
  interviewQuestions?: InterviewQuestion[];
  quizConfig?: QuizConfig;
}

export interface QuizData {
  moduleId: string; title: string; topicSlug: string;
  timeLimitSeconds: number; maxAttempts: number; passingPercent: number;
  attemptsTaken: number; attemptsRemaining: number; alreadyPassed: boolean;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number; passed: boolean; correct: number; total: number;
  passingPercent: number; attemptsRemaining: number; flagged: boolean;
  results: {
    question: string; options: string[]; selected: number;
    correctIndex: number; explanation: string; isCorrect: boolean;
  }[];
}

export const learningAPI = {
  getModules:       (slug: string) => api.get<{ modules: LearningModule[] }>(`/learning/topics/${slug}/modules`),
  getProgress:      (slug: string) => api.get<{ completedModuleIds: string[] }>(`/learning/topics/${slug}/progress`),
  markComplete:     (moduleId: string, topicSlug: string) =>
                      api.post<{ message: string }>('/learning/progress/complete', { moduleId, topicSlug }),
};

export const quizAPI = {
  getQuiz:          (moduleId: string) => api.get<QuizData>(`/quiz/${moduleId}`),
  submitAttempt:    (moduleId: string, payload: {
                      answers: number[]; timeTaken: number;
                      flagged: boolean; flagCount: number;
                    }) => api.post<QuizResult>(`/quiz/${moduleId}/attempt`, payload),
};

export const activityAPI = {
  log:              () => api.post<{ message: string }>('/activity/log'),
  getStreak:        () => api.get<{
                      activityMap: Record<string, number>;
                      total: number; currentStreak: number;
                      longestStreak: number; today: string;
                    }>('/activity/streak'),
};

export default api;
