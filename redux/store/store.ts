// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import someReducer from '../slice/someSlice';
import ordersReducer from '../slice/orderSlice';
import tableGroupReducer from '../slice/table/tableGroupSlice';
import tableReducer from '../slice/table/tableSlice';

export const store = configureStore({
  reducer: {
    some: someReducer,
      orders: ordersReducer,
      tables: tableReducer,  // Add the tableSlice
      tableGroups: tableGroupReducer,  // Add the tableGroupSlice

  },
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;