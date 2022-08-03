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
function Login(props) {
    const [email, updateEmail] = useState("")
    const [password, updatePassword] = useState("")
    const [validEmailState, updateEmailState] = useState('#353535')
    const [validPasswordState, updatePasswordState] = useState('#353535')
    return (<ScrollView contentContainerStyle={{ justifyContent: "space-around" }}>
        <View style={{ alignSelf: 'center' }}>
            <Text style={[styles.text, { fontSize: 20 }]}>{"\n"}Email</Text>
        </View>


        <TextInput style={[styles.input, { backgroundColor: validEmailState }]} onChangeText={(emailInput) => {
            updateEmail(emailInput);
            updateEmailState(checkEmailForColourChange(emailInput));
        }} />
        <View style={{ alignSelf: 'center' }}>
            <Text style={[styles.text, { fontSize: 20 }]}>{"\n"}Password</Text>
        </View>

        <TextInput style={[styles.input, { backgroundColor: validPasswordState }]} onChangeText={(passwordInput) => {
            updatePassword(passwordInput);
            updatePasswordState(checkPasswordForColourChange(passwordInput));

        }}
            secureTextEntry={true} />

        <CustomButton onPress={() => (tryLogin(email, password, (result)=>{
            if (result === 'LOGGED IN'){
                props.alreadyLoggedIn('Events');
                return
            }else if (result === false){
                alert('Login Failed \nTry Again')
                return
            }
             
        }))} label={"Login"} fontSize={22.5} />
        <CustomButton onPress={props.registerInstead} label={"Register Instead"} fontSize={15} />


    </ScrollView>)
}

function Register(props) {
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
    return (<KeyboardAvoidingView>
        <ScrollView automaticallyAdjustKeyboardInsets={true} >
            <View style={styles.keyboardAvoidingInner} onPress={Keyboard.dismiss}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Username</Text>
                </View>

                <TextInput onChangeText={(inputUsername) => {
                    updateUsername(inputUsername);
                    updateValidUsername(checkUsernameForColourChange(inputUsername));

                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validUsername }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>{"\n"}Email</Text>
                </View>
                <TextInput onChangeText={(inputEmail) => {
                    updateEmail(inputEmail);
                    updateValidEmail(checkRegEmailForColourChange(inputEmail));
                    updateValidConfirmEmaill(matchEmailForColourChange(inputEmail, confirmEmail));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }}
                    style={[styles.input, { backgroundColor: validEmail }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Confirm Email</Text>

                </View>
                <TextInput onChangeText={(inputConfirmEmail) => {
                    updateConfirmEmail(inputConfirmEmail);
                    updateValidEmail(checkRegEmailForColourChange(email));
                    updateValidConfirmEmaill(matchEmailForColourChange(email, inputConfirmEmail));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validConfirmEmail }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>{"\n"}Password</Text>
                </View>
                <TextInput onChangeText={(inputPassword) => {
                    updatePassword(inputPassword);
                    updateValidPassword(checkRegPasswordForColourChange(inputPassword));
                    updateValidConfirmPassword(matchPasswordForColourChange(inputPassword, confirmPassword));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validPassword }]}></TextInput>

                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.label}>Confirm Password</Text>
                </View>

                <TextInput onChangeText={(inputConfirmPassword) => {
                    updateConfirmPassword(inputConfirmPassword);
                    updateValidPassword(checkRegPasswordForColourChange(password));
                    updateValidConfirmPassword(matchPasswordForColourChange(password, inputConfirmPassword));
                    updateRegister(!validateRegisterDetails(username, email, confirmEmail, password, confirmPassword));
                }} style={[styles.input, { backgroundColor: validConfirmPassword }]}></TextInput>

                <CustomButton onPress={() => {
                    tryRegister(username, email, confirmEmail, password, confirmPassword, (result)=>{
                        if (result === 'LOGGED IN'){
                            props.alreadyLoggedIn('Events')
                            return
                        }else if (result){
                            props.alreadyLoggedIn('Events')
                            return
                        }
                        alert('Unique Email and Username Required')
                    });
                }} label={"Register"} disabled={!allowRegister} fontSize={22.5} />
                <CustomButton onPress={props.loginInstead} label={"Login Instead"} fontSize={15} />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>)
}

export default function Account({navigation}) {
    const [accountNav, updateAccountNav] = useState({ login: '#525252', register: 'black', logout: 'black' });
    const [currentlyShowing, updateCurrentlyShowing] = useState({ login: 'true', register: 'none', logout: 'none' });


    return (
        <SafeAreaView style={[styles.safeAreaView, { alignSelf: 'center' }]}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                    backgroundColor: accountNav.login
                }} onPress={() => {
                    updateAccountNav({ login: '#525252', register: 'black', logout: 'black' });
                    updateCurrentlyShowing({ login: 'true', register: 'none', logout: 'none' });
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
                    updateAccountNav({ login: 'black', register: '#525252', logout: 'black' });
                    updateCurrentlyShowing({ login: 'none', register: 'true', logout: 'none' });
                }}>
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                        Register
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                    backgroundColor: accountNav.logout
                }} onPress={() => {
                    updateAccountNav({ login: 'black', register: 'black', logout: '#525252' });
                    updateCurrentlyShowing({ login: 'none', register: 'none', logout: 'true' });
                }}>
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ display: currentlyShowing.login }}>
                <Login registerInstead = {()=>{
                    updateAccountNav({ login: 'black', register: '#525252', logout: 'black' });
                    updateCurrentlyShowing({ login: 'none', register: 'true', logout: 'none' });
                }}alreadyLoggedIn = {navigation.navigate}/>
            </View>
            <View style={{ display: currentlyShowing.register }}>
                <Register loginInstead = {()=>{
                    updateAccountNav({ login: '#525252', register: 'black', logout: 'black' });
                    updateCurrentlyShowing({ login: 'true', register: 'none', logout: 'none' });
                }}
                alreadyLoggedIn = {navigation.navigate}/>
            </View>
            <View style={{ display: currentlyShowing.logout }}>
                <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 12, margin: 20 }}
                    onPress={() => {
                        ajax_handler('https://dylansoll.pythonanywhere.com/logout');
                        updateAccountNav({ login: '#525252', register: 'black', logout: 'black' });
                        updateCurrentlyShowing({ login: 'true', register: 'none', logout: 'none' });
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