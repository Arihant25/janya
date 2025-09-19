'use client';

import type { ReactNode } from 'react';

interface Mood {
  emoji: string;
  label: string;
  color: string;
}

const moods: Mood[] = [
  { emoji: '😊', label: 'Happy', color: 'var(--md-sys-color-primary)' },
  { emoji: '😌', label: 'Calm', color: 'var(--md-sys-color-secondary)' },
  { emoji: '😔', label: 'Sad', color: 'var(--md-sys-color-tertiary)' },
  { emoji: '😡', label: 'Angry', color: '#EF4444' },
  { emoji: '😰', label: 'Anxious', color: '#F59E0B' },
  { emoji: '😴', label: 'Tired', color: '#6B7280' },
  { emoji: '🤔', label: 'Contemplative', color: '#8B5CF6' },
  { emoji: '🌟', label: 'Inspired', color: '#10B981' }
];

interface MoodSelectorProps {
  selectedMood?: string;
  onMoodSelect: (mood: string) => void;
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="mood-selector">
      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => onMoodSelect(mood.label)}
            className={`mood-button ${selectedMood === mood.label ? 'selected' : ''}`}
            style={{ '--mood-color': mood.color } as { [key: string]: string }}
            aria-label={`Select mood: ${mood.label}`}
            title={mood.label}
          >
            <span className="mood-emoji" role="img" aria-label={mood.label}>
              {mood.emoji}
            </span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}