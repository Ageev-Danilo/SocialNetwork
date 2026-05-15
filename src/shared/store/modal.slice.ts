import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isCreatePostOpen: boolean;
}

const initialState: ModalState = {
    isCreatePostOpen: false,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openCreatePost:  (state) => { state.isCreatePostOpen = true; },
        closeCreatePost: (state) => { state.isCreatePostOpen = false; },
    },
});

export const { openCreatePost, closeCreatePost } = modalSlice.actions;
export default modalSlice.reducer;