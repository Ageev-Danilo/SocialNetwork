import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/base';
import { tokenSlice } from './token.slice';
import { modalSlice } from './modal.slice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        token: tokenSlice.reducer,
        modal: modalSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;