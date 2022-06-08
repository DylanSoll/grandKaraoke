import { Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import {useState} from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../customElements/customButton';
import { validateRegisterDetails,tryRegister, 
  checkRegEmailForColourChange, checkUsernameForColourChange, matchEmailForColourChange, matchPasswordForColourChange, checkRegPasswordForColourChange 
} from '../../static/js/loginRegisterScripts';
export function Register({navigation}){
  const [username, updateUsername] = useState("")
  const [email, updateEmail] = useState("")
  const [confirmEmail, updateConfirmEmail] = useState("")
  const [password, updatePassword] = useState("")
  const [confirmPassword, updateConfirmPassword] = useState("")

  const [validUsername, updateValidUsername] = useState("#353535")
  const [validEmail, updateValidEmail] = useState("#353535")
  const [validConfirmEmail, updateValidConfirmEmaill] = useState("#353535")
  const [validPassword, updateValidPassword] = useState("#353535")
  const [validConfirmPassword, updateValidConfirmPassword] = useState("#353535")

  const [allowRegister, updateRegister] = useState(true)
  return(
      <SafeAreaView style={styles.safeAreaView} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView>
          <ScrollView automaticallyAdjustKeyboardInsets = {true} >
           <View style={styles.keyboardAvoidingInner}  onPress={Keyboard.dismiss}>
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.label}>Username</Text>
            </View>
          
            <TextInput onChangeText={(inputUsername) => {
              updateUsername(inputUsername);
              updateValidUsername(checkUsernameForColourChange(inputUsername));

              updateRegister(! validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
              }} style = {[styles.input, {backgroundColor:validUsername}]}></TextInput>

            <View style={{alignSelf: 'center'}}>
              <Text style={styles.label}>{"\n"}Email</Text>
            </View>
            <TextInput onChangeText={(inputEmail) => {
              updateEmail(inputEmail);
              updateValidEmail(checkRegEmailForColourChange(inputEmail));
              updateValidConfirmEmaill(matchEmailForColourChange(inputEmail, confirmEmail));
              updateRegister(! validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));}} 
              style = {[styles.input, {backgroundColor:validEmail}]}></TextInput>
            
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.label}>Confirm Email</Text>

            </View>
            <TextInput onChangeText={(inputConfirmEmail) => {
              updateConfirmEmail(inputConfirmEmail);
              updateValidEmail(checkRegEmailForColourChange(email));
              updateValidConfirmEmaill(matchEmailForColourChange(email, inputConfirmEmail));
              updateRegister(! validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
              }} style = {[styles.input, {backgroundColor:validConfirmEmail}]}></TextInput>
            
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.label}>{"\n"}Password</Text>
            </View>
            <TextInput onChangeText={(inputPassword) => {
              updatePassword(inputPassword);
              updateValidPassword(checkRegPasswordForColourChange(inputPassword));
              updateValidConfirmPassword(matchPasswordForColourChange(inputPassword, confirmPassword));
              updateRegister(validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
              }} style = {[styles.input, {backgroundColor:validPassword}]}></TextInput>

            <View style={{alignSelf: 'center'}}>
              <Text style={styles.label}>Confirm Password</Text>
            </View>
              
            <TextInput onChangeText={(inputConfirmPassword) => {
              updateConfirmPassword(inputConfirmPassword);
              updateValidPassword(checkRegPasswordForColourChange(password));
              updateValidConfirmPassword(matchPasswordForColourChange(password, inputConfirmPassword));
              updateRegister(validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
              }} style = {[styles.input, {backgroundColor:validConfirmPassword}]}></TextInput>

            <CustomButton onPress={()=>{
              console.log(tryRegister(username, email, confirmEmail, password, confirmPassword));
            }} label={"Register"} disabled = {allowRegister} fontSize={22.5}/>
            <CustomButton onPress={()=>(navigation.navigate('Login'))} label={"Login"} fontSize={15}/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}
