import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import summaryReducer from './slices/summarySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    summary: summaryReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['summary/setAudioBlob'],
        ignoredPaths: ['summary.audioBlob'],
      },
    }),
});
