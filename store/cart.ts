import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<{ product: CartItem }>) => {
      const { product } = action.payload;
      const existingProduct = state.items.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addProductToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
