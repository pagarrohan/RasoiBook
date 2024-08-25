import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SettingsComponent = ({navigation}) => {
  const [selectedSetting, setSelectedSetting] = useState('Menu');

  const settings = [
    'Store',
    'Menu',
    'Dine In',
    'Delivery',
    'Takeout',
    'Tab'
  ];

  const renderSettingDetails = () => {
    switch (selectedSetting) {
      case 'Store':
        return <Text style={styles.detailText}>Store settings content here</Text>;
      case 'Menu':
        return (
          <ScrollView>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Table Group</Text>
              <Text style={styles.descriptionText}>Add/delete/update table group</Text>
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Table</Text>
              <Text style={styles.descriptionText}>Import/add/delete/update table</Text>
            </View>
            <View style={styles.optionContainer}>
              <Text onPress={()=>{navigation.navigate('categeory')}} style={styles.optionText}>Category</Text>
              <Text style={styles.descriptionText}>Import/add/delete/update category</Text>
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Item</Text>
              <Text style={styles.descriptionText}>Import/add/delete/update item</Text>
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Modifier</Text>
              <Text style={styles.descriptionText}>Add/delete/update Modifier</Text>
            </View>
          </ScrollView>
        );
      case 'Dine In':
        return <Text style={styles.detailText}>Dine In settings content here</Text>;
      case 'Delivery':
        return <Text style={styles.detailText}>Delivery settings content here</Text>;
      case 'Takeout':
        return <Text style={styles.detailText}>Takeout settings content here</Text>;
      case 'Tab':
        return <Text style={styles.detailText}>Tab settings content here</Text>;
      default:
        return <Text style={styles.detailText}>Select a setting to view details</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        {settings.map(setting => (
          <TouchableOpacity
            key={setting}
            onPress={() => setSelectedSetting(setting)}
            style={[
              styles.sidebarButton,
              selectedSetting === setting && styles.selectedSidebarButton
            ]}
          >
            <Text style={styles.sidebarText}>{setting}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mainContent}>
        <View style={styles.detailsContainer}>
          {renderSettingDetails()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#2D2D2D',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebarButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 4,
  },
  selectedSidebarButton: {
    backgroundColor: '#444444',
  },
  sidebarText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  mainContent: {
    width: '75%',
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow properties for iOS
    shadowOpacity: 0.1, // Shadow properties for iOS
    shadowRadius: 4, // Shadow properties for iOS
  },
  optionContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#777777',
  },
  detailText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default SettingsComponent;
