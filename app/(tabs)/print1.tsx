import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BluetoothDeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const manager = new BleManager();

  useEffect(() => {
    const reconnectToDevice = async () => {
      const savedDeviceId = await AsyncStorage.getItem('savedDeviceId');
      if (savedDeviceId) {
        try {
          setIsReconnecting(true);
          const device = await manager.connectToDevice(savedDeviceId);
          await device.discoverAllServicesAndCharacteristics();
          setConnectedDevice(device);
          setIsConnected(true);
          setIsReconnecting(false);
          console.log('Reconnected to:', device.name);

          // Listen for disconnection
          device.onDisconnected((error, disconnectedDevice) => {
            console.log('Device disconnected:', disconnectedDevice.name);
            setIsConnected(false);
            setConnectedDevice(null);
            reconnectToDevice();
          });
        } catch (error) {
          console.log('Failed to reconnect:', error.message);
          setIsReconnecting(false);
        }
      }
    };

    // Monitor Bluetooth State Changes
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        reconnectToDevice(); // Attempt to reconnect when Bluetooth is turned on
      }
    }, true);

    reconnectToDevice(); // Initial Reconnect Attempt

    return () => {
      subscription.remove();
      manager.destroy();
    };
  }, [manager]);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error('Scan error:', error.message);
        setIsScanning(false);
        return;
      }

      // Avoid duplicate devices
      if (scannedDevice && !devices.some(device => device.id === scannedDevice.id)) {
        setDevices(prevDevices => [...prevDevices, scannedDevice]);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      setIsReconnecting(true);
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDevice);
      setIsConnected(true);
      setIsReconnecting(false);
      await AsyncStorage.setItem('savedDeviceId', device.id);
      console.log('Connected to:', connectedDevice.name);

      // Listen for disconnection
      connectedDevice.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.name);
        setIsConnected(false);
        setConnectedDevice(null);
        reconnectToDevice(disconnectedDevice.id);
      });
    } catch (error) {
      console.error('Connection error:', error.message);
      setIsReconnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setIsConnected(false);
      await AsyncStorage.removeItem('savedDeviceId');
      console.log('Disconnected from device');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bluetooth Device Manager</Text>

      {isScanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.scanningText}>Scanning for devices...</Text>
        </View>
      ) : (
        <Button title="Scan for Bluetooth Devices" onPress={startScan} />
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => connectToDevice(item)}
          >
            <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No devices found. Please scan.</Text>}
      />

      {isConnected ? (
        <View>
          <Text style={styles.connectedText}>Connected to {connectedDevice.name}</Text>
          <Button title="Disconnect" onPress={disconnectDevice} />
        </View>
      ) : isReconnecting ? (
        <View style={styles.reconnectingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.reconnectingText}>Reconnecting...</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanningText: {
    marginLeft: 8,
    fontSize: 16,
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 18,
  },
  deviceId: {
    fontSize: 14,
    color: '#888',
  },
  connectedText: {
    fontSize: 18,
    color: 'green',
    marginVertical: 16,
    textAlign: 'center',
  },
  reconnectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  reconnectingText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'orange',
  },
});

export default BluetoothDeviceManager;
