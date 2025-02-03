import { configureStore } from '@reduxjs/toolkit';
import { recruitersApi } from './recruitersApi';
import { applicantsApi } from './applicantsApi';
import { jobsApi } from './jobsApi';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    [recruitersApi.reducerPath]: recruitersApi.reducer,
    [applicantsApi.reducerPath]: applicantsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(recruitersApi.middleware)
      .concat(applicantsApi.middleware)
      .concat(jobsApi.middleware),
});

export default store;
