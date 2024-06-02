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
  
      const verifiedRef = firestore().collection('verifiedContacts');
      const verifiedSnapshot = await verifiedRef.get();
  
      console.log('Verified contacts snapshot:', verifiedSnapshot.docs.map(doc => doc.data()));
  
      const suspiciousRef = firestore().collection('suspiciousContacts').doc(phoneNumber);
      const scamRef = firestore().collection('scamContacts').doc(phoneNumber);
      
      console.log('Fetching suspicious document:', phoneNumber);
      const [verifiedDoc, suspiciousDoc, scamDoc] = await Promise.all([
        verifiedRef.doc(phoneNumber).get(),
        suspiciousRef.get(),
        scamRef.get()
      ]);
    
      console.log('Verified document:', verifiedDoc.data());
      console.log('Suspicious document:', suspiciousDoc.data());
      console.log('Scam document:', scamDoc.data());
    
      if (verifiedDoc.exists) {
        // Check if the call has been marked as suspicious or scam
        if (suspiciousDoc.exists || scamDoc.exists) {
          console.log('Call status: unknown, Contact Name:', verifiedDoc.data().name);
          onIncomingCall(phoneNumber, 'unknown');
        } else {
          console.log('Call status: verified, Contact Name:', verifiedDoc.data().name);
          onIncomingCall(phoneNumber, 'verified');
        }
      } else if (suspiciousDoc.exists) {
        console.log('Call status: suspicious');
        onIncomingCall(phoneNumber, 'suspicious');
      } else if (scamDoc.exists) {
        console.log('Call status: scam');
        onIncomingCall(phoneNumber, 'scam');
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