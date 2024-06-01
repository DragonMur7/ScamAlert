import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig'; // Make sure the path is correct


const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          setUserEmail(currentUser.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User logged out successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleContactUs = () => {
    // Show an alert with relevant information
    Alert.alert(
      'Contact Us',
      'Email: scamalert@gmail.com', // Update with relevant information
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userEmail}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContactUs}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Set heading color to black
  },
  profileInfo: {
    marginBottom: 40,
  },
  label: {
    color : 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row', // Set buttons in one row
    justifyContent: 'space-between', // Space between buttons
    marginTop: 100,
  },
  button: {
    backgroundColor: 'darkturquoise',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    flex: 1, // Equal width for both buttons
    marginRight: 10, // Add margin between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});