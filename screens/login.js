import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { styles } from '../static/styles/mainStyle';
import {Component, useState} from 'react'
import {tryLogin} from '../static/js/loginRegisterScripts'
export function Login({navigation}){
    const [email, updateEmail]= useState("")
    const [password, updatePassword]= useState("")
    return(
      <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.pageHeading} onPress = {()=>{console.log(window.newVar)}}>{"\n"}Login</Text>
  
      <Text style={styles.text}>{"\n"}Email</Text>
      <TextInput style = {styles.input} onChangeText={(emailInput)=> {updateEmail(emailInput)}} nativeID={'emailLogin'} />
  
      <Text style={styles.text}>{"\n"}Password</Text>
      <TextInput style = {styles.input} onChangeText={(passwordInput)=> {updatePassword(passwordInput)}} nativeID={'passwordLogin'}
      secureTextEntry={true}/>
      <Button title="Login" onPress={()=>{tryLogin(email, password)}} style={styles.buttonPrimary}/>
      <Button title = "Register Instead"  style = {styles.buttonSmall}
      onPress={()=>(navigation.navigate('Register'))}/>
      <StatusBar style="auto" />
    </SafeAreaView>
    )
  }