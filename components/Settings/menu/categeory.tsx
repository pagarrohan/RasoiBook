import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Switch, StyleSheet } from 'react-native';

export default function CategoryManager() {
    const [categories, setCategories] = useState([
        { key: 'Salads' },
        { key: 'Sandwiches' },
        { key: 'Main' },
        { key: 'Appetizers' },
        { key: 'Sweets' },
        { key: 'Drinks' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const addCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, { key: newCategory.trim(), enabled: isEnabled }]);
            setNewCategory('');
            setIsEnabled(false);
            setModalVisible(false);
        }
    };

    const deleteAllCategories = () => {
        setCategories([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.backArrow}>&larr;</Text>
                <Text style={styles.title}>Category</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
                        <Text style={styles.iconSymbol}>+</Text>
                        <Text style={styles.iconLabel}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteAllCategories} style={styles.iconButton}>
                        <Text style={styles.iconSymbol}>×</Text>
                        <Text style={styles.iconLabel}>Delete All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
                        <Text style={styles.iconSymbol}>↑</Text>
                        <Text style={styles.iconLabel}>Import</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
                        <Text style={styles.iconSymbol}>↓</Text>
                        <Text style={styles.iconLabel}>Export</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={categories}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <Text style={styles.categoryText}>{item.key}</Text>
                        <Text style={styles.dragHandle}>≡</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Modal for adding category */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add Category</Text>
                        <View style={styles.modalContent}>
                            <View style={styles.switchContainer}>
                                <Text>Enabled</Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                    onValueChange={setIsEnabled}
                                    value={isEnabled}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={newCategory}
                                onChangeText={setNewCategory}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={addCategory}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3f51b5',
        padding: 10,
        borderRadius: 5,
    },
    backArrow: {
        fontSize: 24,
        color: 'white',
    },
    title: {
        fontSize: 20,
        color: 'white',
        flex: 1,
        textAlign: 'center',
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        alignItems: 'center',
        marginLeft: 15,
    },
    iconSymbol: {
        fontSize: 20,
        color: 'white',
    },
    iconLabel: {
        color: 'white',
        fontSize: 12,
        marginTop: 2,
        textAlign: 'center',
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 18,
    },
    dragHandle: {
        fontSize: 20,
        color: '#888',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#ff8c00',
    },
    modalContent: {
        width: '100%',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#ff4500',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
