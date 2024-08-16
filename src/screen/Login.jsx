import { StyleSheet, Text, View, ScrollView, TextInput, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { firebase } from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('User logged in successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabNavigator' }],
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Sign In to Your Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Your Email"
          value={email}
          onChangeText={setEmail}
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot your Password?</Text>
      </Pressable>
      <View style={styles.signInButtonContainer}>
        <Button title="Sign In" color="darkturquoise" onPress={handleLogin} />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't Have an Account?</Text>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerCreate}>Create</Text>
        </Pressable>
      </View>
      <View style={{ marginBottom: 100 }} />
    </ScrollView>
  );
};


export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: 'center',
  },
  welcomeContainer: {
    marginTop: 200,
  },
  welcomeText: {
    textAlign: "center",
    color: "black",
    fontWeight: "500",
    fontSize: 70,
  },
  signInText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 30,
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
  forgotPasswordText: {
    color: "black",
    textAlign: "right",
    marginRight: 40,
    fontSize: 15,
  },
  signInButtonContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    textAlign: "center",
    borderRadius: 20,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 100,
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