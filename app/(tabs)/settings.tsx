import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsComponent from '@/components/Settings/settingTab';
import CategoryManager from '@/components/Settings/menu/categeory';
import { Button, View, TouchableOpacity, Text, Alert } from 'react-native';


const Stack = createStackNavigator();

function SettingTab() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Setting"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="settingTab" 
          component={SettingsComponent} 
          options={{ title: 'Setting', }} 
        />
        <Stack.Screen 
          name="categeory" 
          component={CategoryManager} 
          options={{ 
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Button 1 pressed')}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: '#fff' }}>Button 1</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Button 2 pressed')}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: '#fff' }}>Button 2</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Button 3 pressed')}
                >
                  <Text style={{ color: '#fff' }}>Button 3</Text>
                </TouchableOpacity>
              </View>
            ),
            }}
        />
      </Stack.Navigator>
      </NavigationContainer>
  );
}

export default SettingTab;
