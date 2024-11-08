import { Recipe } from './index';

export interface MealPlan {
  date: string;
  meals: {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
  };
}

export interface MealPlanningState {
  plans: MealPlan[];
  currentWeek: Date;
  selectedDate: string | null;
  selectedMealType: 'breakfast' | 'lunch' | 'dinner' | null;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';