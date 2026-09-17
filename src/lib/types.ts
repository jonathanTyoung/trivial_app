export type Category = 'food' | 'plans' | 'work' | 'build' | 'anything';

export const CATEGORIES: Category[] = ['food', 'plans', 'work', 'build', 'anything'];

export type Decision = {
  id: string;
  pick: string;
  category: Category;
  options: string[];
  timeToDecide: number; // seconds
  rerolled: boolean;
  timestamp: number;
};
