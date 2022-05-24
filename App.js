import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import {styles} from './static/styles/mainStyle'
import {Component, useState} from 'react'
import {create_form_data, ajax_handler} from './static/js/ajaxhandler'

function validateEmail(email){
  if (!email.includes('@')) return false //if no @ symbol, cant be an email

  let emailParts = email.split('@');
  
  if (emailParts.length > 2) return false

  if ((emailParts[0].length == 0) || (emailParts[1].length == 0)) return false

  return true
}

function validatePassword(password){
  const BANNED_CHARS = /[ ]/gmi //REGEX for banned characters (currently space)
  if (password.length < 8) return false

  /*const bannedCharsFound = password.match(BANNED_CHARS)
  console.log(bannedCharsFound)
  bannedCharsFound = []
  if (bannedCharsFound.length !== 0) return false
  */
  return true
}

function validateLogin(email, password){
  const validEmail = validateEmail(email);
  const validPassword = validatePassword(password);
  if (validEmail && validPassword){
    const loginInfo = {'email':email, 'password':password}
    console.log(loginInfo)
    ajax_handler('http://dylansoll.pythonanywhere.com/login', console.log, create_form_data(loginInfo))
  }
}

export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      "email": "",
      "password": "",
    };
  }
  

  render(){
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.pageHeading} onPress = {()=>{console.log(window.newVar)}}>{"\n"}Login</Text>
      
        <Text style={styles.text}>{"\n"}Email</Text>
        <TextInput style = {styles.input} onChangeText={(email)=> {this.state.email = email}} nativeID={'emailLogin'} />

        <Text style={styles.text}>{"\n"}Password</Text>
        <TextInput style = {styles.input} onChangeText={(password)=> {this.state.password = password}} nativeID={'passwordLogin'}
        secureTextEntry={true}/>
        <Button title="Login" onPress={()=>{validateLogin(this.state.email, this.state.password)}} style={styles.buttonPrimary}/>
        <StatusBar style="auto" />
      </SafeAreaView>

);
  }
}