import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Using Ionicons for back icon
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';  // Use typed hooks
import { increment, decrement, incrementByAmount } from '../../redux/slice/someSlice';

function CustomDrawerHeader({ title }) {


    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const dashboard = () => {

    const value = useAppSelector((state) => state.some.value);
    const dispatch = useAppDispatch();


    return (
        <SafeAreaView>
            <View>
                <CustomDrawerHeader title={"Dashboard"}></CustomDrawerHeader>
                <Text>dashboard</Text>
            </View>
            <View>
                <Text>Value: {value}</Text>
                <Button title="Increment" onPress={() => dispatch(increment())} />
                <Button title="Decrement" onPress={() => dispatch(decrement())} />
                <Button title="Increment by 5" onPress={() => dispatch(incrementByAmount(5))} />
            </View>
        </SafeAreaView>
    )
}

export default dashboard

