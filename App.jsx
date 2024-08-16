import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { firebase } from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';
import Login from './src/screen/Login';
import Signup from './src/screen/Signup';
import HomeScreen from './src/screen/Homescreen';
import ContactScreen from './src/screen/Contactscreen';
import ProfileScreen from './src/screen/Profilescreen';
import CallListener from './src/components/CallListener';
import CallerScreen from './src/screen/CallerScreen';
import ReportScreen from './src/screen/ReportScreen';
import ContactLogsScreen from './src/screen/ContactLogScreen';
import ChatScreen from './src/screen/ChatScreen';
import ForgetPassword from './src/screen/ForgotPassword';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'darkturquoise',
      tabBarInactiveTintColor: 'gray',
    }}>
     
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen
        name="ContactLogs"
        component={ContactLogsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="clockcircleo" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="contacts" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="exclamationcircle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="wechat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" color={color} size={size}  />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingNumber, setIncomingNumber] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    SplashScreen.hide();
    const timer = setTimeout(() => setLoading(false), 2000);

    const unsubscribe = firebase.auth().onAuthStateChanged(user => setUser(user));

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleIncomingCall = (number, result) => {
    setIncomingNumber(number);
    setVerificationResult(result);
  };

  const closeCallerScreen = () => {
    setIncomingNumber(null);
    setVerificationResult(null);
  };

  return (
    <NavigationContainer>
      <CallListener onIncomingCall={handleIncomingCall} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {incomingNumber && verificationResult ? (
          <Stack.Screen name="CallerScreen">
            {props => (
              <CallerScreen
                {...props}
                incomingNumber={incomingNumber}
                verificationResult={verificationResult}
                onClose={closeCallerScreen}
              />
            )}
          </Stack.Screen>
        ) : user ? (
          <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
