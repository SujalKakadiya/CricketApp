import { Product } from '@/products/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export enum CartActionTypes {
  ADD_TO_CART = 'cart/ADD_TO_CART',
  REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART',
  UPDATE_QUANTITY = 'cart/UPDATE_QUANTITY',
  CLEAR_CART = 'cart/CLEAR_CART',
}

export interface AddToCartAction {
  type: CartActionTypes.ADD_TO_CART;
  payload: Product;
}

export interface RemoveFromCartAction {
  type: CartActionTypes.REMOVE_FROM_CART;
  payload: number; // product id
}

export interface UpdateQuantityAction {
  type: CartActionTypes.UPDATE_QUANTITY;
  payload: {
    productId: number;
    quantity: number;
  };
}

export interface ClearCartAction {
  type: CartActionTypes.CLEAR_CART;
}

export type CartActions =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateQuantityAction
  | ClearCartAction;