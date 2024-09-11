import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Category {
    categoryId: number;
    categoryName: string;
    isEnabled: boolean;
}

interface CategoryState extends Array<Category> { }

const initialState: CategoryState = [];

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (
            state,
            action: PayloadAction<{ categoryName: string; isEnabled: boolean; categoryId: number }>
        ) => {
            const duplicateCategory = state.find(
                (category) => category.categoryName.toLowerCase() === action.payload.categoryName.toLowerCase()
            );

            if (!duplicateCategory) {
                const newCategory = {
                    categoryId: action.payload.categoryId,
                    categoryName: action.payload.categoryName,
                    isEnabled: action.payload.isEnabled,
                };
                state.push(newCategory);
            } else {
                throw new Error('Category name already exists.');
            }
        },
        editCategory: (
            state,
            action: PayloadAction<{ categoryId: number; categoryName: string; isEnabled: boolean }>
        ) => {
            const categoryIndex = state.findIndex(category => category.categoryId === action.payload.categoryId);
            if (categoryIndex !== -1) {
                state[categoryIndex].categoryName = action.payload.categoryName;
                state[categoryIndex].isEnabled = action.payload.isEnabled;
            }
        },
        deleteCategory: (state, action: PayloadAction<{ categoryId: number }>) => {
            return state.filter(category => category.categoryId !== action.payload.categoryId);
        },
    },
});

export const { addCategory, editCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;