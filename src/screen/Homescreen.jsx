import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ScamAlert</Text>
      <Text style={styles.description}>
      ScamAlert is an application designed to help you report and stay informed about scamsCalls.
        With ScamAlert, you can report scams you encounter, view reports from other users.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center', // Center-align text
    marginBottom: 20,
  },
});

export default HomeScreen;
