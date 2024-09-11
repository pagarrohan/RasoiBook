//@ts-nocheck
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useRoute } from '@react-navigation/native';

const RestaurantTables = () => {
  const tables = useSelector((state: RootState) => state.tables); // Assuming your tables are stored here
  const orders = useSelector((state: RootState) => state.orders); // Orders from Redux store

  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const numColumns = isPortrait ? 3 : 4;

  // Function to extract the order data for each table
  const getOrderDataForTable = (tableNumber: number) => {
    const tableOrder = orders.find(order => order.tableNumber === tableNumber);

    // If there's an order for the current table, return its data; otherwise, return default values
    if (tableOrder) {
      return {
        status: tableOrder.status, // You can customize this further based on your app logic
        total: tableOrder.total,
        waiterName: tableOrder.waiterName,
        date: tableOrder.date,
      };
    } else {
      return {
        status: 'free',
        total: 0,
        waiterName: '',
        date: '',
      };
    }
  };

  const renderItem = ({ item }) => {
    // Get the order data for this specific table
    const orderData = getOrderDataForTable(item.tableNumber);

    return (
      <TableCard
        tableNumber={item.tableName}
        status={orderData.status}
        total={orderData.total}
        waiterName={orderData.waiterName}
        date={orderData.date}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <FlatList
          data={tables} // Assuming `tables` contains table data
          renderItem={renderItem}
          keyExtractor={(item) => item.tableId}
          numColumns={numColumns} // Dynamic number of columns
          columnWrapperStyle={styles.row}
          key={numColumns} // To trigger re-render on orientation change
        />
      </View>
    </SafeAreaView>
  );
};

// TableCard Component
const TableCard = ({ tableNumber, status, total, waiterName, date }: any) => {
  const color = getStatusColor(status);
  const navigation = useNavigation();

  const handleTablePress = () => {
    router.push({ pathname: 'order', params: { tableId: tableNumber } });
  };

  const formatDateToTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0'); // Ensures two digits for hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two digits for minutes
    return `${hours}:${minutes}`;
  };
  return (
    <TouchableOpacity onPress={handleTablePress} style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.time}>{date &&formatDateToTime(date) || ''}</Text>
      <View style={styles.tableNumberContainer}>
        <Text style={styles.tableNumber}>{tableNumber}</Text>
      </View>
      <Text style={styles.waiter}>{waiterName || ''}</Text>
      <Text style={styles.amount}>{`₹${total}` || ''}</Text>
    </TouchableOpacity>
  );
};

// Function to determine the card color based on the status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'occupied':
      return '#f5a623'; // yellow
    case 'free':
      return '#ffffff'; // white for free
    default:
      return '#ffffff'; // default color white
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: -15,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    height: 100,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tableNumberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  time: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 12,
    color: '#000',
  },
  amount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  waiter: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 12,
    color: '#000',
  },
});

export default RestaurantTables;
