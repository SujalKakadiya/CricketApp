import { CartState, CartActions, CartActionTypes } from './types';

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  return { totalItems, totalAmount };
};

export default function cartReducer(
  state = initialState,
  action: CartActions
): CartState {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART: {
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // If product exists, increase quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product doesn't exist, add it with quantity 1
        updatedItems = [
          ...state.items,
          { product: action.payload, quantity: 1 },
        ];
      }

      const { totalItems, totalAmount } = calculateCartTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CartActionTypes.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );

      const { totalItems, totalAmount } = calculateCartTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CartActionTypes.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;

      // If quantity is zero or negative, remove the item
      if (quantity <= 0) {
        const updatedItems = state.items.filter(
          (item) => item.product.id !== productId
        );
        const { totalItems, totalAmount } = calculateCartTotals(updatedItems);

        return {
          ...state,
          items: updatedItems,
          totalItems,
          totalAmount,
        };
      }

      // Otherwise update the quantity
      const updatedItems = state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const { totalItems, totalAmount } = calculateCartTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CartActionTypes.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
}