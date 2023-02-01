import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, onAuthStateChanged } from "firebase/auth";

//Screens
import HomeScreen from './Screens/HomeScreen';
import ListsScreen from './Screens/ListsScreen';
import SettingsScreen from './Screens/SettingsScreen';
import NewListsScreen from './Screens/NewListsScreen';
import TasksScreen from './Screens/TasksScreen';
import NewTaskScreen from './Screens/NewTaskScreen';
import EditTaskScreen from './Screens/EditTaskScreen';
import EditListScreen from './Screens/EditListScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';

const Tab = createBottomTabNavigator()

const NavigationBar = () => {
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}><StatusBar barStyle='light-content'></StatusBar>
        <Tab.Navigator
          initialRouteName='Home'
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#03EF62',
            tabBarInactiveTintColor: '#fff',
            tabBarStyle: {
              height: 70,
              paddingTop: 15,
              paddingBottom: 5,
              backgroundColor: '#000000',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (rn === 'Lists') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (rn === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} color={color} size={size} />
            },

          })}
        >
          <Tab.Screen name='Home' component={HomeScreen} />
          <Tab.Screen name='Lists' component={ListsScreen} />
          <Tab.Screen name='Settings' component={SettingsScreen} />

        </Tab.Navigator>
      </SafeAreaView>
    </Fragment>
  )
}

const Stack = createStackNavigator();
const auth = getAuth();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='NavigationBar' component={NavigationBar} />
          <Stack.Screen name='NewListsScreen' component={NewListsScreen} />
          <Stack.Screen name='TasksScreen' component={TasksScreen} />
          <Stack.Screen name='NewTaskScreen' component={NewTaskScreen} />
          <Stack.Screen name='EditTaskScreen' component={EditTaskScreen} />
          {/* <Stack.Screen name='EditListScreen' component={EditListScreen} /> */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
          <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}
