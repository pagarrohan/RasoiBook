import realm from '@/components/realm';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';




const CRUDComponent = () => {
  
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Load items from Realm when the component mounts
  useEffect(() => {
    const items = realm.objects('Item').sorted('id', true);
    setItems([...items]);
  }, []);

  // Function to add a new item
  const addItem = () => {
    if (name.trim().length === 0) return;

    realm.write(() => {
      const newItem = {
        id: realm.objects('Item').length + 1,
        name,
      };
      realm.create('Item', newItem);
    });

    setItems([...realm.objects('Item').sorted('id', true)]);
    setName('');
  };

  // Function to update an existing item
  const updateItem = () => {
    if (!selectedItemId || name.trim().length === 0) return;

    realm.write(() => {
      let itemToUpdate = realm.objectForPrimaryKey('Item', selectedItemId);
      itemToUpdate.name = name;
    });

    setItems([...realm.objects('Item').sorted('id', true)]);
    setName('');
    setSelectedItemId(null);
  };

  // Function to delete an item
  const deleteItem = (id) => {
    realm.write(() => {
      let itemToDelete = realm.objectForPrimaryKey('Item', id);
      realm.delete(itemToDelete);
    });

    setItems([...realm.objects('Item').sorted('id', true)]);
  };

  // Function to handle the selection of an item for updating
  const selectItem = (item) => {
    setName(item.name);
    setSelectedItemId(item.id);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      <Button
        title={selectedItemId ? "Update Item" : "Add Item"}
        onPress={selectedItemId ? updateItem : addItem}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => selectItem(item)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
});

export default CRUDComponent;
