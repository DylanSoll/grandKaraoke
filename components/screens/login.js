import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import {Component, useState} from 'react'
import {tryLogin} from '../../static/js/loginRegisterScripts'
import Spinner from 'react-native-loading-spinner-overlay';

export function Login({navigation}){
    const [email, updateEmail]= useState("")
    const [password, updatePassword]= useState("")
    const [spinnerWheel, updateWheel] = useState(false) 

    return(
      <SafeAreaView style={styles.safeAreaView}>
        <Spinner
            visible={false}
            textContent={'Logging In'}
            textStyle={{color: 'white'}}
            animation = "slide"
          />
        <Text style={styles.pageHeading} onPress = {()=>{console.log(window.newVar)}}>{"\n"}Login</Text>
    
        <Text style={styles.text}>{"\n"}Email</Text>
        <TextInput style = {styles.input} onChangeText={(emailInput)=> {updateEmail(emailInput)}}  />
    
        <Text style={styles.text}>{"\n"}Password</Text>
        <TextInput style = {styles.input} onChangeText={(passwordInput)=> {updatePassword(passwordInput)}}
        secureTextEntry={true}/>
        <Button title="Login" onPress={()=>{updateWheel(true)/*tryLogin(email, password)*/}} style={styles.buttonPrimary}/>
        <Button title = "Register Instead"  style = {styles.buttonSmall}
        onPress={()=>(navigation.navigate('Register'))}/>
        <StatusBar style="auto" />
    </SafeAreaView>
    )
  }