import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Recipe } from '../../types';

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null
};

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async () => {
    const response = await api.get('/recipes');
    return response.data;
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur de chargement des recettes';
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur de chargement de la recette';
      });
  }
});

export const { clearSelectedRecipe, clearError } = recipeSlice.actions;
export default recipeSlice.reducer;