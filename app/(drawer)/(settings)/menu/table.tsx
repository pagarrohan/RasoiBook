import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native'; // For navigation
import SimpleDropdown from '@/components/common/picker';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { RootState } from '@/redux/store/store'; // Import RootState
import { addTable, editTable, deleteTable  } from '@/redux/slice/table/tableSlice';

const TableScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const { width, height } = useWindowDimensions(); // Get screen dimensions
  const isPortrait = height > width; // Check if the device is in portrait mode

  const dispatch = useDispatch();
  
  // Fetching tables and table groups from Redux store
  const tables = useSelector((state: RootState) => state.tables);
  const tableGroups = useSelector((state: RootState) => state.tableGroups); // Fetch groups from Redux

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableName, setTableName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string >('');

  // Open modal for adding a new table
  const openModalForAdd = () => {
    setSelectedTable(null);
    setTableName('');
    setSelectedGroup('');
    setIsModalVisible(true);
  };

  // Open modal for editing an existing table
  const openModalForEdit = (table: any) => {
    setSelectedTable(table.tableId);
    setTableName(table.tableName);
    setSelectedGroup(table.tableGroup);
    setIsModalVisible(true);
  };

  // Handle adding a new table
  const handleAddTable = () => {
    if ( false ) {
      Alert.alert('Validation', 'Table name, number, and group cannot be empty.');
      return;
    }

    dispatch(addTable({ tableName, tableGroup: selectedGroup ,tableId:Math.floor(Math.random()*999)}));
    closeModal();
  };

  // Handle updating an existing table
  const handleUpdateTable = () => {
    if ( tableName.trim() === '' || !selectedGroup) {
      Alert.alert('Validation', 'Table name, number, and group cannot be empty.');
      return;
    }

    if (selectedTable) {
      dispatch(editTable({ tableId: selectedTable, tableName: tableName, tableGroup: selectedGroup }));
      closeModal();
    }
  };

  // Handle deleting a table
  const handleDeleteTable = () => {
    if (selectedTable) {
      dispatch(deleteTable({ tableId: selectedTable }));
      closeModal();
    }
  };

  // Close modal
  const closeModal = () => {
    setTableName('');
    setSelectedTable(null);
    setSelectedGroup('');
    setIsModalVisible(false);
  };

  const renderTableItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tableItem} onPress={() => openModalForEdit(item)}>
      <Text style={styles.tableName}>{item.tableName}</Text>
      <Text style={styles.tableGroup}>{item.tableGroup}</Text>
    </TouchableOpacity>
  );

  // Map groups from Redux into dropdown options
  const groupOptions = tableGroups.map(group => ({
    label: group.groupName,
    value: group.groupName,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.navigate('/(drawer)/(settings)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tables</Text>
        <TouchableOpacity onPress={openModalForAdd} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Table</Text>
        </TouchableOpacity>
      </View>

      {/* List of Tables */}
      <FlatList
        data={tables}
        keyExtractor={(item) => item.tableId}
        renderItem={renderTableItem}
        contentContainerStyle={styles.tableList}
      />

      {/* Modal for Adding/Editing Table */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                width: isPortrait ? '80%' : '50%', // 80% width in portrait, 50% in landscape
                maxHeight: '80%', // Set max height to avoid overflow
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter Table Number"
              value={tableName}
              onChangeText={setTableName}
              keyboardType="numeric"
            />

            {/* Dropdown for selecting table group */}
            <SimpleDropdown
              label="Group"
              options={groupOptions}
              selectedValue={selectedGroup}
              onValueChange={(value) => setSelectedGroup(value)}
            />

            <View style={styles.modalButtonContainer}>
              {selectedTable ? (
                <>
                  <Button title="Update Table" onPress={handleUpdateTable} />
                  <Button title="Delete Table" color="red" onPress={handleDeleteTable} />
                </>
              ) : (
                <Button title="Add Table" onPress={handleAddTable} />
              )}
              <Button title="Cancel" color="grey" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#1976D2',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  tableList: {
    padding: 16,
  },
  tableItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  tableName: {
    fontSize: 16,
  },
  tableGroup: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background with transparency
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TableScreen;