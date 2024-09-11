import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Table {
    tableId: number;
    tableName: string;
    tableGroup: string;  // This will store the `groupId` from the table group
}

interface TableState extends Array<Table> { }

const initialState: TableState = [
    { tableId: 100, tableName: '100', tableGroup: 'Main Floor' },
    { tableId: 101, tableName: '101', tableGroup: 'Main Floor' }
];

const tableSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        addTable: (
            state,
            action: PayloadAction<{ tableName: string; tableGroup: string,tableId:number }>
        ) => {
            const newTable = {
                tableId:action.payload.tableId,  // Generate a unique ID for each table
                tableName: action.payload.tableName,
                tableGroup: action.payload.tableGroup,  // Referencing the groupId
            };
            state.push(newTable);
        },
        editTable: (
            state,
            action: PayloadAction<{
                tableId: number;
                tableName: string;
                tableGroup: string;
            }>
        ) => {
            const tableIndex = state.findIndex(table => table.tableId === action.payload.tableId);
            if (tableIndex !== -1) {
                state[tableIndex].tableName = action.payload.tableName;
                state[tableIndex].tableGroup = action.payload.tableGroup;
            }
        },
        deleteTable: (state, action: PayloadAction<{ tableId: number }>) => {
            return state.filter(table => table.tableId !== action.payload.tableId);
        },
    },
});

export const { addTable, editTable, deleteTable } = tableSlice.actions;
export default tableSlice.reducer;
