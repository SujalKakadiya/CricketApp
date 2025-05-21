import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeReducer, { ThemeState } from './themeSlice';
import languageReducer, { LanguageState } from './languageSlice';
import authReducer, { AuthState }  from './auth'
import { TypedUseSelectorHook, useDispatch ,  useSelector as useReduxSelector,} from 'react-redux';
import { cartReducer, CartState } from '@/products/cart';

interface RootReducerState {
  theme: ThemeState;
  language:LanguageState;
  auth: AuthState;
  cart: CartState
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme','auth','language', 'cart'], // Add other reducers to persist here
};

const rootReducer = combineReducers({
  theme: themeReducer,
  language: languageReducer,
  auth: authReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

// Add a function to clear the persisted state during development
// if (process.env.NODE_ENV === 'development') {
//   persistor.purge().then(() => console.log('Persisted state cleared during development.'));
// }

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
