import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Add this import for icons
import { categories, items } from '../../../components/db';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import { saveOrder } from '@/redux/slice/orderSlice';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { useIsFocused, useRoute } from '@react-navigation/native';
import SamplePrint from '../../../components/bluetooth/SamplePrint';
import { useKOTPrinter } from '@/components/thermalPrint/kotPrint';
import OrientationLocker from 'react-native-orientation-locker';

const OrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to the first category
  const [order, setOrder] = useState<any>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [activeTab, setActiveTab] = useState('Ordering');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredItems, setFilteredItems] = useState(items[selectedCategory]); // State for filtered items
  const [searchBy, setSearchBy] = useState('name'); // State to toggle between search by name or code
  const [selectedOrderedItem, setSelectedOrderedItem] = useState(null); // State for selected ordered item
  const [selectedOrderingItem, setSelectedOrderingItem] = useState(null); // State for selected ordering item

  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const orders = useSelector((state: RootState) => state.orders);
  const { printKOT } = useKOTPrinter();
  const { tableId } = useLocalSearchParams();  // Use this to get tableId from URL params

  // Filter orders for the current table
  const currentTableOrders = orders.filter(order => order?.tableNumber === parseInt(`${tableId}`));

  useEffect(() => {
    OrientationLocker?.lockToLandscape();
    return () => {
      OrientationLocker?.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    if (isFocused && currentTableOrders.length > 0) {
      setActiveTab('Ordered');
    } else {
      setActiveTab('Ordering');
      setOrder([])
      setSubtotal(0)
    }

  }, [isFocused])

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
      setSubtotal(subtotal + item.price);
    }
  };

  const updateSubtotal = (updatedOrder) => {
    const newSubtotal = updatedOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  const handleSaveOrder = () => {
    const orderId = uuid.v4();  // Generate a unique order ID

    const orderDetails = {
      orderId: orderId as string,
      tableNumber: parseInt(`${tableId}`),
      waiterName: 'Ramesh',  // You can make this dynamic based on your app's logic
      date: new Date().toISOString(),
      customer: { name: 'Jane Smith', contact: '123-456-7890' },  // Example, replace with actual customer details
      items: order,
      total: subtotal,
      status: "occupied"
    };

    dispatch(saveOrder(orderDetails));  // Save the order in Redux
    setOrder([]) // Mark table as occupied
    handleKOTPrint();
    router.back();  // Navigate back to the tables page
  };

  const handleKOTPrint = () => {
    printKOT({
      tableNumber: 110,
      guests: 1,
      orderNumber: '00034',
      staffName: 'Admin',
      time: '09-08 00:54',
      items: [
        { category: 'Salads', name: 'Arugula', quantity: 1, note: 'Regular' },
        { category: 'Sandwiches', name: 'Fairy bread', quantity: 1, note: 'spicy' },
      ],
    });
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
    <TouchableOpacity onPress={() => {
      setActiveTab('Ordering')
      addItemToOrder(item)
    }} style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{`₹${item.price}`}</Text>
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
      <Text style={styles.orderItemText}>Qty: {item.quantity}</Text>
      <Text style={styles.orderItemText}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderSummaryFooter = () => (
    <View style={styles.summaryFooter}>
      <Text style={styles.summaryText}>Quantity: {order.reduce((total, item) => total + item.quantity, 0)}</Text>
      <Text style={styles.summaryText}>Subtotal: {subtotal}</Text>
      {activeTab === 'Ordering' && <TouchableOpacity disabled={order.length == 0} style={styles.sendButton} onPress={handleSaveOrder}>
        <Text disabled={order.length == 0} style={styles.sendButtonText}>Send</Text>


      </TouchableOpacity>}
      {currentTableOrders.length > 0 && activeTab === "Ordered" && <SamplePrint order={currentTableOrders} />}
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

    <SafeAreaView style={styles.safeArea}>
      <View>
        <HorizontalStrip></HorizontalStrip>
      </View>

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
            <TouchableOpacity>
              <Text style={[styles.tabText]}>{`Table:${tableId}`}</Text>
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
                data={currentTableOrders.length > 0 ? currentTableOrders[0].items : []}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.noRecords}>No Records</Text>}
              />
              {selectedOrderedItem ? renderItemActionButtons() : renderSummaryFooter()}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    // marginTop:-25,
    // Adjust the background color as needed
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  orderSummary: {
    flex: 2.5,
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
    display: "flex",
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
    borderRadius: 1,
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
    marginTop: -5,
    flexDirection: 'row',
    maxHeight: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  searchBar: {
    flex: 1,
    maxHeight: 20,
    fontSize: 14,
    marginLeft: 10,
  },
  searchToggleButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
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
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryTab: {
    borderColor: 'orange',
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
    marginTop: 3,
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
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
  },
  activeTab: {
    // backgroundColor: '#f5a623',
    borderBottomWidth: 2,
    borderBottomColor: 'cyan',
    borderRadius: 1
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




function HorizontalStrip() {
  const elements = [
    { label: '', backgroundColor: '1a353', icon: 'arrow-back-sharp' },
    { label: 'Customer', backgroundColor: '#66cdaa', icon: 'person-add-outline' },
    { label: 'Staff', backgroundColor: '#8bc34a', icon: 'man-outline' },
    { label: 'Receipt', backgroundColor: '#cddc39', icon: 'print-outline' },
    { label: 'Transfer', backgroundColor: '#ff9800', icon: 'swap-horizontal-outline' },
    { label: 'Combine', backgroundColor: '#9c27b0', icon: 'sync-outline' },
    { label: 'Quick Pay', backgroundColor: '#ffeb3b', icon: 'cash-outline' },
    { label: 'Priority', backgroundColor: '#4bc34a', icon: 'speedometer-outline' },
    { label: 'Void', backgroundColor: '#ff9800', icon: 'trash-outline' },

  ];

  const handlePress = (label: string) => {
    // Handle the press event for each item
    switch (label) {
      case '':
        router.back()
        break;
      case 'Customer':
        // Perform action for Takeout
        Alert.alert('Takeout Pressed', 'You pressed the Takeout option.');
        break;
      case 'Staff':
        // Perform action for Takeout
        Alert.alert('Takeout Pressed', 'You pressed the Takeout option.');
        break;
      case 'Receipt':
        // Perform action for Tab
        Alert.alert('Tab Pressed', 'You pressed the Tab option.');
        break;
      case 'KOT':
        // Perform action for Unpaid
        Alert.alert('Unpaid Pressed', 'You pressed the Unpaid option.');
        break;
      case 'Transfer':
        // Perform action for Drawer
        Alert.alert('Drawer Pressed', 'You pressed the Drawer option.');
        break;
      case 'Combine':
        // Perform action for Print Error
        Alert.alert('Print Error Pressed', 'You pressed the Print Error option.');
        break;
      case 'Priority':
        // Perform action for More
        Alert.alert('More Pressed', 'You pressed the More option.');
        break;
      default:
        console.log(`No specific action for ${label}`);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[stylesStrip.scrollView, { flex: elements.length > 5 ? 0 : 1 }]}
    >
      {elements.map((element, index) => (
        <TouchableOpacity
          key={index}
          style={[
            stylesStrip.item,
            { backgroundColor: element.backgroundColor, flex: elements.length > 5 ? 0 : 1 },
            index === 0 && { width: 30 }
          ]}
          onPress={() => handlePress(element.label)}  // Add onPress functionality
        >
          <Ionicons name={element.icon} size={20} color="black" style={stylesStrip.icon} />
          <Text style={stylesStrip.itemText}>{element.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const stylesStrip = StyleSheet.create({
  scrollView: {
    display: 'flex',
    flex: 1,
    marginVertical: 0,
    marginHorizontal: 5,
    flexDirection: 'row',
    maxHeight: 35,
    marginBottom: 10
    // backgroundColor:'red'
  },
  item: {
    flexDirection: 'row',
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    borderRadius: 1,
    flex: 1
  },
  itemText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  icon: {
    marginRight: 5, // Space between icon and text
  }
});