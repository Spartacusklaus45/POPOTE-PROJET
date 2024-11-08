import create from 'zustand';
import { persist } from 'zustand/middleware';
import { MealPlan, MealType } from '../types/mealPlanning';
import { Recipe } from '../types';

interface Template {
  id: string;
  name: string;
  plans: MealPlan[];
  createdAt: string;
}

interface MealPlanningState {
  plans: MealPlan[];
  templates: Template[];
  currentWeek: Date;
  selectedDate: string | null;
  selectedMealType: MealType | null;
  
  // Actions
  addMealToPlan: (recipe: Recipe, date: string, mealType: MealType) => void;
  removeMealFromPlan: (date: string, mealType: MealType, recipeId: string) => void;
  setCurrentWeek: (date: Date) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedMealType: (type: MealType | null) => void;
  getMealPlan: (date: string) => MealPlan;
  calculateTotalPrice: () => number;
  clearWeek: (startDate: string) => void;
  duplicateWeek: (sourceStartDate: string, targetStartDate: string) => void;
  
  // Template actions
  saveTemplate: (name: string, plans: MealPlan[]) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  shareTemplate: (templateId: string) => string;
}

export const useMealPlanningStore = create<MealPlanningState>()(
  persist(
    (set, get) => ({
      plans: [],
      templates: [],
      currentWeek: new Date(),
      selectedDate: null,
      selectedMealType: null,

      addMealToPlan: (recipe, date, mealType) => {
        set(state => {
          const existingPlan = state.plans.find(p => p.date === date);
          if (existingPlan) {
            return {
              plans: state.plans.map(plan =>
                plan.date === date
                  ? {
                      ...plan,
                      meals: {
                        ...plan.meals,
                        [mealType]: [...(plan.meals[mealType] || []), recipe]
                      }
                    }
                  : plan
              )
            };
          }
          return {
            plans: [
              ...state.plans,
              {
                date,
                meals: {
                  [mealType]: [recipe]
                }
              }
            ]
          };
        });
      },

      removeMealFromPlan: (date, mealType, recipeId) => {
        set(state => ({
          plans: state.plans.map(plan =>
            plan.date === date
              ? {
                  ...plan,
                  meals: {
                    ...plan.meals,
                    [mealType]: plan.meals[mealType]?.filter(
                      meal => meal.id !== recipeId
                    ) || []
                  }
                }
              : plan
          )
        }));
      },

      setCurrentWeek: (date) => {
        set({ currentWeek: date });
      },

      setSelectedDate: (date) => {
        set({ selectedDate: date });
      },

      setSelectedMealType: (type) => {
        set({ selectedMealType: type });
      },

      getMealPlan: (date) => {
        const plan = get().plans.find(p => p.date === date);
        return (
          plan || {
            date,
            meals: {
              breakfast: [],
              lunch: [],
              dinner: []
            }
          }
        );
      },

      calculateTotalPrice: () => {
        const plans = get().plans;
        return plans.reduce((total, plan) => {
          const dayTotal = Object.values(plan.meals).reduce(
            (daySum, meals) =>
              daySum +
              meals.reduce((mealSum, meal) => mealSum + (meal.price || 0), 0),
            0
          );
          return total + dayTotal;
        }, 0);
      },

      clearWeek: (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        set(state => ({
          plans: state.plans.filter(plan => {
            const planDate = new Date(plan.date);
            return planDate < start || planDate >= end;
          })
        }));
      },

      duplicateWeek: (sourceStartDate, targetStartDate) => {
        const sourceStart = new Date(sourceStartDate);
        const targetStart = new Date(targetStartDate);
        const dayDiff = Math.floor(
          (targetStart.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24)
        );

        set(state => {
          const sourcePlans = state.plans.filter(plan => {
            const planDate = new Date(plan.date);
            const diff = Math.floor(
              (planDate.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diff >= 0 && diff < 7;
          });

          const duplicatedPlans = sourcePlans.map(plan => {
            const oldDate = new Date(plan.date);
            const newDate = new Date(oldDate);
            newDate.setDate(newDate.getDate() + dayDiff);
            return {
              ...plan,
              date: newDate.toISOString().split('T')[0]
            };
          });

          return {
            plans: [...state.plans, ...duplicatedPlans]
          };
        });
      },

      saveTemplate: (name, plans) => {
        const newTemplate: Template = {
          id: crypto.randomUUID(),
          name,
          plans,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          templates: [...state.templates, newTemplate]
        }));
      },

      loadTemplate: (templateId) => {
        const template = get().templates.find(t => t.id === templateId);
        if (template) {
          const currentDate = get().currentWeek;
          const adjustedPlans = template.plans.map(plan => ({
            ...plan,
            date: new Date(currentDate.setDate(
              currentDate.getDate() + new Date(plan.date).getDay()
            )).toISOString().split('T')[0]
          }));

          set({ plans: adjustedPlans });
        }
      },

      deleteTemplate: (templateId) => {
        set(state => ({
          templates: state.templates.filter(t => t.id !== templateId)
        }));
      },

      shareTemplate: (templateId) => {
        const template = get().templates.find(t => t.id === templateId);
        if (template) {
          return `${window.location.origin}/meal-planning/template/${templateId}`;
        }
        return '';
      }
    }),
    {
      name: 'meal-planning-storage'
    }
  )
);