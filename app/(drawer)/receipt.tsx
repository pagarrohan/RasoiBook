import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, DataTable } from 'react-native-paper';


function CustomDrawerHeader({ title }) {


    return (
        <View style={styles1.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles1.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles1.headerTitle}>{title}</Text>
        </View>
    );
}

const styles1 = StyleSheet.create({
    headerContainer: {
        marginTop:50,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
export default function SalesInvoice() {
  const [receipts, setReceipts] = useState([
    { id: '1', orderNumber: '00001', date: '2016-04-25T12:23:00', table: 'take-away', amount: 55.00, paymentMethod: 'Cash', isVoid: false, isRefund: false },
    { id: '2', orderNumber: '00002', date: '2016-04-25T12:23:00', table: 'take-away', amount: 60.00, paymentMethod: 'Online', isVoid: false, isRefund: false },
    { id: '3', orderNumber: '00003', date: '2016-04-25T12:24:00', table: '109', amount: 45.00, paymentMethod: 'Cash', isVoid: true, isRefund: false },
    { id: '4', orderNumber: '00001', date: '2016-04-25T12:23:00', table: 'take-away', amount: 55.00, paymentMethod: 'Cash', isVoid: false, isRefund: false },
    { id: '5', orderNumber: '00002', date: '2016-04-25T12:23:00', table: 'take-away', amount: 60.00, paymentMethod: 'Online', isVoid: false, isRefund: false },
    { id: '6', orderNumber: '00003', date: '2016-04-25T12:24:00', table: '109', amount: 45.00, paymentMethod: 'Cash', isVoid: true, isRefund: false },
    { id: '7', orderNumber: '00001', date: '2016-04-25T12:23:00', table: 'take-away', amount: 55.00, paymentMethod: 'Cash', isVoid: false, isRefund: false },
    { id: '8', orderNumber: '00002', date: '2016-04-25T12:23:00', table: 'take-away', amount: 60.00, paymentMethod: 'Online', isVoid: false, isRefund: false },
    { id: '9', orderNumber: '00003', date: '2016-04-25T12:24:00', table: '109', amount: 45.00, paymentMethod: 'Cash', isVoid: true, isRefund: false },
    { id: '10', orderNumber: '00001', date: '2016-04-25T12:23:00', table: 'take-away', amount: 55.00, paymentMethod: 'Cash', isVoid: false, isRefund: false },
    { id: '11', orderNumber: '00002', date: '2016-04-25T12:23:00', table: 'take-away', amount: 60.00, paymentMethod: 'Online', isVoid: false, isRefund: false },

  ]);


  const totalInvoices = receipts.length;
  const totalSales = receipts.reduce((sum, receipt) => sum + receipt.amount, 0).toFixed(2);
  const dineInQuantity = receipts.filter(receipt => receipt.table !== 'take-away').length;
  const takeAwayQuantity = receipts.filter(receipt => receipt.table === 'take-away').length;

  return (
    <SafeAreaView >
      <ScrollView>
    
      <CustomDrawerHeader title={"Receipt"}></CustomDrawerHeader>

        {/* Receipts Table */}
        <View style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Order</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Table</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>

            {receipts.map((receipt) => (
              <DataTable.Row key={receipt.id}>
                <DataTable.Cell>{receipt.orderNumber}</DataTable.Cell>
                <DataTable.Cell>{receipt.date}</DataTable.Cell>
                <DataTable.Cell>{receipt.table}</DataTable.Cell>
                <DataTable.Cell numeric>${receipt.amount.toFixed(2)}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
    
         {/* Summary Data Row */}
         <View style={styles.summaryRow}>
          <Text style={styles.summaryItem}>Total Invoices: {totalInvoices}</Text>
          <Text style={styles.summaryItem}>Total Sales: ${totalSales}</Text>
          <Text style={styles.summaryItem}>Dine-In: {dineInQuantity}</Text>
          <Text style={styles.summaryItem}>Take-Away: {takeAwayQuantity}</Text>
        </View>
      </ScrollView>
      </SafeAreaView>
      
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex:1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 2,
  },
});