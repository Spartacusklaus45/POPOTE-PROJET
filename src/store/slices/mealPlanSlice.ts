import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mealPlanService } from '../../services/mealPlanService';
import { MealPlan } from '../../types';

interface MealPlanState {
  mealPlans: MealPlan[];
  selectedMealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MealPlanState = {
  mealPlans: [],
  selectedMealPlan: null,
  isLoading: false,
  error: null
};

export const createMealPlan = createAsyncThunk(
  'mealPlans/create',
  async (mealPlanData: Partial<MealPlan>) => {
    const response = await mealPlanService.createMealPlan(mealPlanData);
    return response;
  }
);

export const fetchMealPlans = createAsyncThunk(
  'mealPlans/fetchAll',
  async () => {
    const response = await mealPlanService.getMealPlans();
    return response;
  }
);

export const fetchMealPlanById = createAsyncThunk(
  'mealPlans/fetchById',
  async (id: string) => {
    const response = await mealPlanService.getMealPlanById(id);
    return response;
  }
);

export const updateMealPlan = createAsyncThunk(
  'mealPlans/update',
  async ({ id, data }: { id: string; data: Partial<MealPlan> }) => {
    const response = await mealPlanService.updateMealPlan(id, data);
    return response;
  }
);

export const deleteMealPlan = createAsyncThunk(
  'mealPlans/delete',
  async (id: string) => {
    await mealPlanService.deleteMealPlan(id);
    return id;
  }
);

const mealPlanSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {
    clearSelectedMealPlan: (state) => {
      state.selectedMealPlan = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans.push(action.payload);
      })
      .addCase(createMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la création du plan de repas';
      })
      .addCase(fetchMealPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMealPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = action.payload;
      })
      .addCase(fetchMealPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement des plans de repas';
      })
      .addCase(fetchMealPlanById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMealPlanById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMealPlan = action.payload;
      })
      .addCase(fetchMealPlanById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement du plan de repas';
      })
      .addCase(updateMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.mealPlans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.mealPlans[index] = action.payload;
        }
      })
      .addCase(updateMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la mise à jour du plan de repas';
      })
      .addCase(deleteMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = state.mealPlans.filter(plan => plan.id !== action.payload);
      })
      .addCase(deleteMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la suppression du plan de repas';
      });
  }
});

export const { clearSelectedMealPlan, clearError } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;