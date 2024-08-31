import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Add this import for icons
import { categories, items, previouslyOrderedItems } from '../db';

const OrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to the first category
  const [order, setOrder] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [activeTab, setActiveTab] = useState('Ordering');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredItems, setFilteredItems] = useState(items[selectedCategory]); // State for filtered items
  const [searchBy, setSearchBy] = useState('name'); // State to toggle between search by name or code
  const [selectedOrderedItem, setSelectedOrderedItem] = useState(null); // State for selected ordered item
  const [selectedOrderingItem, setSelectedOrderingItem] = useState(null); // State for selected ordering item

  useEffect(() => {
    filterItems(searchQuery); // Filter items based on the search query
  }, [searchQuery, selectedCategory, searchBy]);

  const addItemToOrder = (item) => {
    const existingItemIndex = order.findIndex(orderItem => orderItem.id === item.id);
    if (existingItemIndex > -1) {
      const updatedOrder = [...order];
      updatedOrder[existingItemIndex].quantity += 1;
      setOrder(updatedOrder);
      updateSubtotal(updatedOrder);
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
      setSubtotal(subtotal + parseFloat(item.price.replace('₹', '')));
    }
  };

  const updateSubtotal = (updatedOrder) => {
    const newSubtotal = updatedOrder.reduce((total, item) => total + (parseFloat(item.price.replace('₹', '')) * item.quantity), 0);
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

  const filterItems = (query) => {
    if (query.trim() === '') {
      setFilteredItems(items[selectedCategory]); // Show all items if search query is empty
    } else {
      const filtered = items[selectedCategory].filter(item => {
        if (searchBy === 'name') {
          return item.name.toLowerCase().includes(query.toLowerCase());
        } else if (searchBy === 'code') {
          return item.id.toLowerCase().includes(query.toLowerCase());
        }
      });
      setFilteredItems(filtered);
    }
  };

  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item);
        setSearchQuery(''); // Clear the search query when changing categories
      }}
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
    <TouchableOpacity
      key={index}
      style={styles.orderItem}
      onPress={() => {
        if (activeTab === 'Ordering') {
          setSelectedOrderingItem(item);
          setSelectedOrderedItem(null);
        } else {
          setSelectedOrderedItem(item);
          setSelectedOrderingItem(null);
        }
      }} // Set selected item based on active tab
    >
      <Text style={styles.orderItemText}>{item.name}</Text>
      <Text style={styles.orderItemText}>{item.price}</Text>
      <Text style={styles.orderItemText}>Qty: {item.quantity}</Text>
    </TouchableOpacity>
  );

  const renderSummaryFooter = () => (
    <View style={styles.summaryFooter}>
      <Text style={styles.summaryText}>Table:</Text>
      <Text style={styles.summaryText}>Quantity: {order.reduce((total, item) => total + item.quantity, 0)}</Text>
      <Text style={styles.summaryText}>Subtotal: ₹{subtotal.toFixed(2)}</Text>
      {activeTab === 'Ordering' && <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.sendButtonText}>KOT</Text>
      </TouchableOpacity>}
    </View>

  );

  const renderOrderingActionButtons = () => (
    <View style={styles.actionButtonContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FF7043' }]}
        onPress={() => {
          // Implement Clear functionality
          const index = order.findIndex(orderItem => orderItem.id === selectedOrderingItem.id);
          if (index > -1) {
            removeItemFromOrder(index);
            setSelectedOrderingItem(null);
          }
        }}
      >
        <Text style={styles.actionButtonText}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FFEB3B' }]}
        onPress={() => {
          // Implement Quantity functionality
          // You can add a modal or prompt to change the quantity
          alert(`Set Quantity for ${selectedOrderingItem.name}`);
        }}
      >
        <Text style={styles.actionButtonText}>Quantity</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#8BC34A' }]}
        onPress={() => {
          // Implement Kitchen Note functionality
          // You can add a modal or prompt to add a kitchen note
          alert(`Add Kitchen Note for ${selectedOrderingItem.name}`);
        }}
      >
        <Text style={styles.actionButtonText}>Kitchen Note</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemActionButtons = () => (
    <View style={styles.actionButtonContainerOrderd}>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#FFEB3B' }]}>
        <Text style={styles.actionButtonTextOrderd}>Void</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#FFA726' }]}>
        <Text style={styles.actionButtonTextOrderd}>One More</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#8BC34A' }]}>
        <Text style={styles.actionButtonTextOrderd}>Mark</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#7E57C2' }]}>
        <Text style={styles.actionButtonTextOrderd}>Transfer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.actionButtonTextOrderd}>Discount</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButtonOrderd, { backgroundColor: '#FF7043' }]}>
        <Text style={styles.actionButtonTextOrderd}>Price</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.itemSelection}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder={`Search items by ${searchBy}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.searchToggleButton, searchBy === 'name' && styles.activeToggleButton]}
            onPress={() => setSearchBy('name')}
          >
            <Text style={styles.searchToggleButtonText}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.searchToggleButton, searchBy === 'code' && styles.activeToggleButton]}
            onPress={() => setSearchBy('code')}
          >
            <Text style={styles.searchToggleButtonText}>Code</Text>
          </TouchableOpacity>
        </View>

        {/* Filtered Items */}
        <FlatList
          data={filteredItems}
          renderItem={renderItemCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.itemRow}
          style={styles.itemGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.orderSummary}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab('Ordering');
              setSelectedOrderingItem(null); // Reset selected item when switching tabs
            }}
            style={[styles.tab, activeTab === 'Ordering' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Ordering' && styles.activeTabText]}>Ordering</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab('Ordered');
              setSelectedOrderedItem(null); // Reset selected item when switching tabs
            }}
            style={[styles.tab, activeTab === 'Ordered' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Ordered' && styles.activeTabText]}>Ordered</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'Ordering' ? (
          <>
            <FlatList
              data={order}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<Text style={styles.noRecords}>No Records</Text>}
            />
            {selectedOrderingItem ? renderOrderingActionButtons() : renderSummaryFooter()}
          </>
        ) : (
          <>
            <FlatList
              data={previouslyOrderedItems}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.noRecords}>No Records</Text>}
            />
            {selectedOrderedItem ? renderItemActionButtons() : renderSummaryFooter()}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  orderSummary: {
    flex: 2,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryContainer: {
    width: 100, // Adjust width as needed
    marginHorizontal: 5,
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
    paddingVertical: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  orderItemText: {
    color: '#fff',
    fontSize: 13,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    alignItems: 'center',
    padding: 4,
    width: 25,
    backgroundColor: '#f5a623',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  quantityText: {
    fontSize: 12,
    color: '#fff',
  },
  noRecords: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  summaryFooter: {
    marginTop: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 3,
  },
  sendButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemSelection: {
    flex: 4,
    backgroundColor: '#f7f7f7',
    padding: 5,
    borderRadius: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
  },
  searchToggleButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#f5a623',
  },
  activeToggleButton: {
    backgroundColor: '#ffcc00',
  },
  searchToggleButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryTab: {
    padding: 10,
    backgroundColor: 'green',
    marginBottom: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryTab: {
    borderColor: 'gray',
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#fff',
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
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    margin: 1.5,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#f5a623',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexBasis: '45%', // Adjust to fit 2x2 layout
    padding: 5,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtonContainerOrderd: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    // justifyContent: 'space-between',
  },
  actionButtonOrderd: {
    flexBasis: '45%',
    padding: 5,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonTextOrderd: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default OrderPage;