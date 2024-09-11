import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button, StyleSheet, Alert, Switch, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native'; // For navigation
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store'; // Update this path based on your project structure
import { router } from 'expo-router';
import { addCategory, editCategory, deleteCategory } from '@/redux/slice/menu/categeorySlice';

const CategoryScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const { width, height } = useWindowDimensions(); // Get screen dimensions
  const isPortrait = height > width; // Check if the device is in portrait mode

  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories); // Get categories from Redux store

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isEnabled, setIsEnabled] = useState(false); // For enabling/disabling category

  // Open modal to add a new category
  const openModalForAdd = () => {
    setSelectedCategory(null);
    setCategoryName('');
    setIsEnabled(true);
    setIsModalVisible(true);
  };

  // Open modal to edit a category
  const openModalForEdit = (categoryId: number, categoryName: string, enabled: boolean) => {
    setSelectedCategory(categoryId);
    setCategoryName(categoryName);
    setIsEnabled(enabled);
    setIsModalVisible(true);
  };

  // Add new category with duplicate check
  const handleAddCategory = () => {
    if (categoryName.trim() === '') {
      Alert.alert('Validation', 'Category name cannot be empty.');
      return;
    }

    try {
      dispatch(addCategory({ categoryName, isEnabled, categoryId: Math.floor(Math.random() * 999) }));
      closeModal();
    } catch (error) {
      Alert.alert('Validation', 'Category name already exists.');
    }
  };

  // Update category
  const handleUpdateCategory = () => {
    if (categoryName.trim() === '') {
      Alert.alert('Validation', 'Category name cannot be empty.');
      return;
    }

    if (selectedCategory) {
      dispatch(editCategory({ categoryId: selectedCategory, categoryName, isEnabled }));
      closeModal();
    }
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory({ categoryId: selectedCategory }));
      closeModal();
    }
  };

  // Close modal
  const closeModal = () => {
    setCategoryName('');
    setSelectedCategory(null);
    setIsEnabled(false);
    setIsModalVisible(false);
  };

  // Render category item
  const renderCategoryItem = ({ item }: { item: { categoryId: number; categoryName: string; isEnabled: boolean } }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => openModalForEdit(item.categoryId, item.categoryName, item.isEnabled)}>
      <Text style={styles.categoryName}>{item.categoryName}</Text>
      <Text style={styles.categoryStatus}>{item.isEnabled ? 'Enabled' : 'Disabled'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.navigate('/(drawer)/(settings)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Categories</Text>
        <TouchableOpacity onPress={openModalForAdd} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      {/* List of Categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
      />

      {/* Modal for Adding/Editing Category */}
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
              placeholder="Enter Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />

            {/* Toggle Button for Enabling/Disabling Category */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Enable Category</Text>
              <Switch value={isEnabled} onValueChange={(value) => setIsEnabled(value)} />
            </View>

            <View style={styles.modalButtonContainer}>
              {selectedCategory ? (
                <>
                  <Button title="Update Category" onPress={handleUpdateCategory} />
                  <Button title="Delete Category" color="red" onPress={handleDeleteCategory} />
                </>
              ) : (
                <Button title="Add Category" onPress={handleAddCategory} />
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
  categoryList: {
    padding: 16,
  },
  categoryItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryStatus: {
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CategoryScreen;