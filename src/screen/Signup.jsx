import { StyleSheet,ScrollView, Text, View, TextInput, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { auth } from '../config/firebaseConfig';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('User registered successfully!');
      navigation.navigate('Login');
    } catch (error) {
      setError(error.message);
    }
  };
  return (
<ScrollView contentContainerStyle={styles.container}>
      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Fontisto name="locked" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="phone" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Mobile"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.signInButtonContainer}>
        <Button title="Sign Up" color="darkturquoise" onPress={handleSignup} />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already Have an Account?</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerCreate}>Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: 'center',
  },
  createAccountContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    alignItems: "center",
    height: 50,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  signInButtonContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "black",
    fontSize: 15,
  },
  footerCreate: {
    color: "darkturquoise",
    textDecorationLine: "underline",
    fontWeight: "500",
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
