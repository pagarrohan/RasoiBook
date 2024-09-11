import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

interface KOTPrinterProps {
  tableNumber: number;
  guests: number;
  orderNumber: string;
  staffName: string;
  time: string;
  items: Array<{
    category: string;
    name: string;
    quantity: number;
    note?: string;
  }>;
}

// Create the hook
export const useKOTPrinter = () => {
  
  const printKOT = async ({
    tableNumber,
    guests,
    orderNumber,
    staffName,
    time,
    items,
  }: KOTPrinterProps) => {
    try {
      // Align Center for Kitchen Header
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText('*** Kitchen ***\r\n', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 1,
        heigthtimes: 1,
        fonttype: 1,
      });

      // Table, Guests, Order Number
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText(`${tableNumber}\r\n`, { fonttype: 2 }); // Table Number
      await BluetoothEscposPrinter.printText(`${guests} Guests\r\n`, {});
      await BluetoothEscposPrinter.printText(`${orderNumber}\r\n`, {}); // Order Number
      await BluetoothEscposPrinter.printText('--------------------------------\r\n', {});

      // Staff and Time
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(`Staff: ${staffName}\r\n`, {});
      await BluetoothEscposPrinter.printText(`Time: ${time}\r\n`, {});
      await BluetoothEscposPrinter.printText('--------------------------------\r\n', {});

      // Items Section with Increased Font Size
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

        // Print the category with increased font size
        await BluetoothEscposPrinter.printText(`---${item.category}---\r\n`, {});

        // Print the item name with the same increased font size
        await BluetoothEscposPrinter.printText(`${item.quantity}x ${item.name}\r\n`, {
          fonttype: 1,
          widthtimes: 1,
          heigthtimes: 1, // Larger font for items
        });

        // Print any notes associated with the item
        if (item.note) {
          await BluetoothEscposPrinter.printText(`***${item.note}\r\n`, {});
        }
      }

      // Divider
      await BluetoothEscposPrinter.printText('--------------------------------\r\n\r\n\r\n', {});
    } catch (e) {
      alert(e.message || 'ERROR');
    }
  };

  // Return the print function to be used by any component
  return { printKOT };
};