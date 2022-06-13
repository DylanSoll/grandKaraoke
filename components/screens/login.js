import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, Keyboard, ScrollView } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import { useState} from 'react'
import {validateLoginDetails, tryLogin, checkEmailForColourChange, checkPasswordForColourChange} from '../../static/js/loginRegisterScripts'
import Spinner from 'react-native-loading-spinner-overlay';
import CustomButton from '../customElements/customButton';
export function Login({navigation}){
    const [email, updateEmail]= useState("")
    const [password, updatePassword]= useState("")
    const [disableLoginButton, updateAllowLogin] = useState(true)
    const [validEmailState, updateEmailState] = useState('#353535')
    const [validPasswordState, updatePasswordState] = useState('#353535')

    return(
      <SafeAreaView style={styles.safeAreaView} onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ justifyContent: "space-around"}}>
        <Spinner
            visible={false}
            textContent={'Logging In'}
            textStyle={{color: 'white'}}
            animation = "slide"
          />
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.text}>{"\n"}Email</Text>
        </View>

        
        <TextInput style = {[styles.input, {backgroundColor:validEmailState}]} onChangeText={(emailInput)=> {
          updateEmail(emailInput);
          updateEmailState(checkEmailForColourChange(emailInput));
          updateAllowLogin(! validateLoginDetails(email, password));
          }}  />
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.text}>{"\n"}Password</Text>
        </View>
        
        <TextInput style = {[styles.input, {backgroundColor:validPasswordState}]}onChangeText={(passwordInput)=> {
          updatePassword(passwordInput);
          updatePasswordState(checkPasswordForColourChange(passwordInput));

          updateAllowLogin(! validateLoginDetails(email, password));
        }}
        secureTextEntry={true}/>

        <CustomButton onPress={()=>(tryLogin(email, password))} label={"Login"} disabled = {disableLoginButton} fontSize={22.5}/>
        <CustomButton onPress={()=>(navigation.navigate('Register'))} label={"Register Instead"} fontSize={15}/>


        <StatusBar style="auto" />
        </ScrollView>
    </SafeAreaView>
    )
  }