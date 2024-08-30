//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

const categories = ['Salads', 'Sandwiches', 'Main', 'Appetizers', 'Sweets', 'Drinks'];
const items = {
  Salads: [
    { id: '1', name: 'Endive & Orange', price: '$13.00' },
    { id: '2', name: 'Caesar Salad', price: '$15.00' },
    // Add more items
  ],
  Sandwiches: [
    { id: '127', name: 'Club Sandwich', price: '$10.00' },
    { id: '128', name: 'Ham Sandwich', price: '$8.00' },
    // Add more items
  ],
  // Add more categories and items
};

const OrderPage = () => {
  const route = useRoute();
  const { tableNumber } = route.params || {}; // Get table number from route params
  const [selectedCategory, setSelectedCategory] = useState('Salads');
  const [order, setOrder] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Use tableNumber if needed (e.g., pre-fill table number in order summary)
  }, [tableNumber]);

  const addItemToOrder = (item) => {
    const existingItemIndex = order.findIndex(orderItem => orderItem.id === item.id);
    if (existingItemIndex > -1) {
      // Item already in the order, increase count
      const updatedOrder = [...order];
      updatedOrder[existingItemIndex].quantity += 1;
      setOrder(updatedOrder);
      updateSubtotal(updatedOrder);
    } else {
      // Item not in the order, add it with quantity 1
      setOrder([...order, { ...item, quantity: 1 }]);
      setSubtotal(subtotal + parseFloat(item.price.replace('$', '')));
    }
  };

  const updateSubtotal = (updatedOrder) => {
    const newSubtotal = updatedOrder.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    setSubtotal(newSubtotal);
  };

  const removeItemFromOrder = (index) => {
    const newOrder = order.filter((_, i) => i !== index);
    updateSubtotal(newOrder);
    setOrder(newOrder);
  };

  const increaseQuantity = (index) => {
    const updatedOrder = [...order];
    updatedOrder[index].quantity += 1;
    setOrder(updatedOrder);
    updateSubtotal(updatedOrder);
  };

  const decreaseQuantity = (index) => {
    const updatedOrder = [...order];
    if (updatedOrder[index].quantity > 1) {
      updatedOrder[index].quantity -= 1;
      setOrder(updatedOrder);
      updateSubtotal(updatedOrder);
    } else {
      removeItemFromOrder(index);
    }
  };

  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryTab,
        selectedCategory === item && styles.selectedCategoryTab,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderItemCard = ({ item }) => (
    <TouchableOpacity onPress={() => addItemToOrder(item)} style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item, index }) => (
    <View key={index} style={styles.orderItem}>
      <Text style={styles.orderItemText}>{item.name}</Text>
      <Text style={styles.orderItemText}>{item.price}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     

      {/* Item Selection */}
      <View style={styles.itemSelection}>
        {/* Category Tabs */}
        <FlatList
          data={categories}
          horizontal
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item}
          style={styles.categoryList}
          showsHorizontalScrollIndicator={false}
        />
        {/* Item Grid */}
        <FlatList
          data={items[selectedCategory]}
          renderItem={renderItemCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.itemRow}
          style={styles.itemGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
       {/* Order Summary */}
       <View style={styles.orderSummary}>
      <Text style={styles.header}>Ordering </Text>
        <FlatList
          data={order}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.noRecords}>No Records</Text>}
        />
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryText}>Quantity: {order.reduce((total, item) => total + item.quantity, 0)}</Text>
          <Text style={styles.summaryText}>Subtotal: ${subtotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
  },
  orderSummary: {
    flex: 2,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f5a623',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  orderItemText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    alignItems:'center',
    padding: 5,
    width:30,
    backgroundColor: '#f5a623',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    color: '#fff',
  },
  noRecords: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  summaryFooter: {
    marginTop: 20,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 5,
  },
  sendButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemSelection: {
    flex: 2,
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
  },
  categoryList: {
    zIndex: 1000,
    marginBottom: 10,
  },
  categoryTab: {
    padding: 10,
    width: 100,
    height: 50,
    backgroundColor: 'green',
    marginRight: 5,
    borderRadius: 5,
  },
  selectedCategoryTab: {
    borderColor: 'yellow',
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  itemGrid: {
    marginTop: 10,
  },

  itemRow: {
    justifyContent: 'space-between',
  },
  itemCard: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    margin:1.5
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default OrderPage;
