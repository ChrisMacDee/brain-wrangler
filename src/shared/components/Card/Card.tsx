/**
 * Card Component
 * Container component with consistent styling
 */

import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, className = '', padding = 'medium' }: CardProps) {
  const classes = ['card', `card-padding-${padding}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
