import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Table {
    tableId: string;
    tableNumber: number;
    tableGroup: string;  // This will store the `groupId` from the table group
}

interface TableState extends Array<Table> { }

const initialState: TableState = [
{ tableId: '100', tableNumber: 100, tableGroup: 'Main Floor' },
{ tableId: '101', tableNumber: 101, tableGroup: 'Main Floor' },
{ tableId: '102', tableNumber: 102, tableGroup: 'Main Floor' },
{ tableId: '103', tableNumber: 103, tableGroup: 'Main Floor' },
{ tableId: '104', tableNumber: 104, tableGroup: 'Main Floor' },
{ tableId: '105', tableNumber: 105, tableGroup: 'Main Floor' },
{ tableId: '106', tableNumber: 106, tableGroup: 'Main Floor' },
{ tableId: '107', tableNumber: 107, tableGroup: 'Main Floor' },
];

const tableSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        addTable: (
            state,
            action: PayloadAction<{ tableNumber: number; tableGroup: string }>
        ) => {
            const newTable = {
                tableId: uuidv4(),  // Generate a unique ID for each table
                tableNumber: action.payload.tableNumber,
                tableGroup: action.payload.tableGroup,  // Referencing the groupId
            };
            state.push(newTable);
        },
        editTable: (
            state,
            action: PayloadAction<{
                tableId: string;
                tableNumber: number;
                tableGroup: string;
            }>
        ) => {
            const tableIndex = state.findIndex(table => table.tableId === action.payload.tableId);
            if (tableIndex !== -1) {
                state[tableIndex].tableNumber = action.payload.tableNumber;
                state[tableIndex].tableGroup = action.payload.tableGroup;
            }
        },
        deleteTable: (state, action: PayloadAction<{ tableId: string }>) => {
            return state.filter(table => table.tableId !== action.payload.tableId);
        },
    },
});

export const { addTable, editTable, deleteTable } = tableSlice.actions;
export default tableSlice.reducer;
