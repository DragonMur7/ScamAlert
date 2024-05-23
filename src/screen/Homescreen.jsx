import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [modelRunning, setModelRunning] = useState(false);

  const toggleModel = () => {
    setModelRunning(!modelRunning);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, modelRunning ? styles.buttonActive : null]}
        onPress={toggleModel}
      >
        <Text style={styles.buttonText}>{modelRunning ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonActive: {
    backgroundColor: 'darkturquoise', // Change color to represent model running
  },
});

export default HomeScreen;
