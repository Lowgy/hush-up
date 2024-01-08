import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Challenge } from '../types/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
