import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native'
import React, { useState, useContext } from 'react';
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import { signUp } from '../auth/auth'; // Ensure this function is correctly set up



const Signup = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name={"user"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Username' />
      </View>
      <View style={styles.inputContainer}>
        <Fontisto name={"locked"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Password' secureTextEntry />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name={"mail"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Email'  />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name={"mobile1"} size={24} color={"gray"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder='Mobile' keyboardType={'numeric'}/>
      </View>
  
      <View style={styles.signInButtonContainer}>
        <Button title='Sign Up' color={"darkturquoise"} style={styles.buttonText} onPress={() => navigation.navigate('Homescreen')} />
      </View>
<View style={styles.footerContainer}>
      <Text style={styles.footerText}>Already Have an Account?</Text>
      <Pressable
        onPress={() => navigation.navigate('Login')} >
        <Text style={styles.footerCreate} >Sign In</Text>
      </Pressable>
</View>
    </View>
  )
}

export default Signup;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,

  },
  createAccountContainer: {
    marginTop: 100,

  },
  createAccountText: {
    textAlign: "center",
    fontSize: 30,
    color: "#262626",
    marginBottom: 30,
    fontWeight:"bold",
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
  signInButtonContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    textAlign: "center",
    borderRadius: 20,
  },
  footerContainer : {
    alignItems:"center",
    marginTop: 100,
  },
  footerText:{
    color:"black",
    fontSize: 15,
  
  },
  footerCreate:{
    color:"darkturquoise",
    textDecorationLine:"underline",
    fontWeight: "500",
    fontSize: 15,

  }

});