//@ts-nocheck
import { useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';

// Function to determine the card color based on the status
const getStatusColor = (status:string) => {
  switch (status) {
    case 'occupied':
      return '#f5a623'; // yellow
    case 'held':
      return '#d0021b'; // Red
    case 'bill-printed':
      return '#7ed321'; // Green
    case 'free':
      return '#ffffff'; // White with dot (indicating KDS closed, add logic for dot if needed)
    default:
      return '#ffffff'; // default color white
  }
};

const TableCard = ({ tableNumber, time, guests, amount, waiter, status }:any) => {
  const color = getStatusColor(status);
  const navigation = useNavigation();


  const handlePress = () => {
    navigation.navigate('order', { tnumber:tableNumber });
  };
  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.time}>{time}</Text>
    <Text style={styles.guests}>{guests}</Text>
    <View style={styles.tableNumberContainer}>
      <Text style={styles.tableNumber}>{tableNumber}</Text>
    </View>
    <Text style={styles.waiter}>{waiter}</Text>
    <Text style={styles.amount}>{amount}</Text>
  </TouchableOpacity>
  );
};


const RestaurantTables = () => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const numColumns = isPortrait ? 3 : 4;

  const data = [
    { id: '111', tableNumber: 'abcde', time: '01:23 PM', guests: '1', amount: '$176.00', waiter: 'Admin', status: 'closed' },
    { id: '222', tableNumber: '102', time: '08:02 AM', guests: '2', amount: '$98.00', waiter: 'Admin', status: 'closed' },
    { id: '333', tableNumber: '103', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '4333', tableNumber: '104', time: '01:24 PM', guests: '2', amount: '$30.00', waiter: 'Admin', status: 'printed' },
    { id: '533', tableNumber: '105', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '633', tableNumber: '106', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '7333', tableNumber: '107', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '8333', tableNumber: '108', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '9333', tableNumber: '109', time: '01:24 PM', guests: '1', amount: '$111.00', waiter: 'Admin', status: 'held' },
    { id: '1033', tableNumber: '110', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '1133', tableNumber: '111', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '123', tableNumber: '112', time: '03:55 PM', guests: '2', amount: '$15.00', waiter: 'Admin', status: 'closed' },
    { id: '133', tableNumber: 'qwe', time: '01:23 PM', guests: '1', amount: '$176.00', waiter: 'Admin', status: 'closed' },
    { id: '233', tableNumber: '102', time: '08:02 AM', guests: '2', amount: '$98.00', waiter: 'Admin', status: 'closed' },
    { id: '3333', tableNumber: '103', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '43', tableNumber: '104', time: '01:24 PM', guests: '2', amount: '$30.00', waiter: 'Admin', status: 'printed' },
    { id: '533', tableNumber: '105', time: '', guests: '', amount: '', waiter: '', status: 'closed' },
    { id: '633', tableNumber: '106', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '733', tableNumber: '107', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '8333', tableNumber: '108', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '9333', tableNumber: '109', time: '01:24 PM', guests: '1', amount: '$111.00', waiter: 'Admin', status: 'held' },
    { id: '1033', tableNumber: '110', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '11333', tableNumber: '111', time: '', guests: '', amount: '', waiter: '', status: 'default' },
    { id: '1332', tableNumber: '112', time: '03:55 PM', guests: '2', amount: '$15.00', waiter: 'Admin', status: 'closed' },
  ];

  const renderItem = ({ item }) => (
    <TableCard
      tableNumber={item.tableNumber}
      time={item.time}
      guests={item.guests}
      amount={item.amount}
      waiter={item.waiter}
      status={item.status}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // Dynamic number of columns
        columnWrapperStyle={styles.row}
        key={numColumns} // To trigger re-render on orientation change
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    // Adjust shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Adjust shadow for Android
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
  guests: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    fontSize: 14,
    color: '#000',
  },
});

export default RestaurantTables;
