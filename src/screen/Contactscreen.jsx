import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Contacts from 'react-native-contacts';
import {firestore} from '../config/firebaseConfig'
import { auth } from '../config/firebaseConfig';
import { addVerifiedContact } from '../utils/firestoreUtils';

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
      saveContactsToFirestore(phoneContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Error fetching contacts');
    }
  };

  const saveContactsToFirestore = async (contacts) => {
    const user = auth().currentUser;
    if (user) {
      try {
        const batch = firestore().batch();
        const existingContacts = await firestore().collection('verifiedContacts').where('userId', '==', user.uid).get();
        const existingContactNumbers = existingContacts.docs.map(doc => doc.data().phoneNumber);
        contacts.forEach(contact => {
          const contactPhoneNumber = contact.phoneNumbers[0]?.number;
          if (!existingContactNumbers.includes(contactPhoneNumber)) {
            const contactData = {
              name: contact.displayName,
              phoneNumber: contactPhoneNumber,
            };
            const contactRef = firestore().collection('verifiedContacts').doc();
            batch.set(contactRef, { userId: user.uid, ...contactData });
          }
        });
        await batch.commit();
        console.log('Contacts added successfully');
      } catch (error) {
        console.error('Error adding contacts:', error);
      }
    } else {
      console.error('No authenticated user found');
    }
  };

  const handleContactPress = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
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

