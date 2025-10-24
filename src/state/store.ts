import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import hierarchyReducer from './hierarchySlice';

// Configure redux-logger
const logger = createLogger({
  collapsed: false,
  duration: true,
  timestamp: true,
  diff: true,
});

export const store = configureStore({
  reducer: {
    hierarchy: hierarchyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For Date objects
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
