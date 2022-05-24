import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import {Component} from 'react'
/*class Login2 extends Component {

    constructor (props) {
        super(props);
        this.state={
            email:'',
            password:''
        }
        this.login = this.login.bind(this); // you need this to be able to access state from login
    }
  
    login() {
        console.log('your email is', this.state.email);
        console.log('your password is', this.state.password);
    }
  
    
    }
*/
export default function Login(){
    state={
        email:'',
        password:''
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Text style={styles.pageHeading} onPress = {()=>{console.log(window.newVar)}}>{"\n"}Login</Text>
        
            <Text style={styles.text}>{"\n"}Email</Text>
            <TextInput style = {styles.input} onChangeText={(email)=> {state.email = email}}/>

            <Text style={styles.text}>{"\n"}Password</Text>
            <TextInput style = {styles.input} onChangeText={(password)=> {state.password = password}} secureTextEntry={true}/>
            <Button title="Login" onPress={()=>{
                alert(state.email)
            }} style={styles.buttonPrimary}/>
        </SafeAreaView>
    );

} 
