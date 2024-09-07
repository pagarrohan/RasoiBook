import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface TableGroup {
  groupId: string;
  groupName: string;
}

interface TableGroupState extends Array<TableGroup> {}

const initialState: TableGroupState = [];

const tableGroupSlice = createSlice({
  name: 'tableGroups',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<{ groupName: string }>) => {
      const newGroup = {
        groupId: uuidv4(),  // Generate a unique ID for each group
        groupName: action.payload.groupName,
      };
      state.push(newGroup);
    },
    editGroup: (state, action: PayloadAction<{ groupId: string; groupName: string }>) => {
      const groupIndex = state.findIndex(group => group.groupId === action.payload.groupId);
      if (groupIndex !== -1) {
        state[groupIndex].groupName = action.payload.groupName;
      }
    },
    deleteGroup: (state, action: PayloadAction<{ groupId: string }>) => {
      return state.filter(group => group.groupId !== action.payload.groupId);
    },
  },
});

export const { addGroup, editGroup, deleteGroup } = tableGroupSlice.actions;
export default tableGroupSlice.reducer;
