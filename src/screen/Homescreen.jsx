// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button,TouchableOpacity, Linking } from 'react-native';

const HomeScreen = () => {
  const handleDialerButtonPress = () => {
    Linking.openURL('tel:+080055055');
  };

  const handleComplaintButtonPress = () => {
    Linking.openURL('https://complaint.pta.gov.pk/RegisterComplaint');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preventive Actions Against Scam Calls</Text>
      <Text style={[styles.heading, styles.blackText]}>Protect Yourself</Text>
      <Text style={styles.content}>
        - Do not open suspicious texts or click on links.{"\n"}
        - Scammers target people of all backgrounds, ages, and income levels across Pakistan.{"\n"}
        - Scammers create believable stories that may convince you to give them more money or personal details.{"\n"}
        - Warn friends and family about scams.{"\n"}
        - Stop sending money if you're unsure.{"\n"}
      </Text>
      <Text style={[styles.heading, styles.blackText]}>Report Scams</Text>
      <Text style={styles.content}>
        - Report scam numbers to service providers.{"\n"}
        - Report to PTA: 0800-55055 or online.{"\n"}
        - PTA will block numbers and devices.{"\n"}
        - Contact State Bank for financial frauds.{"\n"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDialerButtonPress}>
          <Text style={styles.buttonText}>Dial 0800-55055</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleComplaintButtonPress}>
          <Text style={styles.buttonText}>Register Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  content: {
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Adjust the spacing between buttons
    marginTop: 24,
  },
  button: {
    backgroundColor: 'darkturquoise',
    paddingVertical: 8,
    paddingHorizontal: 4, // Adjust button padding
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center', // Center the text horizontally
    justifyContent: 'center', // Center the text vertically
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  blackText: {
    color: '#000',
  },
});

export default HomeScreen;