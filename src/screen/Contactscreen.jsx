import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts App',
          message: 'Contacts App needs access to your contacts to display them.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        fetchContacts();
      } else {
        setError('Permission denied');
      }
    } catch (err) {
      console.warn(err);
      setError('Error requesting permission');
    }
  };

  const fetchContacts = async () => {
    try {
      const phoneContacts = await Contacts.getAll();
      setContacts(phoneContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Error fetching contacts');
    }
  };

  const handleContactPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleContactPress(item.phoneNumbers[0]?.number)}>
      <View style={styles.contactItem}>
        <Text style={styles.contactName}>{item.displayName}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumbers[0]?.number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : permissionGranted ? (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.recordID}
          style={styles.contactList}
        />
      ) : (
        <Text style={styles.permissionText}>Please grant permission to access contacts</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  contactList: {
    width: '100%',
  },
  contactItem: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: 'darkturquoise',
  },
});

export default ContactScreen;

