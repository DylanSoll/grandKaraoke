import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ajax_handler } from "../../static/js/ajaxhandler";
import { styles } from "../../static/styles/mainStyle";
import {
    tryLogin, checkEmailForColourChange, checkPasswordForColourChange,
    validateRegisterDetails, tryRegister, checkRegEmailForColourChange, checkUsernameForColourChange, matchEmailForColourChange, matchPasswordForColourChange, checkRegPasswordForColourChange
} from '../../static/js/loginRegisterScripts'
import CustomButton from '../customElements/customButton';
//import all dependencies 
function Login(props) {
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [validEmailState, updateEmailState] = useState('#353535');
    const [validPasswordState, updatePasswordState] = useState('#353535');
    //function for the login aspect of account screen
    const tryLoginResponseHandle = (result) => {
        if (result === 'LOGGED IN'){ //if already logged in, go to events page
            props.alreadyLoggedIn('Events');
            return
        }
        alert('Login Failed \nTry Again') //if the function did not exit, login failed
        return
    }
    const loginFunc = () => {
        tryLogin(email, password, tryLoginResponseHandle); //function to try login
    }
    return (<ScrollView contentContainerStyle={{ justifyContent: "space-around" }}>
        <View style={{ alignSelf: 'center' }}>
            <Text style={[styles.text, { fontSize: 20 }]}>{"\n"}Email</Text>
        </View>


        <TextInput style={[styles.input, { backgroundColor: validEmailState }]} onChangeText={(emailInput) => {
            updateEmail(emailInput); //updates the email field (value and background colour)
            updateEmailState(checkEmailForColourChange(emailInput));
        }} />
        <View style={{ alignSelf: 'center' }}>
            <Text style={[styles.text, { fontSize: 20 }]}>{"\n"}Password</Text>
        </View>

        <TextInput style={[styles.input, { backgroundColor: validPasswordState }]} onChangeText={(passwordInput) => {
            updatePassword(passwordInput); //same as email
            updatePasswordState(checkPasswordForColourChange(passwordInput));

        }} //secure entry treats as password
            secureTextEntry={true} />

        <CustomButton onPress={loginFunc} label={"Login"} fontSize={22.5} />
        <CustomButton onPress={props.registerInstead} label={"Register Instead"} fontSize={15} />


    </ScrollView>)
}

function Register(props) {
    //function for register part of account
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

    const [allowRegister, updateRegister] = useState(true);
    const RegisterFunc = () => {
        tryRegister(username, email, confirmEmail, password, confirmPassword, (result)=>{
            if (result === 'LOGGED IN' || result === true){ //if already logged in, return to events
                props.alreadyLoggedIn('Events')// or register succeeded
                return
            }
            alert('Unique Email and Username Required') //if invalid, alert cause
        });
    }
    return (<KeyboardAvoidingView>
        <ScrollView automaticallyAdjustKeyboardInsets={true} /*adjusts the screen so the keyboard never covers the input*/>
            <View style={styles.keyboardAvoidingInner} onPress={Keyboard.dismiss}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Username</Text>
                </View>

                <TextInput onChangeText={(inputUsername) => {
                    updateUsername(inputUsername); //validation and update username value
                    updateValidUsername(checkUsernameForColourChange(inputUsername));

                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validUsername }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>{"\n"}Email</Text>
                </View>
                <TextInput onChangeText={(inputEmail) => {
                    updateEmail(inputEmail); //validation and update email value
                    updateValidEmail(checkRegEmailForColourChange(inputEmail));
                    updateValidConfirmEmaill(matchEmailForColourChange(inputEmail, confirmEmail));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }}
                    style={[styles.input, { backgroundColor: validEmail }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Confirm Email</Text>

                </View>
                <TextInput onChangeText={(inputConfirmEmail) => {
                    updateConfirmEmail(inputConfirmEmail); //validation and updating confirmEmail val
                    updateValidEmail(checkRegEmailForColourChange(email));
                    updateValidConfirmEmaill(matchEmailForColourChange(email, inputConfirmEmail));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validConfirmEmail }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>{"\n"}Password</Text>
                </View>
                <TextInput onChangeText={(inputPassword) => {
                    updatePassword(inputPassword); //validation and updating password
                    updateValidPassword(checkRegPasswordForColourChange(inputPassword));
                    updateValidConfirmPassword(matchPasswordForColourChange(inputPassword, confirmPassword));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validPassword }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Confirm Password</Text>
                </View>

                <TextInput onChangeText={(inputConfirmPassword) => {
                    updateConfirmPassword(inputConfirmPassword); //updates the confirm password, colour, etc
                    updateValidPassword(checkRegPasswordForColourChange(password));
                    updateValidConfirmPassword(matchPasswordForColourChange(password, inputConfirmPassword));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                    //updates whether user can register or not
                }} style={[styles.input, { backgroundColor: validConfirmPassword }]}></TextInput>

                <CustomButton onPress={()=>{
                    RegisterFunc();
                }} label={"Register"} disabled={!allowRegister} fontSize={22.5} />
                <CustomButton onPress={props.loginInstead} label={"Login Instead"} fontSize={15} />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>)
}

export default function Account({navigation}) {
    const [accountNav, updateAccountNav] = useState({ login: '#525252', register: 'black', logout: 'black' });
    const [currentlyShowing, updateCurrentlyShowing] = useState({ login: 'true', register: 'none', logout: 'none' });
    //navigation variables
    function navigateTo(target) {
        let tempPill = {...accountNav}; //gets the active pills function and creates a temporary object
        let tempDisplays = {...currentlyShowing}; //repeats for active display
        const pillsVals = Object.keys(tempPill);
        pillsVals.forEach(key => {
          if (key === target) {
            tempPill[key] = '#525252'; //sets the target as highlighted and visible
            tempDisplays[key] = 'true';
            return
          }
          tempPill[key] = 'black'; //otherwise hide it and remove highlighting
          tempDisplays[key] = 'none';
        });
        updateAccountNav(tempPill); //updates the navigation variables
        updateCurrentlyShowing(tempDisplays);
      }
    return (
        <SafeAreaView style={[styles.safeAreaView, { alignSelf: 'center' }]}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                    backgroundColor: accountNav.login
                }} onPress={() => {
                    navigateTo('login');
                }}
                >
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                    backgroundColor: accountNav.register
                }} onPress={() => {
                    navigateTo('register');
                }}>
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                        Register
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                    backgroundColor: accountNav.logout
                }} onPress={() => {
                    navigateTo('logout');
                }}>
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ display: currentlyShowing.login }}>
                <Login registerInstead = {()=>{
                    navigateTo('register');
                }}alreadyLoggedIn = {navigation.navigate}/>
            </View>
            <View style={{ display: currentlyShowing.register }}>
                <Register loginInstead = {()=>{
                    navigateTo('login');
                }}
                alreadyLoggedIn = {navigation.navigate}/>
            </View>
            <View style={{ display: currentlyShowing.logout }}>
                <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 12, margin: 20 }}
                    onPress={() => {
                        ajax_handler('https://dylansoll.pythonanywhere.com/logout');
                        navigateTo('login'); //send logout request and move to login
                    }}
                    
                    alreadyLoggedIn = {()=>{navigation.navigate('Events')}}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, padding: 10 }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}