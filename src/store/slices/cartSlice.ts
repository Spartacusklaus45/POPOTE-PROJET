import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types';

interface CartItem {
  recipe: Recipe;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Recipe>) => {
      const existingItem = state.items.find(
        item => item.recipe.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ recipe: action.payload, quantity: 1 });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.recipe.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.recipe.id !== action.payload
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.recipe.price * item.quantity,
        0
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ recipeId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        item => item.recipe.id === action.payload.recipeId
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        state.total = state.items.reduce(
          (sum, item) => sum + item.recipe.price * item.quantity,
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;