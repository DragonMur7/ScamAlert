import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Login from './src/screen/Login';
import Signup from './src/screen/Signup';
import Homescreen from './src/screen/Homescreen';
import Contactscreen from './src/screen/Contactscreen';
import Profilescreen from './src/screen/Profilescreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();
function MainTabNavigator() {
  return (
    <Tab.Navigator
        tabBarOptions={{
        activeTintColor: 'darkturquoise', 
        inactiveTintColor: 'gray', 
      }}
    >
      <Tab.Screen
        name="Home"
        component={Homescreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={"black"} size={25}  />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contactscreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="contacts" color={"black"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profilescreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" color={"black"} size={25} />
          ),
        }} />
    </Tab.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Homescreen" component={MainTabNavigator} />
      </Stack.Navigator>



    </NavigationContainer>
  )
}

export default App



