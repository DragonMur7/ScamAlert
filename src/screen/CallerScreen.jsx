// src/screens/CallerScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

const CallerScreen = ({ incomingNumber, verificationResult, onClose }) => {
    let message;
    let backgroundColor;
  
    if (verificationResult === 'verified') {
      message = 'Verified Contact';
      backgroundColor = 'mediumturquoise';
    } else if (verificationResult === 'suspicious') {
      message = 'Suspicious Call!';
      backgroundColor = 'lightyellow';
    } else if (verificationResult === 'scam') {
      message = 'Scam Call!';
      backgroundColor = 'lightred';
    } else {
      message = 'Unknown Contact';
      backgroundColor = 'lightgray';
    }
  
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Close the screen after 5 seconds
  
      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }, [onClose]);
  
    return (
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={[styles.container, { backgroundColor }]}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.number}>{incomingNumber}</Text>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    number: {
      fontSize: 18,
      textAlign: 'center',
    },
  });
  
  export default CallerScreen;
