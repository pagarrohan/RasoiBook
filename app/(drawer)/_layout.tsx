
import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default function Layout() {

    function DrawerIcon(props: {
        name: React.ComponentProps<typeof FontAwesome>['name'];
        color: string;
    }) {
        return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
    }

    const CustomDrawerComponent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItem  onPress={()=>{router.navigate('/(drawer)/dashboard')}} label='Dashboard' icon={(props) => (<DrawerIcon color='olive' name='home' />)}></DrawerItem>
                <DrawerItem onPress={() => { router.push('/(drawer)/(settings)') }} label='Settings' icon={(props) => (<DrawerIcon color='olive' name='gear' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Pay In/Out' icon={(props) => (<DrawerIcon color='olive' name='exchange' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Expenses' icon={(props) => (<DrawerIcon color='olive' name='money' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Customer' icon={(props) => (<DrawerIcon color='olive' name='address-card' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Pay Later' icon={(props) => (<DrawerIcon color='olive' name='file' />)}></DrawerItem>
                <DrawerItem onPress={() => {router.navigate('/(drawer)/(settings)') }} label='Receipt' icon={(props) => (<DrawerIcon color='olive' name='bars' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Company Report' icon={(props) => (<DrawerIcon color='olive' name='building' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Database' icon={(props) => (<DrawerIcon color='olive' name='database' />)}></DrawerItem>
                <DrawerItem onPress={() => { Alert.alert("Hi from drawer") }} label='Logout' icon={(props) => (<DrawerIcon color='olive' name='power-off' />)}></DrawerItem>
            </DrawerContentScrollView>
        )
    }


    return (
        <Drawer  drawerContent={(props) => <CustomDrawerComponent {...props}  />}screenOptions={{headerShown:false,title:''}}/>
    )
}