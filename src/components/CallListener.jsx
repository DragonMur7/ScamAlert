import React, { useEffect } from 'react';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import { firestore } from '../config/firebaseConfig';
import CallDetectorManager from 'react-native-call-detection';

const CallListener = ({ onIncomingCall }) => {
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            {
              title: 'Phone State Permission',
              message: 'This app needs access to your phone state in order to detect incoming calls.',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('Permission denied');
            return;
          }
        } catch (error) {
          console.error('Error requesting permission:', error);
          return;
        }
      }

      // Start listening for incoming calls
      startCallListener();
    };

    checkPermissions();

    return () => {
      stopCallListener();
    };
  }, []);

  const startCallListener = () => {
    const callDetector = new CallDetectorManager((event, phoneNumber) => {
      if (event === 'Incoming') {
        console.log('Incoming call detected:', phoneNumber);
        checkCallerNumber(phoneNumber, onIncomingCall);
      }
    }, true, () => {}, {
      title: 'Phone Call State',
      message: 'Please accept the permission to monitor your phone call state.',
    });
  };

  const stopCallListener = () => {
    DeviceEventEmitter.removeAllListeners('PhoneCallStateChange');
  };

  const checkCallerNumber = async (phoneNumber, onIncomingCall) => {
    try {
      console.log('Checking caller number:', phoneNumber);
  
      // Create references to the collections and documents
      const verifiedRef = firestore().collection('verifiedContacts').doc(phoneNumber);
      const suspiciousRef = firestore().collection('suspiciousContacts').doc(phoneNumber);
      const scamRef = firestore().collection('scamContacts').doc(phoneNumber);
  
      console.log('Fetching documents:', phoneNumber);
      
      // Fetch all documents in parallel
      const [verifiedDoc, suspiciousDoc, scamDoc] = await Promise.all([
        verifiedRef.get(),
        suspiciousRef.get(),
        scamRef.get()
      ]);
  
      // Log fetched documents for debugging
      console.log('Verified document:', verifiedDoc.data());
      console.log('Suspicious document:', suspiciousDoc.data());
      console.log('Scam document:', scamDoc.data());
  
      // Prioritize scam and suspicious contacts over verified contacts
      if (scamDoc.exists) {
        console.log('Call status: scam');
        onIncomingCall(phoneNumber, 'scam');
      } else if (suspiciousDoc.exists) {
        console.log('Call status: suspicious');
        onIncomingCall(phoneNumber, 'suspicious');
      } else if (verifiedDoc.exists) {
        console.log('Call status: verified, Contact Name:', verifiedDoc.data().name);
        onIncomingCall(phoneNumber, 'verified');
      } else {
        console.log('Call status: unknown');
        onIncomingCall(phoneNumber, 'unknown');
      }
    } catch (error) {
      console.error('Error checking caller number:', error);
    }
  };
  return null;
};

export default CallListener;