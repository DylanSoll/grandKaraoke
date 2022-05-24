import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import {styles} from './static/styles/mainStyle'
import {Component} from 'react'
window.newVar = "test"

export default function App() {
  const handleLogin = () => console.log("Text pressed")
  return (
        <SafeAreaView style={styles.safeAreaView}>
          <Text style={styles.pageHeading} onPress = {()=>{console.log(window.newVar)}}>{"\n"}Login</Text>
        
          <Text style={styles.text}>{"\n"}Email</Text>
          <TextInput style = {styles.input} onChangeText={(text)=> {console.log(text)}} nativeID={'emailLogin'} />

          <Text style={styles.text}>{"\n"}Password</Text>
          <TextInput style = {styles.input} onChangeText={(text)=> {console.log(text)}} nativeID={'passwordLogin'}
          secureTextEntry={true}/>
          <Button title="Login" onPress={handleLogin} style={styles.buttonPrimary}/>
          <StatusBar style="auto" />
        </SafeAreaView>

  );
}

