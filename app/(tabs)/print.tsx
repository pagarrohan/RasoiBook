import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  Alert,
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ItemList from '../bluetooth/ItemList';
import SamplePrint from '../bluetooth/SamplePrint';
import { styles } from '../bluetooth/styles';

const App = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [retrying, setRetrying] = useState(false);  // New state to track retrying


  useEffect(() => {
    const initBluetooth = async () => {
      try {
        const enabled = await BluetoothManager.isBluetoothEnabled();
        setBleOpend(Boolean(enabled));
        setLoading(false);

        const savedAddress = await AsyncStorage.getItem('boundAddress');
        const savedName = await AsyncStorage.getItem('boundName');
        console.log("data", savedAddress, savedName);

        if (savedAddress && savedName) {
          setBoundAddress(savedAddress);
          setName(savedName);
          connect({ address: savedAddress, name: savedName });
        }
      } catch (err) {
        console.log(err);
      }
    };

    initBluetooth();

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {

        deviceFoundEvent(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {

        setName('');
        setBoundAddress('');
        AsyncStorage.removeItem('boundAddress');
        AsyncStorage.removeItem('boundName');
      });
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
        console.log("EVENT_DEVICE_ALREADY_PAIRED", rsp);

      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {

        deviceFoundEvent(rsp);

        console.log("EVENT_DEVICE_FOUND", rsp);
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {

        setName('');
        setBoundAddress('');
        AsyncStorage.removeItem('boundAddress');
        AsyncStorage.removeItem('boundName');
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
        ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
      });

      DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_STATE_CHANGE, (state) => {
        console.log("EVENT_BLUETOOTH_STATE_CHANGE", state);

        if (state === 'on') {

          attemptReconnect();
        }
      });
    }

    if (pairedDevices.length < 1) {
      scan();
    }
    console.log("pairedDevices",pairedDevices);
    console.log("foundDs",foundDs);
    
    
  }, [boundAddress, pairedDevices]);

  const attemptReconnect = async () => {
    const savedAddress = await AsyncStorage.getItem('boundAddress');
    const savedName = await AsyncStorage.getItem('boundName');

    if (savedAddress && savedName) {
      setRetrying(true);  // Set retrying state to true
      const retryInterval = setInterval(async () => {
        try {
          await BluetoothManager.connect(savedAddress);
          setBoundAddress(savedAddress);
          setName(savedName);
          setRetrying(false);  // Set retrying state to false
          clearInterval(retryInterval); // Stop retrying once connected
        } catch (e) {
          console.log("Retrying connection...");
        }
      }, 3000); // Retry every 3 seconds

      setTimeout(() => {
        clearInterval(retryInterval);
        setRetrying(false);  // Stop retrying after 30 seconds
      }, 30000); // Stop trying after 30 seconds
    }
  };

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) { }
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = async row => {
    setLoading(true);
    try {
      await BluetoothManager.connect(row.address);
      setLoading(false);
      setBoundAddress(row.address);
      setName(row.name || 'UNKNOWN');
      await AsyncStorage.setItem('boundAddress', row.address);
      await AsyncStorage.setItem('boundName', row.name || 'UNKNOWN');
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  };

  const unPair = async address => {
    setLoading(true);
    try {
      await BluetoothManager.unpaire(address);
      setLoading(false);
      setBoundAddress('');
      setName('');
      await AsyncStorage.removeItem('boundAddress');
      await AsyncStorage.removeItem('boundName');
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        var found = s.found;
        try {
          found = JSON.parse(found);
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
      
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'Bluetooth permission',
          message: 'Bluetooth access is required to connect to the printer',
          buttonNeutral: 'Later',
          buttonNegative: 'No',
          buttonPositive: 'Yes',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // access denied
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  // 66:32:1F:5E:80:A4 MPT-II
  return (
    <ScrollView style={styles.container}>
      <View style={styles.bluetoothStatusContainer}>
        <Text style={{ color: "red" }}>
          Bluetooth {`${name} ${boundAddress}`}
        </Text>
        <Button title="conncet to old" onPress={() => { connect({ address: '66:32:1F:5E:80:A4', name: 'MPT-II' }) }}></Button>
      </View>
      <View style={styles.bluetoothStatusContainer}>
        <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
          Bluetooth {bleOpend ? 'Active' : 'Inactive'}
        </Text>
      </View>
      {!bleOpend && <Text style={styles.bluetoothInfo}>Please enable Bluetooth</Text>}
      <Text style={styles.sectionTitle}>Connected Printer:</Text>
      {boundAddress.length > 0 && (
        <ItemList
          label={name}
          value={boundAddress}
          onPress={() => unPair(boundAddress)}
          actionText="Disconnect"
          color="#E9493F"
        />
      )}
      {boundAddress.length < 1 && (
        <Text style={styles.printerInfo}>No printer connected</Text>
      )}
      {retrying && (  // Show retrying message or spinner
        <View style={styles.retryContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ color: 'red' }}>Retrying to connect...</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Available Bluetooth Devices:</Text>
      {loading ? <ActivityIndicator animating={true} /> : null}
      <View style={styles.containerList}>
        {pairedDevices.map((item, index) => {
          return (
            <ItemList
              key={index}
              onPress={() => connect(item)}
              label={item.name}
              value={item.address}
              connected={item.address === boundAddress}
              actionText="Connect"
              color="#00BCD4"
            />
          );
        })}
      </View>
      <SamplePrint />
      <Button
        onPress={() => scanBluetoothDevice()}
        title="Scan Bluetooth"
      />
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default App;
