import { CartActionTypes, AddToCartAction, RemoveFromCartAction, UpdateQuantityAction, ClearCartAction } from './types';
import { Product } from '@/products/types';

export const addToCart = (product: Product): AddToCartAction => ({
  type: CartActionTypes.ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId: number): RemoveFromCartAction => ({
  type: CartActionTypes.REMOVE_FROM_CART,
  payload: productId,
});

export const updateQuantity = (
  productId: number,
  quantity: number
): UpdateQuantityAction => ({
  type: CartActionTypes.UPDATE_QUANTITY,
  payload: {
    productId,
    quantity,
  },
});

export const clearCart = (): ClearCartAction => ({
  type: CartActionTypes.CLEAR_CART,
});