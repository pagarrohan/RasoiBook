import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  contact: string;
}

interface Order {
  orderId: string;
  tableNumber: number;
  waiterName: string;
  date: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status:string
}

interface OrdersState extends Array<Order> {}

const initialState: OrdersState = [];

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    saveOrder(state, action: PayloadAction<Order>) {
      const existingOrderIndex = state.findIndex(
        (order) => order.tableNumber === action.payload.tableNumber
      );

      if (existingOrderIndex > -1) {
        // Order exists, merge items
        const existingOrder = state[existingOrderIndex];

        // Create a map to combine items by id
        const updatedItems = [...existingOrder.items];
        action.payload.items.forEach((newItem) => {
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.id === newItem.id
          );
          if (existingItemIndex > -1) {
            // If item exists, increase the quantity
            updatedItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            // If item does not exist, add the new item
            updatedItems.push(newItem);
          }
        });

        // Update the total and items in the existing order
        const updatedTotal = updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        state[existingOrderIndex] = {
          ...existingOrder,
          items: updatedItems,
          total: updatedTotal,
        };
      } else {
        // No order exists, add the new order
        state.push(action.payload);
      }
    },
  },
});

export const { saveOrder } = ordersSlice.actions;
export default ordersSlice.reducer;