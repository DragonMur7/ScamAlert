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
        const verifiedRef = firestore().collection('verifiedContacts').doc(phoneNumber);
        const suspiciousRef = firestore().collection('suspiciousContacts').doc(phoneNumber);
        const scamRef = firestore().collection('scamContacts').doc(phoneNumber);
    
        const [verifiedDoc, suspiciousDoc, scamDoc] = await Promise.all([
          verifiedRef.get(),
          suspiciousRef.get(),
          scamRef.get()
        ]);
    
        if (verifiedDoc.exists) {
          // Check if the call has been marked as suspicious or scam
          if (suspiciousDoc.exists || scamDoc.exists) {
            onIncomingCall(phoneNumber, 'unknown');
          } else {
            onIncomingCall(phoneNumber, 'verified');
          }
        } else if (suspiciousDoc.exists) {
          onIncomingCall(phoneNumber, 'suspicious');
        } else if (scamDoc.exists) {
          onIncomingCall(phoneNumber, 'scam');
        } else {
          onIncomingCall(phoneNumber, 'unknown');
        }
      } catch (error) {
        console.error('Error checking caller number:', error);
      }
    };
  
    return null;
  };
  
  export default CallListener;