import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

const ReceiptPrint = (props) => {
  console.log("order from print ",props?.order&&props?.order[0]?.items[0]||'');
  
const printReceipt = async () => {
    try {
      const columnWidths = [20, 12]; // Adjusted column width for the item details and total price

      // Header
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText('Hotel Sai\r\n', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 1,
        heigthtimes: 1,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText('SERVE FRESH AT\r\nDoctor House\r\nS.G. Highway, Pune\r\n+91 976 669 9258\r\n', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      });
      await BluetoothEscposPrinter.printText('--------------------------------\r\n', {});

      // Receipt Details
      await BluetoothEscposPrinter.printText('Receipt No: 21-200-000003\r\n', {});
      await BluetoothEscposPrinter.printText('11-02-2021 12:45:31 PM\r\n', {});
      await BluetoothEscposPrinter.printText('User: Patel\r\n', {});
      await BluetoothEscposPrinter.printText('Order No.: 10\r\n', {});
      await BluetoothEscposPrinter.printText('--------------------------------\r\n', {});

      // Items Section
      await BluetoothEscposPrinter.printText('Items:\r\n', {});

      // First Item: Milk Shake (Left-aligned)
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(`${props?.order[0]?.items[0]?.name}\r\n`, {}); // Item name
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [`${props?.order[0]?.items[0].quantity} x Rs${props?.order[0]?.items[0]?.price}`, `Rs${props?.order[0]?.items[0]?.quantity*props?.order[0]?.items[0]?.price}`], // Quantity/Unit Price, Total Price
        {}
      );

      // Second Item: Cheese Sandwich (Left-aligned)
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(`${props?.order[0]?.items[1]?.name}\r\n`, {}); // Item name
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [`${props.order[0]?.items[0]?.quantity} x Rs${props.order[0]?.items[1]?.price}`, `Rs${props?.order[0]?.items[1]?.quantity*props?.order[0]?.items[1]?.price}`], // Quantity/Unit Price, Total Price
        {}
      );

      // Divider
      await BluetoothEscposPrinter.printText('--------------------------------\r\n', {});

      // Summary Section
      // Item Count
      await BluetoothEscposPrinter.printColumn(
        [24, 8],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Item Count:', '2'],
        {}
      );

      // Total (Bold)
      await BluetoothEscposPrinter.printColumn(
        [24, 8],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total:', 'Rs160'],
        { bold: true }
      );

      // Cash (Bold)
      await BluetoothEscposPrinter.printColumn(
        [24, 8],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Cash:', 'Rs160'],
        { bold: true }
      );

      // Footer
      await BluetoothEscposPrinter.printText('Paid amount: Rs160\r\n', {});
      await BluetoothEscposPrinter.printText('E. & O.E. Thanks...Visit Again\r\n', {});
      await BluetoothEscposPrinter.printText('--------------------------------\r\n\r\n\r\n', {});
    } catch (e) {
      alert(e.message || 'ERROR');
    }
  };

  return (

      <View style={styles.printReceiptButtonText}>
        <Button onPress={printReceipt} title="Print Receipt" />
      </View>
  );
};

export default ReceiptPrint;

const styles = StyleSheet.create({
 
  printReceiptButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
