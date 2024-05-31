import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { firestore } from '../config/firebaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addSuspiciousContact, addVerifiedContact } from '../utils/firestoreUtils';
import CallLogs from 'react-native-call-log';
import moment from 'moment';

const ContactLogsScreen = () => {
    const [callLogs, setCallLogs] = useState([]);

    useEffect(() => {
        requestCallLogPermission();
    }, []);

    const requestCallLogPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Call Log Permission',
                    message: 'This app needs access to your call logs to display recent calls.',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                fetchCallLogs();
            } else {
                console.error('Call log permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchCallLogs = async () => {
        try {
            const logs = await CallLogs.loadAll();
            setCallLogs(logs);
        } catch (error) {
            console.error('Error fetching call logs:', error);
        }
    };

    const handleLogPress = (phoneNumber) => {
        Alert.alert(
            "Report Call",
            "Mark this call as safe or suspicious?",
            [
                {
                    text: "Safe",
                    onPress: () => markAsSafe(phoneNumber),
                },
                {
                    text: "Suspicious",
                    onPress: () => markAsSuspicious(phoneNumber),
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ],
            { cancelable: true }
        );
    };

    const markAsSafe = async (phoneNumber) => {
        const user = auth().currentUser;
        if (user) {
            try {
                // Check if the number exists in the suspiciousContacts collection
                const suspiciousContactRef = firestore().collection('suspiciousContacts').doc(phoneNumber);
                const suspiciousContactDoc = await suspiciousContactRef.get();

                if (suspiciousContactDoc.exists) {
                    // Remove from suspiciousContacts
                    await suspiciousContactRef.delete();
                }

                // Add to verifiedContacts
                await addVerifiedContact(user.uid, { name: '', phoneNumber: phoneNumber });

                console.log('Number marked as safe');
            } catch (error) {
                console.error('Error marking number as safe:', error);
            }
        }
    };

    const markAsSuspicious = async (phoneNumber) => {
        const user = auth().currentUser;
        if (user) {
            try {
                const verifiedContactRef = firestore().collection('verifiedContacts').doc(phoneNumber);
                const verifiedContactDoc = await verifiedContactRef.get();

                if (verifiedContactDoc.exists) {
                    // Remove from verifiedContacts
                    await verifiedContactRef.delete();
                }

                await addSuspiciousContact(user.uid, phoneNumber);
                console.log('Number marked as suspicious');
            } catch (error) {
                console.error('Error marking number as suspicious:', error);
            }
        }
    };

    const renderCallLogItem = ({ item }) => {
        const formattedDate = moment(item.timestamp, 'x').format('MMM DD, YYYY hh:mm A'); // Using 'x' for Unix timestamp in milliseconds
        return (
          <TouchableOpacity onPress={() => handleLogPress(item.phoneNumber)}>
            <View style={styles.callLogItem}>
              <MaterialIcons name="phone" size={24} color="black" />
              <View style={styles.callLogDetails}>
                <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                <Text style={styles.callType}>{item.callType}</Text>
                <Text style={styles.callDate}>{formattedDate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      };

    return (
        <View style={styles.container}>
            <FlatList
                data={callLogs}
                renderItem={renderCallLogItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    callLogItem: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    callLogDetails: {
        marginLeft: 16,
    },
    phoneNumber: {
        fontSize: 16,
        color: 'darkturquoise',
        fontWeight: 'bold',
    },
    callType: {
        fontSize: 14,
        color: '#666666',
    },
});

export default ContactLogsScreen;

