import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Icon for back button
import { useNavigation } from '@react-navigation/native'; // For navigation and back action
import { router } from 'expo-router';

const settingsList = [
  { label: 'Store' },
  { label: 'Menu' },
  { label: 'Dine In' },
  { label: 'Delivery' },
  { label: 'Takeout' },
  { label: 'Tab' }

];

const settingsDetails = {
  Store: [
    { title: 'Store details', description: 'Add/edit store information' },
    { title: 'Staff', description: 'Add/edit staff details' }
  ],
  Menu: [
    { title: 'Tables', description: 'add/edit/delete tables' },
    { title: 'Table Group', description: 'add/edit/delete table group'},
    { title: 'Items', description: 'add/edit/delete items' },
    { title: 'Categories', description: 'add/edit/delete categories' },
    { title: 'Kitchen Note', description: 'add/edit/delete kitchen note' },
    { title: 'Void Reason', description: 'add/edit/delete void reason' },
    { title: 'Discount', description: 'add/edit/delete discount' },
    { title: 'Tax', description: 'Setup'},
    { title: 'Payment Method', description: 'add/edit/delete Payment Method'},
    { title: 'Invoice Number', description: ''},
    { title: 'Order Number', description: ''},
  ],
  'Dine In': [
    { title: 'Table Management', description: 'Manage tables and seating' },
  ],
  Delivery: [
    { title: 'Delivery Settings', description: 'Manage delivery operations' }
  ],
  Takeout: [
    { title: 'Takeout Orders', description: 'Manage takeout orders' }
  ],
  Tab: [
    { title: 'Tab Management', description: 'Manage open tabs' }
  ],
};

const SettingScreen = () => {

  const [selectedSetting, setSelectedSetting] = useState(settingsList[0].label); // Default to the first setting
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
const settingsHandler=(title)=>{
    
    switch (title) {
        case 'Tables':
           router.navigate('/(drawer)/(settings)/menu/table')
            break;
            case 'Table Group':
                router.navigate('/(drawer)/(settings)/menu/tableGroup')
                 break;
    
        default:
            break;
    }
}
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Settings</Text>
      </View>

      {/* Main Container */}
      <View style={styles.container}>
        {/* First Section (Settings List) */}
        <View style={[styles.settingsList, { flex: isPortrait ? 0.3 : 0.2 }]}>
          <FlatList
            data={settingsList}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.settingItem, selectedSetting === item.label && styles.selectedSetting]}
                onPress={() => setSelectedSetting(item.label)}
              >
                <Text style={styles.settingText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Second Section (Settings Details) */}
        <View style={[styles.settingDetails, { flex: isPortrait ? 0.6 :0.8 }]}>
        
          {/* Details Section - Reusing List Style */}
          <FlatList
            data={settingsDetails[selectedSetting]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.detailItem}  onPress={()=>{settingsHandler(item.title)}}>
                <Text style={styles.detailTitle}>{item.title}</Text>
                {item.description&&<Text style={styles.detailDescription}>{item.description}</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2', // Your preferred color
    height: 40,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  navBarTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'row', // Always side-by-side in both portrait and landscape
  },
  settingsList: {
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  settingItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: '#ddd',
  },
  selectedSetting: {
    backgroundColor: '#e0e0e0', // Highlight selected item
  },
  settingText: {
    fontSize: 14,
    color: '#000',
  },
  settingDetails: {
    backgroundColor: '#fff',
    padding: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  detailDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingScreen;