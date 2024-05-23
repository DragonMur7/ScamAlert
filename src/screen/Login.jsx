import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native'
import React, { useState, useContext } from 'react';

import { signIn } from './auth';
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import HomeScreen from './Homescreen';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Sign In to Your Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name={"user"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Enter Your UserName' />
      </View>
      <View style={styles.inputContainer}>
        <Fontisto name={"locked"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Password' secureTextEntry />
      </View>
      <Text style={styles.forgotPasswordText}>Forgot your Password?</Text>
      <View style={styles.signInButtonContainer}>
        <Button title='Sign In' color={"darkturquoise"} style={styles.buttonText} onPress={() => navigation.navigate('Homescreen')} />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't Have an Account?</Text>
        <Pressable
          onPress={() => navigation.navigate('Signup')} >
          <Text style={styles.footerCreate} >Create</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Login;


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,

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
  },
  forgotPasswordText: {
    color: "black",
    textAllign: "right",
    marginLeft: 210,
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


  }

});