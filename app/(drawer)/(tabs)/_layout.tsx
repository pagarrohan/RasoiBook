import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { DrawerToggleButton } from '@react-navigation/drawer';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: true,
      headerLeft:()=><DrawerToggleButton></DrawerToggleButton>
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: '',
        headerStyle: {
          height:60,
          // Change the background color
        },
       
        headerShown: true,
        tabBarIcon: ({ color }) => <TabBarIcon name="cutlery" color={'green'} />,
        headerRight: () => (
          <Link href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <View style={{display:'flex',flexDirection:'row'}}>
                 
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
                </View>
                
              )}
            </Pressable>
          </Link>
        ),
      }}
    />
      <Tabs.Screen
    name="order"
    options={({ navigation }) => ({
      title: 'Quick',
      headerTitle: '', // Removes the title from the header
      headerShown: false,
      // headerLeft: () => (
      //   <Pressable onPress={() => navigation.goBack()}>
      //     <FontAwesome
      //       name="arrow-left"
      //       size={12}
      //       color={Colors[colorScheme ?? 'light'].text}
      //       style={{ marginLeft: 15 }}
      //     />
      //   </Pressable>
      // ),
      
      tabBarStyle: { display: 'none' }, // Hides the tab bar on this screen
      tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={'orange'} />,
    })}
  />
    <Tabs.Screen
      name="settings"
      options={{
        title: 'Setting',
        headerShown: true,
        tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={'pink'} />,
      }}
    />
    <Tabs.Screen
      name="print"
      options={{
        title: 'Print',
        headerShown: true,
        tabBarIcon: ({ color }) => <TabBarIcon name="print" color={'yellow'} />,
      }}
    />
     <Tabs.Screen
      name="socket"
      options={{
        title: 'Socket',
        headerShown: false,
        tabBarIcon: ({ color }) => <TabBarIcon name="wifi" color={'blue'} />,
      }}
    />
  </Tabs>
  
  );
}
