import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, Touchable, View, Modal, KeyboardAvoidingView, Keyboard } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import {Component, useState} from 'react'
import { ScrollView } from 'react-native-gesture-handler';
export function Register({navigation}){
    const [email, updateEmail] = useState("")
    const [confirmEmail, updateConfirmEmail] = useState("")
    const [password, updatePassword] = useState("")
    const [confirmPassowrd, updateConfirmPassword] = useState("")
    return(
        <SafeAreaView style={styles.safeAreaView} onPress={Keyboard.dismiss}>
          <ScrollView style={{marginHorizontal: 20}}>


          <KeyboardAvoidingView style={styles.safeAreaView}
          behavior={Platform.OS === "ios" ? "paddingBottom" : "height"}>
            <Text style={styles.label}>Username</Text>
            <TextInput onChangeText={(email) => {updateEmail(email)}} style = {styles.input}></TextInput>

            <Text>{"\n"}</Text> 
            <Text style={styles.label}>Email</Text>
            <TextInput onChangeText={(email) => {updateEmail(email)}} style = {styles.input}></TextInput>
            
          
            <Text style={styles.label}>Confirm Email</Text>
            <TextInput onChangeText={(confirmEmail) => {updateConfirmEmail(confirmEmail)}} style = {styles.input}></TextInput>
            
            <Text>{"\n"}</Text>

            <Text style={styles.label}>Password</Text>
            <TextInput onChangeText={(password) => {updatePassword(password)}} style = {styles.input}></TextInput>


            <Text style={styles.label}>Confirm Password</Text>
            <TextInput onChangeText={(confirmPassword) => {confirmPassword(confirmPassword)}} style = {styles.input}></TextInput>
            
            <Button title = "Login" onPress={()=>(console.log(email))}/>
            </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}
const style = {
    centeredView: {
        position: "absolute",
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
        top: '50%',
        width: 100,
        height: 100,
        backgroundColor: 'white'
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
}