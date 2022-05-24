import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import {styles} from './static/styles/mainStyle'
import {Component, useState} from 'react'
import {create_form_data, ajax_handler} from './static/js/ajaxhandler'
import {tryLogin}  from './static/js/loginRegisterScripts'

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
        <Button title="Login" onPress={()=>{tryLogin(this.state.email, this.state.password)}} style={styles.buttonPrimary}/>
        <StatusBar style="auto" />
      </SafeAreaView>

);
  }
}