export type MoodType = 'happy' | 'sad' | 'anxious' | 'excited' | 'calm' | 'thoughtful' | 'inspired';

export type ThemeType = 'sunny' | 'contemplative' | 'stress' | 'adventure' | 'peaceful' | 'creative';

export interface Journal {
  id: number;
  title: string;
  date: string;
  time: string;
  mood: MoodType;
  preview: string;
  wordCount: number;
  abstractArt: string;
  theme: ThemeType;
}

export type Mood = 'happy' | 'sad' | 'anxious' | 'excited' | 'calm' | 'thoughtful' | 'inspired';

export const COLORS = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',
    600: '#7c3aed',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    500: '#d946ef',
    600: '#c026d3',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  }
};

export const MOOD_GRADIENTS = {
  happy: 'linear-gradient(135deg, #FFD93D 0%, #FF8E53 100%)',
  sad: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
  anxious: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  excited: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  calm: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  thoughtful: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  inspired: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  excited: '🎉',
  calm: '😌',
  thoughtful: '🤔',
  inspired: '✨'
};

export const THEME_COLORS = {
  primary: {
    main: '#7C3AED', // Purple
    light: '#DDD6FE',
    dark: '#5B21B6'
  },
  secondary: {
    main: '#EC4899', // Pink
    light: '#FCE7F3',
    dark: '#BE185D'
  },
  background: {
    main: '#F3F4F6',
    paper: '#FFFFFF',
    gradient: 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  },
  border: {
    light: '#E5E7EB',
    main: '#D1D5DB'
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
};

export const SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

export const TRANSITIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

export const BORDER_RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px'
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
};