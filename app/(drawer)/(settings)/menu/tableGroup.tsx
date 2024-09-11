import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native'; // For navigation
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store'; // Update this path based on your project structure
import { addGroup, editGroup, deleteGroup} from '@/redux/slice/table/tableGroupSlice';
import { router } from 'expo-router';

deleteGroup
const TableGroupScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const { width, height } = useWindowDimensions(); // Get screen dimensions
  const isPortrait = height > width; // Check if the device is in portrait mode

  const dispatch = useDispatch();
  const tableGroups = useSelector((state: RootState) => state.tableGroups); // Get table groups from Redux store

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTableGroup, setSelectedTableGroup] = useState<number | null>(null);
  const [groupName, setGroupName] = useState('');

  // Open modal to add a new table group
  const openModalForAdd = () => {
    setSelectedTableGroup(null);
    setGroupName('');
    setIsModalVisible(true);
  };

  // Open modal to edit a table group
  const openModalForEdit = (groupId: number, groupName: string) => {
    setSelectedTableGroup(groupId);
    setGroupName(groupName);
    setIsModalVisible(true);
  };

  // Add new table group
  const handleAddGroup = () => {
    if (groupName.trim() === '') {
      Alert.alert('Validation', 'Table group name cannot be empty.');
      return;
    }

    dispatch(addGroup({ groupName ,groupId: Math.floor(Math.random()*999)}));
    closeModal();
  };

  // Update table group
  const handleUpdateGroup = () => {
    if (groupName.trim() === '') {
      Alert.alert('Validation', 'Table group name cannot be empty.');
      return;
    }

    if (selectedTableGroup) {
      dispatch(editGroup({ groupId: selectedTableGroup, groupName }));
      closeModal();
    }
  };

  // Delete table group
  const handleDeleteGroup = () => {
    if (selectedTableGroup) {
      dispatch(deleteGroup({ groupId: selectedTableGroup }));
      closeModal();
    }
  };

  // Close modal
  const closeModal = () => {
    setGroupName('');
    setSelectedTableGroup(null);
    setIsModalVisible(false);
  };

  // Render table group item
  const renderTableGroupItem = ({ item }: { item: { groupId: number; groupName: string } }) => (
    <TouchableOpacity style={styles.tableGroupItem} onPress={() => openModalForEdit(item.groupId, item.groupName)}>
      <Text style={styles.tableGroupName}>{item.groupName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.navigate('/(drawer)/(settings)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Table Groups</Text>
        <TouchableOpacity onPress={openModalForAdd} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Table Group</Text>
        </TouchableOpacity>
      </View>

      {/* List of Table Groups */}
      <FlatList
        data={tableGroups}
        keyExtractor={(item) => item.groupId}
        renderItem={renderTableGroupItem}
        contentContainerStyle={styles.tableGroupList}
      />

      {/* Modal for Adding/Editing Table Group */}
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
              placeholder="Enter Table Group Name"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtonContainer}>
              {selectedTableGroup ? (
                <>
                  <Button title="Update Group" onPress={handleUpdateGroup} />
                  <Button title="Delete Group" color="red" onPress={handleDeleteGroup} />
                </>
              ) : (
                <Button title="Add Group" onPress={handleAddGroup} />
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
    fontSize: 16,
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
  tableGroupList: {
    padding: 16,
  },
  tableGroupItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  tableGroupName: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default TableGroupScreen;