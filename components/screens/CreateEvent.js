import React from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard  } from 'react-native';
import {styles} from '../../static/styles/mainStyle'
export function CreateEvent({navigation}){
  return(
      <SafeAreaView style={styles.safeAreaView} onPress={Keyboard.dismiss}>
        

        <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"+100}
    style={{flex:1}}
  >
    <ScrollView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.keyboardAvoidingInner}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>Username</Text>
              </View>
            
              <TextInput onChangeText={(email) => {updateEmail(email)}} style = {styles.input}></TextInput>

              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>{"\n"}Email</Text>
              </View>
              <TextInput onChangeText={(email) => {updateEmail(email)}} style = {styles.input}></TextInput>
              
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>Confirm Email</Text>

              </View>
              <TextInput onChangeText={(confirmEmail) => {updateConfirmEmail(confirmEmail)}} style = {styles.input}></TextInput>
              
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>{"\n"}Password</Text>
              </View>
              <TextInput onChangeText={(password) => {updatePassword(password)}} style = {styles.input}></TextInput>

              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>Confirm Password</Text>
              </View>
              
              <TextInput onChangeText={(confirmPassword) => {updateConfirmPassword(confirmPassword)}} style = {styles.input}></TextInput>
              
              <Button title = "Register" onPress={()=>(console.log(email))}/>
              <Button title = "Login Instead" onPress={()=>(navigation.navigate('Login'))}/>
      </View>
    </TouchableWithoutFeedback>
    </ScrollView>
  </KeyboardAvoidingView>

      </SafeAreaView>
      
  )
}


